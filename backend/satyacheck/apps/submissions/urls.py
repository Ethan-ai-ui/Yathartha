"""
URL routing for submissions.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubmissionViewSet, VerificationResultViewSet, SourceDatabaseViewSet

router = DefaultRouter()
router.register(r'', SubmissionViewSet, basename='submission')
router.register(r'results', VerificationResultViewSet, basename='verification-result')
router.register(r'sources', SourceDatabaseViewSet, basename='source-database')

urlpatterns = [
    path('', include(router.urls)),
]
