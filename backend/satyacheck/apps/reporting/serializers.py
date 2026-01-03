"""
Serializers for reporting and analytics.
"""

from rest_framework import serializers
from .models import Report, MisinformationTrend, TopContent, UserStatistic


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for reports."""
    
    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'data', 'file',
            'start_date', 'end_date', 'is_public', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'data', 'file']


class MisinformationTrendSerializer(serializers.ModelSerializer):
    """Serializer for misinformation trends."""
    
    class Meta:
        model = MisinformationTrend
        fields = [
            'id', 'date', 'category', 'count', 'average_score',
            'region', 'language', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TopContentSerializer(serializers.ModelSerializer):
    """Serializer for top content."""
    
    content_type_display = serializers.CharField(source='get_content_type_display', read_only=True)
    
    class Meta:
        model = TopContent
        fields = [
            'id', 'period', 'content_type', 'content_type_display',
            'rank', 'title', 'submission_id', 'count', 'score',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserStatisticSerializer(serializers.ModelSerializer):
    """Serializer for user statistics."""
    
    class Meta:
        model = UserStatistic
        fields = [
            'id', 'user_id', 'username', 'role', 'submission_count',
            'verification_count', 'flag_count', 'active_days',
            'last_active', 'accuracy_score', 'period',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
