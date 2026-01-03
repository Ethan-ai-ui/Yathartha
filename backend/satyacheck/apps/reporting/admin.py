"""
Admin configuration for reporting.
"""

from django.contrib import admin
from .models import Report, MisinformationTrend, TopContent, UserStatistic


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    """Admin interface for reports."""
    
    list_display = ('title', 'report_type', 'start_date', 'end_date', 'is_public', 'created_at')
    list_filter = ('report_type', 'is_public', 'created_at')
    search_fields = ('title',)
    readonly_fields = ('id', 'created_at')


@admin.register(MisinformationTrend)
class MisinformationTrendAdmin(admin.ModelAdmin):
    """Admin interface for misinformation trends."""
    
    list_display = ('date', 'category', 'count', 'average_score', 'language')
    list_filter = ('category', 'language', 'date')
    search_fields = ('category',)
    readonly_fields = ('id', 'created_at')


@admin.register(TopContent)
class TopContentAdmin(admin.ModelAdmin):
    """Admin interface for top content."""
    
    list_display = ('title', 'rank', 'period', 'content_type', 'count')
    list_filter = ('period', 'content_type')
    search_fields = ('title',)
    readonly_fields = ('id', 'created_at')


@admin.register(UserStatistic)
class UserStatisticAdmin(admin.ModelAdmin):
    """Admin interface for user statistics."""
    
    list_display = ('username', 'role', 'period', 'submission_count', 'accuracy_score')
    list_filter = ('role', 'period')
    search_fields = ('username',)
    readonly_fields = ('id', 'created_at', 'updated_at')
