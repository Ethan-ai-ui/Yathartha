"""
Custom middleware for SatyaCheck backend.
Handles request logging, audit trails, and security checks.
"""

import logging
import json
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger('satyacheck')
audit_logger = logging.getLogger('satyacheck.audit')


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log all incoming HTTP requests.
    Captures method, path, user, and response status.
    """

    def process_request(self, request):
        """Log incoming request details."""
        request._start_time = __import__('time').time()
        
        # Capture request details
        user = request.user.username if request.user.is_authenticated else 'AnonymousUser'
        method = request.method
        path = request.path
        
        logger.debug(f"Request: {method} {path} - User: {user}")
        
        return None

    def process_response(self, request, response):
        """Log response details."""
        if hasattr(request, '_start_time'):
            duration = __import__('time').time() - request._start_time
            user = request.user.username if request.user.is_authenticated else 'AnonymousUser'
            method = request.method
            path = request.path
            status = response.status_code
            
            # Log only important endpoints
            if '/api/' in path:
                logger.info(
                    f"{method} {path} - Status: {status} - User: {user} - Duration: {duration:.2f}s"
                )
            
            # Audit log for sensitive operations
            if method in ['POST', 'PATCH', 'PUT', 'DELETE'] and '/api/v1/submissions/' in path:
                audit_logger.info(
                    f"Submission Action: {method} {path} - Status: {status} - User: {user}"
                )
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Adds security headers to all responses.
    """

    def process_response(self, request, response):
        """Add security headers."""
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response['Content-Security-Policy'] = "default-src 'self'"
        
        return response
