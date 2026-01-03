"""
Utility functions for common operations.
"""

import os
import hashlib
from django.conf import settings


def get_file_hash(file_path):
    """Calculate SHA256 hash of a file."""
    sha256_hash = hashlib.sha256()
    
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    
    return sha256_hash.hexdigest()


def validate_file_type(filename, submission_type):
    """Validate if file type is allowed for submission type."""
    allowed_types = {
        'image': ['jpg', 'jpeg', 'png', 'gif'],
        'video': ['mp4', 'avi', 'mov', 'mkv'],
        'audio': ['mp3', 'wav', 'ogg', 'm4a'],
        'link': [],
        'text': ['txt', 'pdf'],
    }
    
    ext = filename.split('.')[-1].lower()
    return ext in allowed_types.get(submission_type, [])


def get_file_size(file_obj):
    """Get size of uploaded file in MB."""
    if hasattr(file_obj, 'size'):
        return file_obj.size / (1024 * 1024)
    
    return 0


def sanitize_text(text):
    """Sanitize text input (remove HTML, trim whitespace)."""
    import re
    
    # Remove HTML tags
    text = re.sub('<[^<]+?>', '', text)
    
    # Trim whitespace
    text = text.strip()
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text


def paginate_queryset(queryset, page, page_size=20):
    """Paginate a queryset."""
    start = (page - 1) * page_size
    end = start + page_size
    
    return queryset[start:end]


def get_client_ip(request):
    """Extract client IP from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
