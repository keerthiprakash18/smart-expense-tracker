import random
from decimal import Decimal
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db.models import Sum

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Account, Expense, UserProfile
from .serializers import ExpenseSerializer


# ==========================================
# OTP AUTHENTICATION VIEWS
# ==========================================

class RequestOTPView(APIView):
    """
    Email alladhu Phone-ku 6-digit OTP generate panni console-la print pannum.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('phone')

        if not identifier:
            return Response(
                {'error': 'Email alladhu phone number kandippa thevai.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 6-digit OTP generation
        otp = str(random.randint(100000, 999999))

        # 5 minutes (300 seconds) cache-la store panrom
        cache_key = f"otp_{identifier}"
        cache.set(cache_key, otp, timeout=300)

        # Dev verification-kaga terminal-la print aagum
        print("\n" + "=" * 40)
        print(f"[OTP DEV LOG] Target: {identifier} | OTP: {otp}")
        print("=" * 40 + "\n")

        return Response({
            'message': 'OTP successfully anupiyachu.',
            'identifier': identifier,
            'expires_in': '5 minutes'
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    OTP verify panni authenticate panna view.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('phone')
        user_otp = request.data.get('otp')

        if not identifier or not user_otp:
            return Response(
                {'error': 'Identifier matrum OTP rendume thevai.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f"otp_{identifier}"
        saved_otp = cache.get(cache_key)

        if not saved_otp:
            return Response(
                {'error': 'OTP expire aayiduchu alladhu generate pannala.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if str(saved_otp) == str(user_otp):
            cache.delete(cache_key)
            return Response(
                {'message': 'OTP verification successful!'},
                status=status.HTTP_200_OK
            )

        return Response(
            {'error': 'Thappana OTP. Check pannitu marubadi try pannunga.'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ==========================================
# USER & TRANSACTION VIEWS
# ==========================================

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
        Account.objects.create(user=user, name='Primary Bank', account_type='BANK', balance=Decimal('50000.00'))
        Account.objects.create(user=user, name='Cash Wallet', account_type='CASH', balance=Decimal('5000.00'))
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
            date=date
        )
        return Response({
            'id': expense.id,
            'title': expense.title,
            'amount': float(expense.amount),
            'category': expense.category,
            'transaction_type': expense.transaction_type,
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
        return Response({'merchant': 'Apple Store Marina', 'amount': 1250.0, 'category': 'Shopping'})