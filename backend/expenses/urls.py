from django.urls import path
from .views import (
    ExpenseListCreateView,
    ExpenseDetailView,
    DashboardSummaryView,
    ReceiptScanView,
)
from .auth_views import (
    RegisterView,
    VerifyOTPView,
    ForgotPasswordSendOTPView,
    ResetPasswordWithOTPView,
    UserProfileView,
    ChangePasswordView,
)

urlpatterns = [
    # Expense Endpoints
    path("", ExpenseListCreateView.as_view(), name="expense-list-create"),
    path("<int:pk>/", ExpenseDetailView.as_view(), name="expense-detail"),
    path("summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("scan/", ReceiptScanView.as_view(), name="receipt-scan"),

    # Auth & Profile Endpoints
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("forgot-password/send-otp/", ForgotPasswordSendOTPView.as_view(), name="forgot-password-send"),
    path("forgot-password/reset/", ResetPasswordWithOTPView.as_view(), name="forgot-password-reset"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]