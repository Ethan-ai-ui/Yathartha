"""
ASGI config for SatyaCheck project.
For WebSocket support and async tasks.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'satyacheck.core.settings')

application = get_asgi_application()
