from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    currency = models.CharField(max_length=10, default='INR')
    monthly_budget = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('40000.00'))
    savings_goal = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('100000.00'))

    def __str__(self):
        return self.user.username

class Account(models.Model):
    ACCOUNT_TYPES = [
        ('BANK', 'Bank Account'),
        ('UPI', 'UPI'),
        ('CASH', 'Cash'),
        ('CARD', 'Credit / Debit Card'),
        ('WALLET', 'Digital Wallet')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='BANK')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} ({self.user.username})"

class Expense(models.Model):
    TRANSACTION_TYPES = [
        ('EXPENSE', 'Expense'),
        ('INCOME', 'Income'),
        ('TRANSFER', 'Transfer')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    title = models.CharField(max_length=200, default='Expense')
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='EXPENSE')
    category = models.CharField(max_length=100, default='General')
    date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)
    receipt_image = models.ImageField(upload_to='receipts/', blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-date', '-id']

    def __str__(self):
        return f"{self.title} - {self.amount}"