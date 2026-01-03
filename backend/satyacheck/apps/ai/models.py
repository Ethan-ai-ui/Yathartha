"""
Models for AI verification service.
"""

from django.db import models
import uuid


class AIModel(models.Model):
    """
    Registry of AI models used for analysis.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    version = models.CharField(max_length=50)
    model_type = models.CharField(
        max_length=50,
        choices=[
            ('text_classification', 'Text Classification'),
            ('image_analysis', 'Image Analysis'),
            ('video_analysis', 'Video Analysis'),
            ('audio_analysis', 'Audio Analysis'),
        ]
    )
    
    description = models.TextField(blank=True, null=True)
    accuracy = models.FloatField(null=True, blank=True, help_text='Model accuracy percentage')
    
    is_active = models.BooleanField(default=True)
    is_production = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ai_model'
        ordering = ['-is_active', '-updated_at']
    
    def __str__(self):
        return f"{self.name} v{self.version}"


class ModelConfiguration(models.Model):
    """
    Configuration settings for AI models.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model = models.OneToOneField(AIModel, on_delete=models.CASCADE)
    
    # Thresholds
    confidence_threshold = models.FloatField(default=0.5, help_text='Minimum confidence threshold')
    misinformation_threshold = models.FloatField(default=0.5, help_text='Misinformation probability threshold')
    
    # Parameters
    max_text_length = models.IntegerField(default=1000, help_text='Maximum text length to analyze')
    timeout_seconds = models.IntegerField(default=30, help_text='Analysis timeout')
    
    # Weights
    text_weight = models.FloatField(default=0.4)
    image_weight = models.FloatField(default=0.3)
    video_weight = models.FloatField(default=0.2)
    audio_weight = models.FloatField(default=0.1)
    
    # Flags
    enable_caching = models.BooleanField(default=True)
    cache_ttl_seconds = models.IntegerField(default=86400, help_text='Cache time-to-live')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'model_configuration'
    
    def __str__(self):
        return f"Config for {self.model.name}"
