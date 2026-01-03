"""
Views for admin panel.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .models import AdminReport, ModerationQueue, UserBan
from .serializers import AdminReportSerializer, ModerationQueueSerializer, UserBanSerializer
from satyacheck.apps.users.models import User, UserActivity
from satyacheck.apps.submissions.models import Submission
import logging

logger = logging.getLogger('satyacheck')
audit_logger = logging.getLogger('satyacheck.audit')


class AdminReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin reports.
    Admin only.
    """
    
    queryset = AdminReport.objects.all()
    serializer_class = AdminReportSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def open_reports(self, request):
        """Get all open reports."""
        reports = AdminReport.objects.filter(status='open').order_by('-created_at')
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign report to moderator."""
        report = self.get_object()
        assigned_to_id = request.data.get('assigned_to')
        
        try:
            assigned_to = User.objects.get(id=assigned_to_id)
            report.assigned_to = assigned_to
            report.status = 'in_progress'
            report.save()
            
            audit_logger.info(f"Report {report.id} assigned to {assigned_to.username}")
            
            return Response({
                'success': True,
                'message': f'Report assigned to {assigned_to.get_display_name()}'
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve a report."""
        report = self.get_object()
        resolution_notes = request.data.get('resolution_notes', '')
        
        from django.utils import timezone
        report.status = 'resolved'
        report.resolution_notes = resolution_notes
        report.resolved_at = timezone.now()
        report.save()
        
        audit_logger.info(f"Report {report.id} resolved by {request.user.username}")
        
        return Response({
            'success': True,
            'message': 'Report resolved.'
        })


class ModerationQueueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for moderation queue.
    """
    
    queryset = ModerationQueue.objects.filter(is_completed=False)
    serializer_class = ModerationQueueSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def my_queue(self, request):
        """Get current moderator's queue."""
        queue = ModerationQueue.objects.filter(
            assigned_to=request.user,
            is_completed=False
        ).order_by('-priority', 'created_at')
        
        serializer = self.get_serializer(queue, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def assign_to_me(self, request, pk=None):
        """Assign moderation task to self."""
        task = self.get_object()
        task.assigned_to = request.user
        task.save()
        
        return Response({
            'success': True,
            'message': 'Task assigned to you.'
        })
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark moderation task as complete."""
        task = self.get_object()
        action_taken = request.data.get('action_taken')  # 'approve', 'reject', 'flag'
        notes = request.data.get('notes', '')
        
        submission = task.submission
        
        from django.utils import timezone
        
        if action_taken == 'approve':
            submission.status = 'completed'
            submission.verified_by = request.user
            submission.verification_notes = notes
            submission.verified_at = timezone.now()
        elif action_taken == 'reject':
            submission.status = 'rejected'
            submission.verified_by = request.user
            submission.verification_notes = notes
        elif action_taken == 'flag':
            submission.is_flagged = True
            submission.flag_reason = notes
        
        submission.save()
        
        task.is_completed = True
        task.completed_at = timezone.now()
        task.save()
        
        audit_logger.info(
            f"Moderation task {task.id} completed - Action: {action_taken} - By: {request.user.username}"
        )
        
        return Response({
            'success': True,
            'message': 'Moderation task completed.'
        })


class UserBanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user bans.
    Admin only.
    """
    
    queryset = UserBan.objects.all()
    serializer_class = UserBanSerializer
    permission_classes = [IsAdminUser]
    
    def create(self, request, *args, **kwargs):
        """Create a user ban."""
        user_id = request.data.get('user')
        reason = request.data.get('reason')
        description = request.data.get('description', '')
        is_permanent = request.data.get('is_permanent', False)
        unban_date = request.data.get('unban_date')
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if user is already banned
        if hasattr(user, 'ban') and user.ban.is_active():
            return Response(
                {'error': 'User is already banned.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create ban
        ban = UserBan.objects.create(
            user=user,
            reason=reason,
            description=description,
            is_permanent=is_permanent,
            unban_date=unban_date,
            banned_by=request.user
        )
        
        # Disable user account
        user.is_active = False
        user.save()
        
        audit_logger.info(
            f"User {user.username} banned - Reason: {reason} - By: {request.user.username}"
        )
        
        serializer = self.get_serializer(ban)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def unban(self, request, pk=None):
        """Unban a user."""
        ban = self.get_object()
        user = ban.user
        
        user.is_active = True
        user.save()
        
        ban.delete()
        
        audit_logger.info(f"User {user.username} unbanned - By: {request.user.username}")
        
        return Response({
            'success': True,
            'message': f'User {user.username} has been unbanned.'
        })


class AdminDashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for admin dashboard statistics.
    """
    
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get admin dashboard statistics."""
        from django.db.models import Count, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        # Calculate statistics
        total_submissions = Submission.objects.count()
        total_users = User.objects.count()
        open_reports = AdminReport.objects.filter(status='open').count()
        moderation_queue_count = ModerationQueue.objects.filter(is_completed=False).count()
        
        # Last 7 days submissions
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_submissions = Submission.objects.filter(
            created_at__gte=seven_days_ago
        ).count()
        
        # Average misinformation score
        avg_score = Submission.objects.filter(
            verification_result__isnull=False
        ).aggregate(
            Avg('verification_result__misinformation_score')
        )['verification_result__misinformation_score__avg']
        
        # Submissions by type
        submissions_by_type = dict(
            Submission.objects.values('submission_type').annotate(
                count=Count('id')
            ).values_list('submission_type', 'count')
        )
        
        # Submissions by status
        submissions_by_status = dict(
            Submission.objects.values('status').annotate(
                count=Count('id')
            ).values_list('status', 'count')
        )
        
        return Response({
            'total_submissions': total_submissions,
            'total_users': total_users,
            'open_reports': open_reports,
            'moderation_queue': moderation_queue_count,
            'recent_submissions_7_days': recent_submissions,
            'average_misinformation_score': round(avg_score or 0, 2),
            'submissions_by_type': submissions_by_type,
            'submissions_by_status': submissions_by_status,
        })
