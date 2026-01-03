"""
Django admin configuration for AI models.
"""

from django.contrib import admin
from .models import AIModel, ModelConfiguration


@admin.register(AIModel)
class AIModelAdmin(admin.ModelAdmin):
    """Admin interface for AI models."""
    
    list_display = ('name', 'version', 'model_type', 'is_active', 'is_production', 'accuracy')
    list_filter = ('model_type', 'is_active', 'is_production')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ModelConfiguration)
class ModelConfigurationAdmin(admin.ModelAdmin):
    """Admin interface for model configuration."""
    
    list_display = ('model', 'confidence_threshold', 'misinformation_threshold', 'enable_caching')
    readonly_fields = ('created_at', 'updated_at')
