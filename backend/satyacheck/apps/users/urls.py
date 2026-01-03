"""
URL routing for user authentication and management.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, UserActivityViewSet

router = DefaultRouter()
router.register(r'activities', UserActivityViewSet, basename='user-activity')

urlpatterns = [
    # Auth endpoints
    path('signup/', AuthViewSet.as_view({'post': 'signup'}), name='signup'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='login'),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='logout'),
    path('profile/', AuthViewSet.as_view({'get': 'profile'}), name='profile'),
    path('update-profile/', AuthViewSet.as_view({'patch': 'update_profile'}), name='update-profile'),
    path('change-password/', AuthViewSet.as_view({'post': 'change_password'}), name='change-password'),
    path('request-otp/', AuthViewSet.as_view({'post': 'request_otp'}), name='request-otp'),
    path('verify-otp/', AuthViewSet.as_view({'post': 'verify_otp'}), name='verify-otp'),
    
    # Activity logs
    path('', include(router.urls)),
]
