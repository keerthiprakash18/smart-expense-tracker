from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from expenses.views import (
    RegisterView,
    RequestOTPView,
    UserProfileView,
    ExpenseListCreateView,
    ExpenseDetailView,
    DashboardSummaryView,
    ReceiptScanView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/request-otp/', RequestOTPView.as_view(), name='request_otp'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/expenses/', ExpenseListCreateView.as_view(), name='expense_list_create'),
    path('api/expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense_detail'),
    path('api/dashboard/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('api/scan-receipt/', ReceiptScanView.as_view(), name='scan_receipt'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)