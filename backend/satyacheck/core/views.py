"""
Custom error views for SatyaCheck backend.
"""

from rest_framework.response import Response
from rest_framework import status


def custom_404(request, exception=None):
    """Handle 404 errors with JSON response."""
    return Response(
        {
            'error': 'Not Found',
            'message': 'The requested resource was not found.',
        },
        status=status.HTTP_404_NOT_FOUND
    )


def custom_500(request):
    """Handle 500 errors with JSON response."""
    return Response(
        {
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.',
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
