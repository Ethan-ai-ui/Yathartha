"""
Django admin configuration for User models.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPVerification, UserActivity


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin interface for User model."""
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('User Role & Verification', {
            'fields': ('role', 'is_verified', 'is_phone_verified', 'is_identity_verified')
        }),
        ('Profile', {
            'fields': ('bio', 'location', 'organization', 'profile_picture', 'phone')
        }),
        ('Security', {
            'fields': ('two_factor_enabled', 'two_factor_method', 'last_login_ip')
        }),
        ('Statistics', {
            'fields': ('submission_count', 'last_submission_date')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at', 'deleted_at')
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at', 'last_login_ip', 'submission_count')
    
    list_display = ('username', 'email', 'role', 'is_verified', 'is_active', 'created_at')
    list_filter = ('role', 'is_verified', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'phone')


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    """Admin interface for OTP verification."""
    
    list_display = ('user', 'verification_type', 'email_or_phone', 'is_verified', 'created_at')
    list_filter = ('verification_type', 'is_verified', 'created_at')
    search_fields = ('user__username', 'user__email', 'email_or_phone')
    readonly_fields = ('code', 'created_at', 'verified_at', 'expires_at')


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    """Admin interface for user activity logs."""
    
    list_display = ('user', 'activity_type', 'description', 'ip_address', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'ip_address', 'description')
    readonly_fields = ('created_at', 'ip_address', 'user_agent', 'metadata')
    
    def has_add_permission(self, request):
        """Disable manual creation of activity logs."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Disable deletion of activity logs."""
        return False
