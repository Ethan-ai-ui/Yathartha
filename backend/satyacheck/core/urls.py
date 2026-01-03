"""
Main URL Configuration for SatyaCheck backend.
Routes all API endpoints to respective app views.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Admin Panel
    path('admin/', admin.site.urls),
    
    # API Schema Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # JWT Token Endpoints
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App URLs
    path('api/v1/auth/', include('satyacheck.apps.users.urls')),
    path('api/v1/submissions/', include('satyacheck.apps.submissions.urls')),
    path('api/v1/ai/', include('satyacheck.apps.ai.urls')),
    path('api/v1/admin/', include('satyacheck.apps.admin_panel.urls')),
    path('api/v1/reports/', include('satyacheck.apps.reporting.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom error handlers
handler404 = 'satyacheck.core.views.custom_404'
handler500 = 'satyacheck.core.views.custom_500'
