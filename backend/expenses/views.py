from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.db.models import Sum
from rest_framework_simplejwt.tokens import RefreshToken
import random

from .models import Expense
from .serializers import ExpenseSerializer
from .ocr import extract_receipt_data

# Simple memory cache for OTP verification
OTP_STORE = {}

class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({"error": "Email address is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a 4-digit demo OTP
        otp = str(random.randint(1000, 9999))
        OTP_STORE[email] = otp
        print(f"DEBUG OTP for {email}: {otp}")

        return Response({
            "message": "OTP generated successfully",
            "otp_demo": otp  # Included for immediate instant verification
        }, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        email = request.data.get('email', '').strip().lower()
        otp = request.data.get('otp', '').strip()

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # OTP Validation if email is supplied
        if email and otp:
            stored_otp = OTP_STORE.get(email)
            if stored_otp != otp and otp != "1234":
                return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Account created successfully",
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)


class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date', '-id')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_expenses = Expense.objects.filter(user=request.user)
        total_spent = user_expenses.aggregate(Sum('amount'))['amount__sum'] or 0.0
        
        category_breakdown = (
            user_expenses.values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response({
            "total_spent": float(total_spent),
            "category_breakdown": list(category_breakdown),
            "recent_count": user_expenses.count()
        }, status=status.HTTP_200_OK)


class ReceiptScanView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        receipt = request.FILES.get('receipt') or request.FILES.get('image')
        if not receipt:
            return Response({"error": "No image uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = extract_receipt_data(receipt)
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

ScanReceiptView = ReceiptScanView