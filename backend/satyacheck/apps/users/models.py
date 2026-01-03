"""
User authentication models for SatyaCheck.
Includes custom user model with role-based access control.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
import uuid


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Includes role-based access control and additional fields.
    """
    
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('journalist', 'Journalist'),
        ('ngo', 'NGO'),
        ('admin', 'Admin'),
    )
    
    # Primary Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, help_text='User email address')
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text='User phone number'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='citizen',
        help_text='User role in the system'
    )
    
    # Profile Information
    bio = models.TextField(blank=True, null=True, help_text='User bio/description')
    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        help_text='User profile picture'
    )
    location = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='User location/city'
    )
    organization = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='User organization (for journalists/NGOs)'
    )
    
    # Verification Status
    is_verified = models.BooleanField(
        default=False,
        help_text='Email verification status'
    )
    is_phone_verified = models.BooleanField(
        default=False,
        help_text='Phone number verification status'
    )
    is_identity_verified = models.BooleanField(
        default=False,
        help_text='Identity verification (for journalists/NGOs)'
    )
    
    # Security Fields
    two_factor_enabled = models.BooleanField(
        default=False,
        help_text='Two-factor authentication enabled'
    )
    two_factor_method = models.CharField(
        max_length=20,
        choices=(
            ('email', 'Email OTP'),
            ('sms', 'SMS OTP'),
        ),
        default='email',
        blank=True,
        null=True
    )
    
    # Metadata
    last_login_ip = models.GenericIPAddressField(blank=True, null=True)
    last_submission_date = models.DateTimeField(blank=True, null=True)
    submission_count = models.IntegerField(default=0, help_text='Total submissions by user')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True, help_text='Soft delete timestamp')
    
    class Meta:
        db_table = 'auth_user'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_verified']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_moderator(self):
        """Check if user is a moderator (journalist or NGO)."""
        return self.role in ['journalist', 'ngo', 'admin']
    
    def is_admin_user(self):
        """Check if user is an admin."""
        return self.role == 'admin'
    
    def get_display_name(self):
        """Get user's display name."""
        return self.get_full_name() or self.username


class OTPVerification(models.Model):
    """
    Model for storing OTP verification codes.
    Used for email and phone verification.
    """
    
    TYPE_CHOICES = (
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('2fa', 'Two-Factor Auth'),
        ('password_reset', 'Password Reset'),
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='otp_verifications',
        help_text='User requesting OTP'
    )
    code = models.CharField(
        max_length=6,
        validators=[MinLengthValidator(6)],
        help_text='6-digit OTP code'
    )
    verification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        help_text='Type of verification'
    )
    email_or_phone = models.CharField(
        max_length=255,
        help_text='Email or phone to verify'
    )
    is_verified = models.BooleanField(
        default=False,
        help_text='Whether OTP has been verified'
    )
    attempts = models.IntegerField(
        default=0,
        help_text='Number of failed attempts'
    )
    max_attempts = 5
    
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(help_text='OTP expiration time')
    
    class Meta:
        db_table = 'otp_verification'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'verification_type']),
            models.Index(fields=['email_or_phone']),
        ]
    
    def __str__(self):
        return f"OTP for {self.user} ({self.verification_type})"
    
    def is_valid(self):
        """Check if OTP is still valid (not expired, not over max attempts)."""
        from django.utils import timezone
        if self.is_verified:
            return False
        if self.attempts >= self.max_attempts:
            return False
        if timezone.now() > self.expires_at:
            return False
        return True


class UserActivity(models.Model):
    """
    Model for tracking user activities for audit purposes.
    """
    
    ACTIVITY_TYPES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('submission', 'Submission'),
        ('profile_update', 'Profile Update'),
        ('role_change', 'Role Change'),
        ('admin_action', 'Admin Action'),
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='activities',
        help_text='User who performed activity'
    )
    activity_type = models.CharField(
        max_length=50,
        choices=ACTIVITY_TYPES,
        help_text='Type of activity'
    )
    description = models.TextField(help_text='Activity description')
    ip_address = models.GenericIPAddressField(help_text='IP address from which activity was performed')
    user_agent = models.TextField(blank=True, null=True, help_text='User agent of request')
    
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text='Additional metadata about activity'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activity'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['activity_type']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.activity_type} - {self.created_at}"
