from django.contrib import admin
from .models import Expense, Account, UserProfile

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'amount', 'category', 'transaction_type', 'date', 'created_at')
    list_filter = ('transaction_type', 'category', 'date')
    search_fields = ('title', 'user__username', 'category')

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'account_type', 'balance', 'created_at')
    list_filter = ('account_type',)
    search_fields = ('name', 'user__username')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'phone', 'currency', 'monthly_budget')
    search_fields = ('user__username', 'phone')