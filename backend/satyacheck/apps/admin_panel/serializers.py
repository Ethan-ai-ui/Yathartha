"""
Serializers for admin panel.
"""

from rest_framework import serializers
from .models import AdminReport, ModerationQueue, UserBan
from satyacheck.apps.users.serializers import UserSerializer
from satyacheck.apps.submissions.serializers import SubmissionListSerializer


class AdminReportSerializer(serializers.ModelSerializer):
    """Serializer for admin reports."""
    
    created_by_user = UserSerializer(source='created_by', read_only=True)
    assigned_to_user = UserSerializer(source='assigned_to', read_only=True)
    
    class Meta:
        model = AdminReport
        fields = [
            'id', 'title', 'description', 'report_type', 'status',
            'submission', 'reported_user', 'created_by', 'created_by_user',
            'assigned_to', 'assigned_to_user', 'resolution_notes',
            'resolved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ModerationQueueSerializer(serializers.ModelSerializer):
    """Serializer for moderation queue."""
    
    submission_details = SubmissionListSerializer(source='submission', read_only=True)
    assigned_to_user = UserSerializer(source='assigned_to', read_only=True)
    
    class Meta:
        model = ModerationQueue
        fields = [
            'id', 'submission', 'submission_details', 'priority', 'reason',
            'assigned_to', 'assigned_to_user', 'is_completed', 'completed_at',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'completed_at']


class UserBanSerializer(serializers.ModelSerializer):
    """Serializer for user bans."""
    
    banned_by_user = UserSerializer(source='banned_by', read_only=True)
    
    class Meta:
        model = UserBan
        fields = [
            'id', 'user', 'reason', 'description', 'is_permanent',
            'unban_date', 'banned_by', 'banned_by_user', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
