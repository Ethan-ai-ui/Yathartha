"""
Admin configuration for admin panel.
"""

from django.contrib import admin
from .models import AdminReport, ModerationQueue, UserBan


@admin.register(AdminReport)
class AdminReportAdmin(admin.ModelAdmin):
    """Admin interface for admin reports."""
    
    list_display = ('title', 'report_type', 'status', 'assigned_to', 'created_at')
    list_filter = ('report_type', 'status', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ModerationQueue)
class ModerationQueueAdmin(admin.ModelAdmin):
    """Admin interface for moderation queue."""
    
    list_display = ('submission', 'priority', 'assigned_to', 'is_completed', 'created_at')
    list_filter = ('priority', 'is_completed')
    search_fields = ('submission__title', 'reason')
    readonly_fields = ('id', 'created_at', 'completed_at')


@admin.register(UserBan)
class UserBanAdmin(admin.ModelAdmin):
    """Admin interface for user bans."""
    
    list_display = ('user', 'reason', 'is_permanent', 'unban_date', 'banned_by', 'created_at')
    list_filter = ('reason', 'is_permanent', 'created_at')
    search_fields = ('user__username', 'description')
    readonly_fields = ('id', 'created_at')
