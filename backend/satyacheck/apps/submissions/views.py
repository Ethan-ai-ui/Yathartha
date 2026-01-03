"""
Views for handling submissions and verification.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from django.db.models import Q
import logging

from .models import Submission, VerificationResult, SourceDatabase
from .serializers import (
    SubmissionListSerializer, SubmissionDetailSerializer,
    SubmissionCreateSerializer, SubmissionUpdateSerializer,
    VerificationResultSerializer, SourceDatabaseSerializer,
    BulkSubmissionSerializer
)
from satyacheck.apps.users.models import UserActivity

logger = logging.getLogger('satyacheck')
audit_logger = logging.getLogger('satyacheck.audit')


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing content submissions.
    Supports all submission types and verification workflow.
    """
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['submission_type', 'language', 'status', 'is_flagged']
    search_fields = ['title', 'description', 'text_content']
    ordering_fields = ['created_at', 'analyzed_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Return submissions based on user permissions.
        Users see only their submissions; admins see all.
        """
        user = self.request.user
        
        if user.is_admin_user():
            return Submission.objects.all().select_related('user', 'verified_by')
        
        return Submission.objects.filter(
            Q(user=user) | Q(status='completed', is_flagged=False)
        ).select_related('user', 'verified_by')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return SubmissionCreateSerializer
        elif self.action == 'update' or self.action == 'partial_update':
            return SubmissionUpdateSerializer
        elif self.action == 'retrieve':
            return SubmissionDetailSerializer
        else:
            return SubmissionListSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Create a new submission.
        POST: /api/v1/submissions/
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        submission = serializer.save()
        
        # Update user submission count
        if request.user.is_authenticated:
            request.user.submission_count += 1
            request.user.last_submission_date = timezone.now()
            request.user.save(update_fields=['submission_count', 'last_submission_date'])
        
        # Log activity
        audit_logger.info(
            f"Submission created: {submission.id} - Type: {submission.submission_type} - User: {request.user.username if request.user.is_authenticated else 'Anonymous'}"
        )
        
        UserActivity.objects.create(
            user=request.user,
            activity_type='submission',
            description=f'Submitted {submission.submission_type} content: {submission.title}',
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
            metadata={'submission_id': str(submission.id)}
        )
        
        # Trigger AI analysis (async)
        from satyacheck.apps.ai.tasks import analyze_submission
        analyze_submission.delay(str(submission.id))
        
        submission.status = 'analyzing'
        submission.save(update_fields=['status'])
        
        return Response(
            SubmissionDetailSerializer(submission).data,
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, *args, **kwargs):
        """
        Get submission details.
        GET: /api/v1/submissions/<id>/
        """
        submission = self.get_object()
        
        # Check permissions
        if not request.user.is_admin_user() and submission.user != request.user:
            if submission.is_flagged or submission.status != 'completed':
                return Response(
                    {'error': 'You do not have permission to view this submission.'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = self.get_serializer(submission)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        """
        Delete a submission (soft delete).
        DELETE: /api/v1/submissions/<id>/
        """
        submission = self.get_object()
        
        # Check permissions
        if submission.user != request.user and not request.user.is_admin_user():
            return Response(
                {'error': 'You can only delete your own submissions.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Soft delete
        submission.status = 'rejected'
        submission.save(update_fields=['status'])
        
        audit_logger.info(f"Submission deleted: {submission.id} - User: {request.user.username}")
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """
        Get verification results for a submission.
        GET: /api/v1/submissions/<id>/results/
        """
        submission = self.get_object()
        
        if not hasattr(submission, 'verification_result'):
            return Response(
                {'error': 'Verification not yet completed.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = VerificationResultSerializer(submission.verification_result)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def flag(self, request, pk=None):
        """
        Flag a submission for review.
        POST: /api/v1/submissions/<id>/flag/
        """
        submission = self.get_object()
        reason = request.data.get('reason', '')
        
        submission.is_flagged = True
        submission.flag_reason = reason
        submission.save(update_fields=['is_flagged', 'flag_reason'])
        
        audit_logger.info(
            f"Submission flagged: {submission.id} - Reason: {reason} - By: {request.user.username}"
        )
        
        return Response(
            {'success': True, 'message': 'Submission flagged for review.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'])
    def bulk_action(self, request):
        """
        Perform bulk actions on submissions.
        POST: /api/v1/submissions/bulk-action/
        """
        serializer = BulkSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        submission_ids = serializer.validated_data['submission_ids']
        action = serializer.validated_data['action']
        reason = serializer.validated_data.get('reason', '')
        
        submissions = Submission.objects.filter(id__in=submission_ids)
        
        # Check permissions - users can only bulk action their own
        if not request.user.is_admin_user():
            submissions = submissions.filter(user=request.user)
        
        if action == 'flag':
            submissions.update(is_flagged=True, flag_reason=reason)
        elif action == 'unflag':
            submissions.update(is_flagged=False, flag_reason='')
        elif action == 'delete':
            submissions.update(status='rejected')
        elif action == 'export':
            # Trigger export task
            pass
        
        audit_logger.info(
            f"Bulk action '{action}' on {len(submission_ids)} submissions - By: {request.user.username}"
        )
        
        return Response(
            {
                'success': True,
                'message': f'Bulk action \'{action}\' completed on {submissions.count()} submissions.'
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get submission statistics.
        GET: /api/v1/submissions/statistics/
        """
        from django.db.models import Count
        
        submissions = Submission.objects.all()
        
        stats = {
            'total_submissions': submissions.count(),
            'by_type': dict(submissions.values('submission_type').annotate(count=Count('id')).values_list('submission_type', 'count')),
            'by_language': dict(submissions.values('language').annotate(count=Count('id')).values_list('language', 'count')),
            'by_status': dict(submissions.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'flagged_count': submissions.filter(is_flagged=True).count(),
            'verified_count': submissions.filter(status='completed').count(),
        }
        
        return Response(stats)
    
    @staticmethod
    def _get_client_ip(request):
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class VerificationResultViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing verification results.
    """
    
    queryset = VerificationResult.objects.all()
    serializer_class = VerificationResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['primary_category', 'confidence_level']
    ordering = ['-created_at']


class SourceDatabaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing trusted source database.
    Only admins can add/edit sources.
    """
    
    queryset = SourceDatabase.objects.all()
    serializer_class = SourceDatabaseSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['source_type', 'country', 'is_verified']
    search_fields = ['name', 'url']
    
    def get_permissions(self):
        """Allow read for all, write for admins only."""
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Create new source - admin only."""
        if not request.user.is_admin_user():
            return Response(
                {'error': 'Only admins can add sources.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(added_by=request.user)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
