import os
import tempfile
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Avg, Max
from django.db.models.functions import TruncMonth

from .models import Expense
from .serializers import ExpenseSerializer
from . import ocr

# Safe wrapper for OCR functions in ocr.py
def run_ocr(file_path):
    possible_funcs = [
        "extract_receipt_data",
        "extract_receipt_info",
        "extract_text",
        "parse_receipt",
        "scan_receipt",
    ]
    for func_name in possible_funcs:
        func = getattr(ocr, func_name, None)
        if callable(func):
            return func(file_path)
    raise AttributeError("No receipt extraction function found in ocr.py")


# 1. Expense List & Create (User Specific)
class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Expense.objects.filter(user=user).order_by("-expense_date", "-created_at")

        search = self.request.query_params.get("search", None)
        category = self.request.query_params.get("category", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)

        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(merchant__icontains=search)
        if category:
            queryset = queryset.filter(category=category)
        if start_date:
            queryset = queryset.filter(expense_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(expense_date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 2. Expense Detail, Update & Delete (User Specific)
class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


# 3. Dashboard Analytics Summary (User Specific)
class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_expenses = Expense.objects.filter(user=user)

        aggregates = user_expenses.aggregate(
            total=Sum("amount"),
            avg=Avg("amount"),
            highest=Max("amount"),
            count=Count("id"),
        )

        total_expenses = aggregates["total"] or 0
        total_records = aggregates["count"] or 0
        avg_expense = aggregates["avg"] or 0
        highest_expense = aggregates["highest"] or 0

        # Category breakdown
        category_summary = (
            user_expenses.values("category")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")
        )

        # Monthly breakdown
        monthly_summary = (
            user_expenses.annotate(month=TruncMonth("expense_date"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        formatted_monthly = []
        for item in monthly_summary:
            if item["month"]:
                formatted_monthly.append({
                    "month": item["month"].strftime("%b %Y"),
                    "total": float(item["total"]),
                })

        # Recent 5 transactions
        recent_expenses = user_expenses.order_by("-expense_date", "-created_at")[:5].values(
            "id", "title", "amount", "category", "merchant", "expense_date"
        )

        return Response({
            "total_expenses": float(total_expenses),
            "total_count": total_records,
            "avg_expense": round(float(avg_expense), 2),
            "highest_expense": float(highest_expense),
            "category_summary": list(category_summary),
            "monthly_summary": formatted_monthly,
            "recent_expenses": list(recent_expenses),
        })


# 4. OCR Receipt Scan View
class ReceiptScanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receipt_file = request.FILES.get("receipt")
        if not receipt_file:
            return Response({"error": "No receipt file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        suffix = os.path.splitext(receipt_file.name)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            for chunk in receipt_file.chunks():
                temp.write(chunk)
            temp_path = temp.name

        try:
            extracted_data = run_ocr(temp_path)
            return Response(extracted_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"OCR processing failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)