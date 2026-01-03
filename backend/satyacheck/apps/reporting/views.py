"""
Views for reporting and analytics.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
import csv
import json

from .models import Report, MisinformationTrend, TopContent, UserStatistic
from .serializers import (
    ReportSerializer, MisinformationTrendSerializer,
    TopContentSerializer, UserStatisticSerializer
)
from satyacheck.apps.submissions.models import Submission, VerificationResult

import logging
logger = logging.getLogger('satyacheck')


class ReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing reports.
    """
    
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return reports accessible to user."""
        user = self.request.user
        
        # Public reports and user's own reports
        return Report.objects.filter(
            Q(is_public=True) | Q(created_by=user)
        ).order_by('-created_at')
    
    @action(detail=False, methods=['post'])
    def generate_daily(self, request):
        """Generate daily report."""
        return self._generate_report('daily')
    
    @action(detail=False, methods=['post'])
    def generate_weekly(self, request):
        """Generate weekly report."""
        return self._generate_report('weekly')
    
    @action(detail=False, methods=['post'])
    def generate_monthly(self, request):
        """Generate monthly report."""
        return self._generate_report('monthly')
    
    @action(detail=True, methods=['get'])
    def export_csv(self, request, pk=None):
        """Export report as CSV."""
        report = self.get_object()
        
        response = Response(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="report_{report.id}.csv"'
        
        # Write CSV
        writer = csv.DictWriter(response, fieldnames=report.data.keys() if report.data else [])
        writer.writeheader()
        writer.writerow(report.data)
        
        return response
    
    @action(detail=True, methods=['get'])
    def export_json(self, request, pk=None):
        """Export report as JSON."""
        report = self.get_object()
        
        return Response(
            {
                'id': str(report.id),
                'title': report.title,
                'type': report.report_type,
                'data': report.data,
                'created_at': report.created_at,
            },
            content_type='application/json'
        )
    
    def _generate_report(self, report_type):
        """Generate a report."""
        # Calculate period
        if report_type == 'daily':
            start = timezone.now() - timedelta(days=1)
        elif report_type == 'weekly':
            start = timezone.now() - timedelta(days=7)
        else:  # monthly
            start = timezone.now() - timedelta(days=30)
        
        end = timezone.now()
        
        # Get submissions in period
        submissions = Submission.objects.filter(created_at__gte=start, created_at__lte=end)
        
        # Calculate statistics
        data = {
            'total_submissions': submissions.count(),
            'by_type': dict(
                submissions.values('submission_type').annotate(
                    count=Count('id')
                ).values_list('submission_type', 'count')
            ),
            'by_language': dict(
                submissions.values('language').annotate(
                    count=Count('id')
                ).values_list('language', 'count')
            ),
            'flagged': submissions.filter(is_flagged=True).count(),
            'verified': submissions.filter(status='completed').count(),
            'average_misinformation_score': submissions.filter(
                verification_result__isnull=False
            ).aggregate(
                Avg('verification_result__misinformation_score')
            )['verification_result__misinformation_score__avg'] or 0,
        }
        
        # Create report
        report = Report.objects.create(
            title=f"{report_type.capitalize()} Report",
            report_type=report_type,
            start_date=start,
            end_date=end,
            data=data,
            is_public=True
        )
        
        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnalyticsViewSet(viewsets.ViewSet):
    """
    ViewSet for analytics and statistics.
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get analytics overview."""
        submissions = Submission.objects.all()
        
        data = {
            'total_submissions': submissions.count(),
            'total_verified': submissions.filter(status='completed').count(),
            'total_flagged': submissions.filter(is_flagged=True).count(),
            'by_type': dict(
                submissions.values('submission_type').annotate(
                    count=Count('id')
                ).values_list('submission_type', 'count')
            ),
            'by_status': dict(
                submissions.values('status').annotate(
                    count=Count('id')
                ).values_list('status', 'count')
            ),
            'by_language': dict(
                submissions.values('language').annotate(
                    count=Count('id')
                ).values_list('language', 'count')
            ),
        }
        
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def misinformation_trends(self, request):
        """Get misinformation trends."""
        trends = MisinformationTrend.objects.all().order_by('-date')[:30]
        
        # Group by category
        data = {}
        for trend in trends:
            if trend.category not in data:
                data[trend.category] = []
            data[trend.category].append({
                'date': trend.date,
                'count': trend.count,
                'average_score': trend.average_score,
            })
        
        return Response(data)
    
    @action(detail=False, methods=['get'])
    def top_content(self, request):
        """Get top flagged and verified content."""
        period = request.query_params.get('period', 'week')
        
        if period == 'today':
            start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start = timezone.now() - timedelta(days=7)
        else:  # month
            start = timezone.now() - timedelta(days=30)
        
        # Most flagged
        flagged = Submission.objects.filter(
            is_flagged=True,
            created_at__gte=start
        ).values('title', 'id').annotate(count=Count('id')).order_by('-count')[:10]
        
        # Most verified
        verified = Submission.objects.filter(
            status='completed',
            created_at__gte=start
        ).annotate(count=Count('id')).order_by('-count')[:10]
        
        return Response({
            'period': period,
            'most_flagged': list(flagged),
            'most_verified': list(verified),
        })
    
    @action(detail=False, methods=['get'])
    def user_statistics(self, request):
        """Get user statistics."""
        period = request.query_params.get('period', 'week')
        
        # Calculate period
        if period == 'today':
            start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        elif period == 'week':
            start = timezone.now() - timedelta(days=7)
        else:  # month
            start = timezone.now() - timedelta(days=30)
        
        # Most active users
        from satyacheck.apps.users.models import User, UserActivity
        
        active_users = UserActivity.objects.filter(
            created_at__gte=start
        ).values('user').annotate(
            activity_count=Count('id')
        ).order_by('-activity_count')[:10]
        
        return Response({
            'period': period,
            'most_active_users': list(active_users),
        })
    
    @action(detail=False, methods=['get'])
    def system_health(self, request):
        """Get system health statistics."""
        from django.db import connection
        from django.db.models import Avg
        
        submissions = Submission.objects.all()
        
        data = {
            'pending_submissions': submissions.filter(status='pending').count(),
            'analyzing_submissions': submissions.filter(status='analyzing').count(),
            'average_analysis_time_seconds': 0,  # Would need to calculate based on created_at and analyzed_at
            'error_count': 0,  # Would track failed analyses
            'database_status': 'healthy',
        }
        
        return Response(data)


class TrendAnalysisViewSet(viewsets.ModelViewSet):
    """
    ViewSet for trend analysis.
    Admin only.
    """
    
    queryset = MisinformationTrend.objects.all()
    serializer_class = MisinformationTrendSerializer
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get trends by category."""
        category = request.query_params.get('category')
        
        if not category:
            return Response(
                {'error': 'Category is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        trends = MisinformationTrend.objects.filter(
            category=category
        ).order_by('-date')[:30]
        
        serializer = self.get_serializer(trends, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_language(self, request):
        """Get trends by language."""
        language = request.query_params.get('language')
        
        if not language:
            return Response(
                {'error': 'Language is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        trends = MisinformationTrend.objects.filter(
            language=language
        ).order_by('-date')[:30]
        
        serializer = self.get_serializer(trends, many=True)
        return Response(serializer.data)
