"""
Model for logging and persisting all AI interactions (requests and responses).
"""

from django.db import models
from django.conf import settings
import uuid

class AIInteractionLog(models.Model):
    """
    Stores every AI request and response for audit, debugging, and analytics.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="User who initiated the AI request (nullable for anonymous)"
    )
    model = models.ForeignKey(
        'ai.AIModel',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="AI model used for this interaction"
    )
    input_type = models.CharField(max_length=32, help_text="Type of input: text, image, etc.")
    input_data = models.TextField(help_text="Raw input data (text or reference)")
    output_data = models.TextField(blank=True, null=True, help_text="AI output/result")
    success = models.BooleanField(default=True, help_text="Did the AI return a valid result?")
    error_message = models.TextField(blank=True, null=True, help_text="Error or fallback message, if any")
    fallback_used = models.BooleanField(default=False, help_text="Was a fallback mechanism triggered?")
    request_metadata = models.JSONField(blank=True, null=True, help_text="Additional request context (language, params, etc.)")
    response_metadata = models.JSONField(blank=True, null=True, help_text="Additional response context (timing, confidence, etc.)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_interaction_log'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['model']),
            models.Index(fields=['input_type']),
            models.Index(fields=['success']),
        ]

    def __str__(self):
        return f"AIInteractionLog({self.input_type}, user={self.user_id}, model={self.model_id}, success={self.success})"