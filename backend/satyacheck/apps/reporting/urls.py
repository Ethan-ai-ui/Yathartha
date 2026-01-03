"""
URL routing for reporting and analytics.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReportViewSet, AnalyticsViewSet,
    TrendAnalysisViewSet
)

router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')
router.register(r'analytics', AnalyticsViewSet, basename='analytics')
router.register(r'trends', TrendAnalysisViewSet, basename='trend-analysis')

urlpatterns = [
    path('', include(router.urls)),
]
