"""
Serializers for AI models.
"""

from rest_framework import serializers
from .models import AIModel, ModelConfiguration


class AIModelSerializer(serializers.ModelSerializer):
    """Serializer for AI models."""
    
    model_type_display = serializers.CharField(source='get_model_type_display', read_only=True)
    
    class Meta:
        model = AIModel
        fields = [
            'id', 'name', 'version', 'model_type', 'model_type_display',
            'description', 'accuracy', 'is_active', 'is_production',
            'created_at', 'updated_at'
        ]


class ModelConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for model configuration."""
    
    class Meta:
        model = ModelConfiguration
        fields = [
            'id', 'model', 'confidence_threshold', 'misinformation_threshold',
            'max_text_length', 'timeout_seconds', 'text_weight', 'image_weight',
            'video_weight', 'audio_weight', 'enable_caching', 'cache_ttl_seconds'
        ]
