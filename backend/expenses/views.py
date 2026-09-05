from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Expense
from .serializers import ExpenseSerializer
from django.db.models import Sum

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email', '')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        return Response({'message': 'OTP sent successfully'})

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def create(self, request, *args, **kwargs):
        title = request.data.get('title')
        amount = request.data.get('amount')
        category = request.data.get('category', 'General')
        date = request.data.get('date')

        if not title or not amount:
            return Response({'error': 'Title and amount are required'}, status=status.HTTP_400_BAD_REQUEST)

        expense = Expense.objects.create(
            user=request.user,
            title=title,
            amount=amount,
            category=category,
            date=date
        )
        serializer = self.get_serializer(expense)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        expenses = Expense.objects.filter(user=request.user)
        total = expenses.aggregate(Sum('amount'))['amount__sum'] or 0.0
        return Response({
            'total_expenses': float(total),
            'count': expenses.count()
        })

class ReceiptScanView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({'merchant': 'Sample Store', 'amount': 0.0, 'category': 'General'})