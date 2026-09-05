from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import Expense, Account, UserProfile
from .serializers import ExpenseSerializer
from django.db.models import Sum
from decimal import Decimal

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

        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(user=user)
        Account.objects.create(user=user, name='Primary Bank', account_type='BANK', balance=Decimal('45000.00'))
        Account.objects.create(user=user, name='Cash Vault', account_type='CASH', balance=Decimal('5000.00'))
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date', '-id')

    def create(self, request, *args, **kwargs):
        title = request.data.get('title', 'Quick Record')
        amount_raw = request.data.get('amount', 0)
        category = request.data.get('category', 'General')
        t_type = request.data.get('transaction_type', 'EXPENSE')
        p_method = request.data.get('payment_method', 'UPI')
        date = request.data.get('date')

        try:
            amount = Decimal(str(amount_raw))
        except Exception:
            amount = Decimal('0.00')

        expense = Expense.objects.create(
            user=request.user,
            title=title,
            amount=amount,
            transaction_type=t_type,
            category=category,
            payment_method=p_method,
            date=date
        )
        return Response({
            'id': expense.id,
            'title': expense.title,
            'amount': float(expense.amount),
            'category': expense.category,
            'transaction_type': expense.transaction_type,
            'payment_method': expense.payment_method,
            'date': str(expense.date)
        }, status=status.HTTP_201_CREATED)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        txs = Expense.objects.filter(user=request.user)
        total_exp = txs.filter(transaction_type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
        total_inc = txs.filter(transaction_type='INCOME').aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
        net_balance = total_inc - total_exp

        return Response({
            'total_income': float(total_inc),
            'total_expenses': float(total_exp),
            'net_balance': float(net_balance),
            'count': txs.count()
        })

class ReceiptScanView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        return Response({'merchant': 'Starbucks Reserve', 'amount': 450.0, 'category': 'Food & Dining'})