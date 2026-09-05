from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from expenses.views import RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT Authentication Endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Direct Auth Fallbacks
    path('api/register/', RegisterView.as_view(), name='api-register'),
    path('register/', RegisterView.as_view(), name='root-register'),
    # Application Routes
    path('api/', include('expenses.urls')),
]