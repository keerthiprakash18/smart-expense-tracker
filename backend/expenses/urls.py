from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # JWT Auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Also support without /api prefix to prevent 404
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair_no_api'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh_no_api'),
    # Expenses App
    path('api/', include('expenses.urls')),
    path('', include('expenses.urls')),
]