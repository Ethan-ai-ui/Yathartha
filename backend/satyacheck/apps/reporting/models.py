"""
Models for reporting and analytics.
"""

from django.db import models
import uuid


class Report(models.Model):
    """
    Model for generated reports and statistics.
    """
    
    REPORT_TYPE_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('custom', 'Custom'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=500)
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    
    # Report data (stored as JSON)
    data = models.JSONField(default=dict)
    
    # File storage
    file = models.FileField(
        upload_to='reports/',
        blank=True,
        null=True,
        help_text='Generated report file (CSV/PDF)'
    )
    
    # Metadata
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    is_public = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'report'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class MisinformationTrend(models.Model):
    """
    Track trends in misinformation categories over time.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    date = models.DateField()
    category = models.CharField(max_length=100)
    count = models.IntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    
    region = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=20, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'misinformation_trend'
        ordering = ['-date']
        unique_together = ['date', 'category', 'language']
    
    def __str__(self):
        return f"{self.category} - {self.date}"


class TopContent(models.Model):
    """
    Track most flagged and most verified content.
    """
    
    CONTENT_TYPE_CHOICES = (
        ('flagged', 'Most Flagged'),
        ('verified', 'Most Verified'),
        ('controversial', 'Most Controversial'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    period = models.CharField(max_length=50)  # 'today', 'week', 'month'
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    
    rank = models.IntegerField()
    title = models.CharField(max_length=500)
    submission_id = models.UUIDField()
    
    count = models.IntegerField()
    score = models.FloatField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'top_content'
        ordering = ['period', 'content_type', 'rank']
    
    def __str__(self):
        return f"{self.title} (Rank #{self.rank})"


class UserStatistic(models.Model):
    """
    Track user statistics and activity.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    user_id = models.UUIDField()
    username = models.CharField(max_length=255)
    role = models.CharField(max_length=50)
    
    # Activity
    submission_count = models.IntegerField(default=0)
    verification_count = models.IntegerField(default=0)
    flag_count = models.IntegerField(default=0)
    
    # Engagement
    active_days = models.IntegerField(default=0)
    last_active = models.DateTimeField(null=True, blank=True)
    
    # Reputation
    accuracy_score = models.FloatField(default=0.0)
    
    period = models.CharField(max_length=50)  # 'daily', 'weekly', 'monthly'
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_statistic'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.username} - {self.period}"
