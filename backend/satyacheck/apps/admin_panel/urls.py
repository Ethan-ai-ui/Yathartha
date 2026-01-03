"""
URL routing for admin panel.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminReportViewSet, ModerationQueueViewSet,
    UserBanViewSet, AdminDashboardViewSet
)

router = DefaultRouter()
router.register(r'reports', AdminReportViewSet, basename='admin-report')
router.register(r'moderation', ModerationQueueViewSet, basename='moderation-queue')
router.register(r'bans', UserBanViewSet, basename='user-ban')
router.register(r'dashboard', AdminDashboardViewSet, basename='admin-dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
