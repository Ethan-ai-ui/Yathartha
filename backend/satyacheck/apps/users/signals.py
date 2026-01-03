"""
User model signals.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User


@receiver(post_save, sender=User)
def update_user_metadata(sender, instance, created, **kwargs):
    """Update user metadata on save."""
    pass
