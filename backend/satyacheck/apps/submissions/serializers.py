"""
Serializers for submission and verification models.
"""

from rest_framework import serializers
from .models import Submission, VerificationResult, ScrapedContent, SourceDatabase
from satyacheck.apps.users.serializers import UserSerializer


class SourceDatabaseSerializer(serializers.ModelSerializer):
    """Serializer for source database entries."""
    
    source_type_display = serializers.CharField(source='get_source_type_display', read_only=True)
    
    class Meta:
        model = SourceDatabase
        fields = [
            'id', 'name', 'url', 'source_type', 'source_type_display',
            'country', 'credibility_score', 'is_verified', 'description',
            'language', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class ScrapedContentSerializer(serializers.ModelSerializer):
    """Serializer for scraped web content."""
    
    class Meta:
        model = ScrapedContent
        fields = [
            'id', 'source_url', 'domain', 'title', 'description',
            'authors', 'publish_date', 'language', 'external_links',
            'scraped_at'
        ]
        read_only_fields = ['id', 'scraped_at']


class VerificationResultSerializer(serializers.ModelSerializer):
    """Serializer for verification results."""
    
    primary_category_display = serializers.CharField(source='get_primary_category_display', read_only=True)
    confidence_level_display = serializers.CharField(source='get_confidence_level_display', read_only=True)
    risk_level = serializers.SerializerMethodField()
    recommendation = serializers.SerializerMethodField()
    
    class Meta:
        model = VerificationResult
        fields = [
            'id', 'submission', 'misinformation_score', 'confidence_level',
            'confidence_level_display', 'primary_category', 'primary_category_display',
            'secondary_categories', 'explanation', 'explanation_nepali',
            'explanation_hindi', 'key_findings', 'supporting_evidence',
            'fact_check_sources', 'text_analysis_score', 'image_analysis_score',
            'video_analysis_score', 'source_credibility_score', 'source_url',
            'similar_articles', 'model_used', 'model_version',
            'risk_level', 'recommendation', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'risk_level', 'recommendation'
        ]
    
    def get_risk_level(self, obj):
        """Get risk level."""
        return obj.get_risk_level()
    
    def get_recommendation(self, obj):
        """Get recommendation."""
        return obj.get_recommendation()


class SubmissionListSerializer(serializers.ModelSerializer):
    """Serializer for submission lists (minimal data)."""
    
    user = UserSerializer(read_only=True)
    submission_type_display = serializers.CharField(source='get_submission_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = [
            'id', 'user', 'display_name', 'title', 'submission_type',
            'submission_type_display', 'description', 'status', 'status_display',
            'language', 'language_display', 'is_anonymous', 'is_flagged',
            'created_at', 'updated_at', 'analyzed_at'
        ]
        read_only_fields = [
            'id', 'user', 'created_at', 'updated_at', 'analyzed_at',
            'status', 'is_flagged'
        ]
    
    def get_display_name(self, obj):
        """Get display name."""
        return obj.get_display_name()


class SubmissionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed submission data."""
    
    user = UserSerializer(read_only=True)
    submission_type_display = serializers.CharField(source='get_submission_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    verification_result = VerificationResultSerializer(read_only=True)
    scraped_content = ScrapedContentSerializer(read_only=True)
    verified_by = UserSerializer(read_only=True)
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = [
            'id', 'user', 'display_name', 'title', 'description',
            'submission_type', 'submission_type_display', 'text_content',
            'file', 'source_url', 'language', 'language_display',
            'location', 'tags', 'status', 'status_display',
            'is_anonymous', 'is_flagged', 'flag_reason',
            'verified_by', 'verification_notes', 'verification_result',
            'scraped_content', 'created_at', 'updated_at', 'analyzed_at', 'verified_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'is_flagged', 'flag_reason',
            'verified_by', 'verification_notes', 'verification_result',
            'scraped_content', 'created_at', 'updated_at', 'analyzed_at', 'verified_at'
        ]
    
    def get_display_name(self, obj):
        """Get display name."""
        return obj.get_display_name()
    
    def validate_submission_type(self, value):
        """Validate submission type."""
        if value not in dict(Submission.SUBMISSION_TYPE_CHOICES):
            raise serializers.ValidationError('Invalid submission type.')
        return value
    
    def validate_language(self, value):
        """Validate language."""
        if value not in dict(Submission.LANGUAGE_CHOICES):
            raise serializers.ValidationError('Invalid language.')
        return value
    
    def validate(self, data):
        """Validate submission data based on type."""
        submission_type = data.get('submission_type')
        
        if submission_type == 'text' and not data.get('text_content'):
            raise serializers.ValidationError(
                {'text_content': 'Text content is required for text submissions.'}
            )
        elif submission_type in ['image', 'video', 'audio'] and not data.get('file'):
            raise serializers.ValidationError(
                {'file': f'File is required for {submission_type} submissions.'}
            )
        elif submission_type == 'link' and not data.get('source_url'):
            raise serializers.ValidationError(
                {'source_url': 'URL is required for link submissions.'}
            )
        
        return data


class SubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new submissions."""
    
    class Meta:
        model = Submission
        fields = [
            'title', 'description', 'submission_type', 'text_content',
            'file', 'source_url', 'language', 'location', 'tags',
            'is_anonymous'
        ]
    
    def create(self, validated_data):
        """Create submission with current user."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        submission = Submission.objects.create(**validated_data)
        return submission


class SubmissionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating submissions."""
    
    class Meta:
        model = Submission
        fields = [
            'title', 'description', 'text_content', 'location', 'tags'
        ]


class BulkSubmissionSerializer(serializers.Serializer):
    """Serializer for bulk submission operations."""
    
    submission_ids = serializers.ListField(
        child=serializers.UUIDField(),
        help_text='List of submission IDs'
    )
    action = serializers.ChoiceField(
        choices=['flag', 'unflag', 'delete', 'export'],
        help_text='Action to perform'
    )
    reason = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text='Reason for action'
    )
