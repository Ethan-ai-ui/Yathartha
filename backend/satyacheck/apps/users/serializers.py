"""
Serializers for user authentication and profile management.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, OTPVerification, UserActivity
import random
import string
from django.utils import timezone
from datetime import timedelta


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Used for profile display and updates.
    """
    
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    is_moderator = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone', 'role', 'role_display', 'is_moderator',
            'bio', 'location', 'organization', 'profile_picture',
            'is_verified', 'is_phone_verified', 'is_identity_verified',
            'two_factor_enabled', 'submission_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'submission_count', 'role']
    
    def get_is_moderator(self, obj):
        """Check if user is a moderator."""
        return obj.is_moderator()


class SignupSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Validates password strength and creates new user.
    """
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'organization'
        ]
    
    def validate(self, data):
        """Validate passwords match."""
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password': 'Passwords do not match.'}
            )
        return data
    
    def validate_email(self, value):
        """Validate email is unique."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'Email already registered.'
            )
        return value
    
    def validate_username(self, value):
        """Validate username is unique."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                'Username already taken.'
            )
        return value
    
    def create(self, validated_data):
        """Create new user with hashed password."""
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Authenticates user and returns JWT tokens.
    """
    
    email = serializers.EmailField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(style={'input_type': 'password'})
    
    def validate(self, data):
        """Authenticate user with email or username."""
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        
        # Require at least one identifier
        if not (email or username):
            raise serializers.ValidationError(
                'Email or username is required.'
            )
        
        # Try to authenticate
        user = None
        if email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user and username:
            user = authenticate(username=username, password=password)
        
        if not user:
            raise serializers.ValidationError(
                'Invalid email/username or password.'
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                'User account is inactive.'
            )
        
        data['user'] = user
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password.
    """
    
    old_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        required=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(
        style={'input_type': 'password'},
        required=True
    )
    
    def validate(self, data):
        """Validate old password and new passwords match."""
        user = self.context['request'].user
        
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError(
                {'old_password': 'Incorrect password.'}
            )
        
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError(
                {'new_password': 'Passwords do not match.'}
            )
        
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError(
                {'new_password': 'New password must be different from old password.'}
            )
        
        return data


class OTPSerializer(serializers.Serializer):
    """
    Serializer for requesting and verifying OTP codes.
    """
    
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False, max_length=20)
    verification_type = serializers.ChoiceField(
        choices=['email', 'phone', '2fa', 'password_reset']
    )
    code = serializers.CharField(required=False, max_length=6)
    
    def validate(self, data):
        """Validate OTP data."""
        verification_type = data.get('verification_type')
        email = data.get('email')
        phone = data.get('phone')
        code = data.get('code')
        
        # For request: need email or phone
        if not code:
            if not (email or phone):
                raise serializers.ValidationError(
                    'Email or phone is required.'
                )
            if verification_type in ['email', 'password_reset'] and not email:
                raise serializers.ValidationError(
                    'Email is required for this verification type.'
                )
            if verification_type in ['sms', 'phone'] and not phone:
                raise serializers.ValidationError(
                    'Phone is required for this verification type.'
                )
        else:
            # For verification: need code
            if not code:
                raise serializers.ValidationError(
                    'OTP code is required.'
                )
        
        return data


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile information.
    """
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'bio', 'location',
            'organization', 'profile_picture', 'two_factor_enabled',
            'two_factor_method'
        ]
    
    def validate_phone(self, value):
        """Validate phone number format."""
        if value and not value.replace('+', '').replace('-', '').isdigit():
            raise serializers.ValidationError(
                'Invalid phone number format.'
            )
        return value


class UserActivitySerializer(serializers.ModelSerializer):
    """
    Serializer for user activity logs.
    """
    
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = [
            'id', 'activity_type', 'activity_type_display', 'description',
            'ip_address', 'metadata', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Extended JWT token serializer that includes user data.
    """
    
    @classmethod
    def get_token(cls, user):
        """Add custom claims to token."""
        token = super().get_token(user)
        
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['is_moderator'] = user.is_moderator()
        
        return token
    
    def validate(self, attrs):
        """Override to accept email or username."""
        username = attrs.get('username')
        password = attrs.get('password')
        
        # Try to get user by username first
        user = None
        try:
            user_obj = User.objects.get(username=username)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            # Try email if username not found
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if not user:
            raise serializers.ValidationError(
                'Invalid credentials.'
            )
        
        attrs['user'] = user
        return super().validate(attrs)
