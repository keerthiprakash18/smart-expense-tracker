from django.contrib import admin
from .models import Expense


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "amount",
        "category",
        "merchant",
        "expense_date",
        "created_at",
    )

    list_filter = (
        "category",
        "expense_date",
    )

    search_fields = (
        "title",
        "merchant",
    )