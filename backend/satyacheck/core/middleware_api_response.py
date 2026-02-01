"""
Django middleware to standardize all API responses.
Wraps all JSON API responses in a consistent structure:
    {"success": true/false, "data": ..., "error": ...}
Handles exceptions and validation errors gracefully.
"""
import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework.views import exception_handler
from rest_framework.response import Response as DRFResponse
from rest_framework import status

class StandardizeAPIResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Only wrap DRF or Django JsonResponse
        if isinstance(response, DRFResponse):
            data = response.data
            code = response.status_code
        elif isinstance(response, JsonResponse):
            data = response.json() if hasattr(response, 'json') else response.content
            code = response.status_code
        else:
            return response

        # Determine success
        success = 200 <= code < 300
        # If already wrapped, do not double-wrap
        if isinstance(data, dict) and set(data.keys()) >= {"success", "data", "error"}:
            return response

        # Standardize
        wrapped = {
            "success": success,
            "data": data if success else None,
            "error": None if success else data,
        }
        return JsonResponse(wrapped, status=code, safe=False)

    def process_exception(self, request, exception):
        # Use DRF's exception handler for consistency
        drf_response = exception_handler(exception, context=None)
        if drf_response is not None:
            return self.process_response(request, drf_response)
        # Fallback for non-DRF exceptions
        return JsonResponse({
            "success": False,
            "data": None,
            "error": str(exception)
        }, status=500)