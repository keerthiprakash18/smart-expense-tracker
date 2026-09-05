from django.urls import path
from .views import (
    RegisterView,
    ExpenseListCreateView,
    ExpenseDetailView,
    DashboardSummaryView,
    ReceiptScanView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('scan-receipt/', ReceiptScanView.as_view(), name='scan-receipt'),
]