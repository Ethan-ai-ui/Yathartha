"""
URL routing for AI endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AIModelViewSet, AnalysisTestViewSet

router = DefaultRouter()
router.register(r'models', AIModelViewSet, basename='ai-model')
router.register(r'test', AnalysisTestViewSet, basename='analysis-test')

urlpatterns = [
    path('', include(router.urls)),
]
