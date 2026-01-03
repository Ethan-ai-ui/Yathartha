"""
Views for user authentication and profile management.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
import random
import string
import logging

from .models import User, OTPVerification, UserActivity
from .serializers import (
    UserSerializer, SignupSerializer, LoginSerializer,
    ChangePasswordSerializer, OTPSerializer, UserProfileUpdateSerializer,
    UserActivitySerializer
)

logger = logging.getLogger('satyacheck')
audit_logger = logging.getLogger('satyacheck.audit')


class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for authentication endpoints.
    Handles signup, login, logout, and password management.
    """
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['signup', 'login', 'request_otp', 'verify_otp', 'forgot_password']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def signup(self, request):
        """
        Register a new user.
        POST: /api/v1/auth/signup/
        """
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Log signup activity
            audit_logger.info(f"New user signup: {user.username} ({user.email})")
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='signup',
                description='User registered',
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'success': True,
                    'message': 'User registered successfully.',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'success': False,
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def login(self, request):
        """
        Login user and return JWT tokens.
        POST: /api/v1/auth/login/
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Update last login info
            user.last_login = timezone.now()
            user.last_login_ip = self._get_client_ip(request)
            user.save(update_fields=['last_login', 'last_login_ip'])
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='login',
                description='User login',
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            audit_logger.info(f"User login: {user.username}")
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response(
                {
                    'success': True,
                    'message': 'Login successful.',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    }
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'success': False,
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Logout user.
        POST: /api/v1/auth/logout/
        """
        user = request.user
        
        # Log activity
        UserActivity.objects.create(
            user=user,
            activity_type='logout',
            description='User logout',
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        audit_logger.info(f"User logout: {user.username}")
        
        return Response(
            {
                'success': True,
                'message': 'Logout successful.'
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def profile(self, request):
        """
        Get current user's profile.
        GET: /api/v1/auth/profile/
        """
        user = request.user
        serializer = UserSerializer(user)
        
        return Response(
            {
                'success': True,
                'user': serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        """
        Update current user's profile.
        PATCH: /api/v1/auth/update-profile/
        """
        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='profile_update',
                description='User profile updated',
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            return Response(
                {
                    'success': True,
                    'message': 'Profile updated successfully.',
                    'user': UserSerializer(user).data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'success': False,
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """
        Change user password.
        POST: /api/v1/auth/change-password/
        """
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Log activity
            UserActivity.objects.create(
                user=user,
                activity_type='profile_update',
                description='User changed password',
                ip_address=self._get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            audit_logger.info(f"User password changed: {user.username}")
            
            return Response(
                {
                    'success': True,
                    'message': 'Password changed successfully.'
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'success': False,
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def request_otp(self, request):
        """
        Request OTP for verification.
        POST: /api/v1/auth/request-otp/
        """
        serializer = OTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            phone = serializer.validated_data.get('phone')
            verification_type = serializer.validated_data['verification_type']
            
            # Get or create user
            user = None
            if email:
                user, _ = User.objects.get_or_create(email=email, defaults={'username': email})
            elif phone:
                try:
                    user = User.objects.get(phone=phone)
                except User.DoesNotExist:
                    return Response(
                        {
                            'success': False,
                            'message': 'Phone number not found.'
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            # Generate OTP
            otp_code = ''.join(random.choices(string.digits, k=6))
            
            # Set expiration to 10 minutes
            from datetime import timedelta
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Save OTP
            otp = OTPVerification.objects.create(
                user=user,
                code=otp_code,
                verification_type=verification_type,
                email_or_phone=email or phone,
                expires_at=expires_at
            )
            
            # Send OTP (in development, log it; in production, use email/SMS service)
            if email:
                self._send_otp_email(user, email, otp_code, verification_type)
            elif phone:
                self._send_otp_sms(user, phone, otp_code)
            
            logger.info(f"OTP requested for {email or phone} (type: {verification_type})")
            
            return Response(
                {
                    'success': True,
                    'message': f'OTP sent to {email or phone}. Valid for 10 minutes.',
                    'otp_id': str(otp.id),  # For development/testing
                    'otp_code': otp_code if settings.DEBUG else None  # Only in DEBUG mode
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'success': False,
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def verify_otp(self, request):
        """
        Verify OTP code.
        POST: /api/v1/auth/verify-otp/
        """
        code = request.data.get('code')
        email_or_phone = request.data.get('email_or_phone')
        verification_type = request.data.get('verification_type')
        
        if not all([code, email_or_phone, verification_type]):
            return Response(
                {
                    'success': False,
                    'message': 'Code, email/phone, and verification type are required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            otp = OTPVerification.objects.get(
                code=code,
                email_or_phone=email_or_phone,
                verification_type=verification_type
            )
        except OTPVerification.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'message': 'Invalid OTP code.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not otp.is_valid():
            return Response(
                {
                    'success': False,
                    'message': 'OTP expired or too many failed attempts.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark as verified
        otp.is_verified = True
        otp.verified_at = timezone.now()
        otp.save()
        
        # Update user verification status
        user = otp.user
        if verification_type == 'email':
            user.is_verified = True
            user.email = email_or_phone
        elif verification_type == 'phone':
            user.is_phone_verified = True
            user.phone = email_or_phone
        elif verification_type == '2fa':
            user.two_factor_enabled = True
        
        user.save()
        
        # Generate tokens if needed
        refresh = RefreshToken.for_user(user)
        
        return Response(
            {
                'success': True,
                'message': 'OTP verified successfully.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            },
            status=status.HTTP_200_OK
        )
    
    @staticmethod
    def _get_client_ip(request):
        """Extract client IP from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @staticmethod
    def _send_otp_email(user, email, code, verification_type):
        """Send OTP via email."""
        context = {
            'user': user,
            'code': code,
            'verification_type': verification_type,
        }
        
        subject = f'Your SatyaCheck OTP Code: {code}'
        
        if settings.DEBUG:
            logger.info(f"[DEBUG] OTP Email to {email}: {code}")
        else:
            try:
                send_mail(
                    subject=subject,
                    message=f'Your OTP code is: {code}. Valid for 10 minutes.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                logger.error(f"Failed to send OTP email to {email}: {str(e)}")
    
    @staticmethod
    def _send_otp_sms(user, phone, code):
        """Send OTP via SMS."""
        if settings.DEBUG:
            logger.info(f"[DEBUG] OTP SMS to {phone}: {code}")
        else:
            # Integrate with SMS provider (Twilio, etc.)
            pass


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing user activity logs.
    """
    
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return activity logs for current user."""
        user = self.request.user
        if user.is_admin_user():
            return UserActivity.objects.all()
        return UserActivity.objects.filter(user=user)
