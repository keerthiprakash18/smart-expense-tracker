from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from expenses.views import (
    RegisterView,
    RequestOTPView,
    ExpenseListCreateView,
    ExpenseDetailView,
    DashboardSummaryView,
    ReceiptScanView,
)

# Shared direct endpoints to never fail with or without /api prefix
api_patterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
    path('dashboard/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('scan-receipt/', ReceiptScanView.as_view(), name='scan-receipt'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    # Handles /api/... calls from frontend proxy & mobile
    path('api/', include(api_patterns)),
    # Handles direct calls without /api/ prefix
    path('', include(api_patterns)),
]