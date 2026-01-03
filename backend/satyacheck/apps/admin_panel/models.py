"""
Admin panel models.
"""

from django.db import models
from satyacheck.apps.users.models import User
from satyacheck.apps.submissions.models import Submission
import uuid


class AdminReport(models.Model):
    """
    Model for admin reports on submissions.
    """
    
    REPORT_TYPE_CHOICES = (
        ('user_report', 'User Report'),
        ('content_review', 'Content Review'),
        ('pattern_detection', 'Pattern Detection'),
    )
    
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Report Details
    title = models.CharField(max_length=500)
    description = models.TextField()
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    
    # Related Objects
    submission = models.ForeignKey(
        Submission,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='admin_reports'
    )
    reported_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_reports'
    )
    
    # Metadata
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_reports'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_reports'
    )
    
    # Resolution
    resolution_notes = models.TextField(blank=True, null=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'admin_report'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.status})"


class ModerationQueue(models.Model):
    """
    Queue of submissions waiting for moderation.
    """
    
    PRIORITY_CHOICES = (
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    submission = models.OneToOneField(
        Submission,
        on_delete=models.CASCADE,
        related_name='moderation_queue'
    )
    
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    reason = models.TextField(help_text='Reason for moderation')
    
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_queue'
    )
    
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'moderation_queue'
        ordering = ['-priority', 'created_at']
    
    def __str__(self):
        return f"Queue item for {self.submission.title}"


class UserBan(models.Model):
    """
    Model for managing banned users.
    """
    
    BAN_REASON_CHOICES = (
        ('spam', 'Spam'),
        ('harassment', 'Harassment'),
        ('misinformation', 'Persistent Misinformation'),
        ('violation', 'Terms of Service Violation'),
        ('other', 'Other'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='ban'
    )
    
    reason = models.CharField(max_length=100, choices=BAN_REASON_CHOICES)
    description = models.TextField()
    
    is_permanent = models.BooleanField(default=False)
    unban_date = models.DateTimeField(blank=True, null=True)
    
    banned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='bans_issued'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_ban'
    
    def __str__(self):
        return f"Ban for {self.user.username}"
    
    def is_active(self):
        """Check if ban is currently active."""
        from django.utils import timezone
        if self.is_permanent:
            return True
        if self.unban_date and timezone.now() > self.unban_date:
            return False
        return True
