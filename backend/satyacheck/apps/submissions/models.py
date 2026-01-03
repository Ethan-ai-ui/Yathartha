"""
Models for content submissions and verification results.
Handles all types of submissions: text, images, videos, audio, links.
"""

from django.db import models
from django.contrib.postgres.fields import ArrayField
from satyacheck.apps.users.models import User
import uuid
import os


def get_submission_upload_path(instance, filename):
    """
    Generate upload path for submission files.
    Organizes by submission type and date.
    """
    ext = os.path.splitext(filename)[1]
    filename = f"{instance.id}{ext}"
    return f'submissions/{instance.submission_type}/{instance.user.id}/{filename}'


class Submission(models.Model):
    """
    Model for user-submitted content.
    Supports text, images, videos, audio, and links.
    """
    
    SUBMISSION_TYPE_CHOICES = (
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('link', 'Link'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('completed', 'Completed'),
        ('flagged', 'Flagged'),
        ('rejected', 'Rejected'),
    )
    
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('ne', 'Nepali'),
        ('hi', 'Hindi'),
        ('other', 'Other'),
    )
    
    # Primary Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='submissions',
        help_text='User who submitted'
    )
    
    # Submission Details
    submission_type = models.CharField(
        max_length=20,
        choices=SUBMISSION_TYPE_CHOICES,
        help_text='Type of submission'
    )
    title = models.CharField(
        max_length=500,
        help_text='Submission title/headline'
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text='Submission description'
    )
    
    # Content
    text_content = models.TextField(
        blank=True,
        null=True,
        help_text='Text content (for text submissions)'
    )
    file = models.FileField(
        upload_to=get_submission_upload_path,
        blank=True,
        null=True,
        help_text='Uploaded file (image, video, audio)'
    )
    source_url = models.URLField(
        blank=True,
        null=True,
        help_text='Source URL (for link submissions)'
    )
    
    # Metadata
    language = models.CharField(
        max_length=20,
        choices=LANGUAGE_CHOICES,
        default='en',
        help_text='Content language'
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text='Geographic location mentioned'
    )
    tags = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        help_text='Tags for categorization'
    )
    
    # Verification Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text='Submission verification status'
    )
    is_flagged = models.BooleanField(
        default=False,
        help_text='Whether submission is flagged'
    )
    flag_reason = models.TextField(
        blank=True,
        null=True,
        help_text='Reason for flag'
    )
    
    # Anonymous Submission
    is_anonymous = models.BooleanField(
        default=False,
        help_text='Whether submission is anonymous'
    )
    
    # Verification Details
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_submissions',
        help_text='User who verified submission'
    )
    verification_notes = models.TextField(
        blank=True,
        null=True,
        help_text='Notes from verifier'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    analyzed_at = models.DateTimeField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'submission'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['submission_type']),
            models.Index(fields=['language']),
            models.Index(fields=['is_flagged']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.submission_type})"
    
    def get_display_name(self):
        """Get display name (user or anonymous)."""
        if self.is_anonymous:
            return "Anonymous"
        return self.user.get_display_name() if self.user else "Unknown"
    
    def mark_analyzing(self):
        """Mark submission as being analyzed."""
        self.status = 'analyzing'
        self.save(update_fields=['status'])
    
    def mark_completed(self):
        """Mark submission as completed."""
        from django.utils import timezone
        self.status = 'completed'
        self.analyzed_at = timezone.now()
        self.save(update_fields=['status', 'analyzed_at'])


class VerificationResult(models.Model):
    """
    Model for storing AI verification results.
    Contains misinformation scores and explanations.
    """
    
    CATEGORY_CHOICES = (
        ('fake_news', 'Fake News'),
        ('propaganda', 'Propaganda'),
        ('spam', 'Spam'),
        ('satire', 'Satire'),
        ('misleading', 'Misleading'),
        ('deepfake', 'Deepfake'),
        ('manipulated_image', 'Manipulated Image'),
        ('manipulated_video', 'Manipulated Video'),
        ('accurate', 'Accurate'),
        ('unverifiable', 'Unverifiable'),
        ('other', 'Other'),
    )
    
    CONFIDENCE_LEVEL_CHOICES = (
        ('high', 'High Confidence'),
        ('medium', 'Medium Confidence'),
        ('low', 'Low Confidence'),
    )
    
    # Primary Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(
        Submission,
        on_delete=models.CASCADE,
        related_name='verification_result',
        help_text='Submission being verified'
    )
    
    # Verification Scores
    misinformation_score = models.FloatField(
        help_text='Score from 0-100 (higher = more likely to be misinformation)'
    )
    confidence_level = models.CharField(
        max_length=20,
        choices=CONFIDENCE_LEVEL_CHOICES,
        help_text='Confidence level of analysis'
    )
    
    # Category
    primary_category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        help_text='Primary misinformation category'
    )
    secondary_categories = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True,
        help_text='Secondary categories'
    )
    
    # Analysis
    explanation = models.TextField(
        help_text='Human-readable explanation of result'
    )
    explanation_nepali = models.TextField(
        blank=True,
        null=True,
        help_text='Explanation in Nepali'
    )
    explanation_hindi = models.TextField(
        blank=True,
        null=True,
        help_text='Explanation in Hindi'
    )
    
    # Evidence
    key_findings = ArrayField(
        models.TextField(),
        default=list,
        blank=True,
        help_text='Key findings from analysis'
    )
    supporting_evidence = ArrayField(
        models.URLField(),
        default=list,
        blank=True,
        help_text='Links to supporting evidence'
    )
    
    # Fact Checks
    fact_check_sources = ArrayField(
        models.CharField(max_length=255),
        default=list,
        blank=True,
        help_text='Fact-checking sources referenced'
    )
    
    # Detailed Scores (for different aspects)
    text_analysis_score = models.FloatField(
        null=True,
        blank=True,
        help_text='Text analysis score (0-100)'
    )
    image_analysis_score = models.FloatField(
        null=True,
        blank=True,
        help_text='Image analysis score (0-100)'
    )
    video_analysis_score = models.FloatField(
        null=True,
        blank=True,
        help_text='Video analysis score (0-100)'
    )
    
    # Source Analysis
    source_credibility_score = models.FloatField(
        null=True,
        blank=True,
        help_text='Source credibility score (0-100)'
    )
    source_url = models.URLField(
        blank=True,
        null=True,
        help_text='URL of verified/checked source'
    )
    
    # Related News
    similar_articles = ArrayField(
        models.URLField(),
        default=list,
        blank=True,
        help_text='Similar/related articles found'
    )
    
    # Model Information
    model_used = models.CharField(
        max_length=255,
        help_text='AI model used for analysis'
    )
    model_version = models.CharField(
        max_length=50,
        help_text='Version of AI model'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'verification_result'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['primary_category']),
            models.Index(fields=['misinformation_score']),
        ]
    
    def __str__(self):
        return f"Result for {self.submission.title}"
    
    def get_risk_level(self):
        """Get risk level based on score."""
        if self.misinformation_score >= 70:
            return 'high'
        elif self.misinformation_score >= 40:
            return 'medium'
        else:
            return 'low'
    
    def get_recommendation(self):
        """Get recommendation based on score and category."""
        score = self.misinformation_score
        
        if score >= 80 and self.primary_category in ['deepfake', 'manipulated_video', 'manipulated_image']:
            return 'Consider reporting to platform moderators'
        elif score >= 70:
            return 'High likelihood of misinformation - verify with trusted sources'
        elif score >= 50:
            return 'Verify with multiple trusted sources before sharing'
        else:
            return 'Appears to be accurate or unverifiable'


class VerificationHistory(models.Model):
    """
    Track history of verification results for submissions.
    Allows re-analysis and comparison over time.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        related_name='verification_history',
        help_text='Submission being re-verified'
    )
    previous_result = models.ForeignKey(
        VerificationResult,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='Previous verification result'
    )
    new_result = models.ForeignKey(
        VerificationResult,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+',
        help_text='New verification result'
    )
    
    reason_for_reanalysis = models.TextField(
        help_text='Reason for re-analysis'
    )
    requested_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='+',
        help_text='User who requested re-analysis'
    )
    
    score_change = models.FloatField(
        help_text='Change in misinformation score'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'verification_history'
        ordering = ['-created_at']


class SourceDatabase(models.Model):
    """
    Database of trusted news sources and government websites.
    Used to verify content from credible sources.
    """
    
    SOURCE_TYPE_CHOICES = (
        ('news', 'News Organization'),
        ('government', 'Government'),
        ('academic', 'Academic'),
        ('fact_check', 'Fact-Checking'),
        ('other', 'Other'),
    )
    
    COUNTRY_CHOICES = (
        ('np', 'Nepal'),
        ('in', 'India'),
        ('us', 'USA'),
        ('int', 'International'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Source Information
    name = models.CharField(max_length=255, help_text='Organization name')
    url = models.URLField(help_text='Primary URL')
    source_type = models.CharField(
        max_length=50,
        choices=SOURCE_TYPE_CHOICES,
        help_text='Type of source'
    )
    country = models.CharField(
        max_length=10,
        choices=COUNTRY_CHOICES,
        help_text='Primary country'
    )
    
    # Credibility
    credibility_score = models.IntegerField(
        default=50,
        help_text='Credibility score (0-100)'
    )
    is_verified = models.BooleanField(
        default=False,
        help_text='Verified by SatyaCheck team'
    )
    
    # Details
    description = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=50, help_text='Primary language')
    
    # Metadata
    added_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text='User who added source'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'source_database'
        ordering = ['-credibility_score']
        unique_together = ['name', 'url']
    
    def __str__(self):
        return f"{self.name} ({self.source_type})"


class ScrapedContent(models.Model):
    """
    Model for storing scraped web content from URL submissions.
    """
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(
        Submission,
        on_delete=models.CASCADE,
        related_name='scraped_content',
        blank=True,
        null=True,
        help_text='Associated submission'
    )
    
    # Source URL
    source_url = models.URLField(help_text='Source URL')
    domain = models.CharField(max_length=255, help_text='Domain of source')
    
    # Scraped Content
    title = models.CharField(max_length=500, help_text='Page title')
    description = models.TextField(help_text='Page description/meta')
    main_text = models.TextField(help_text='Main article text')
    
    # Metadata
    authors = ArrayField(
        models.CharField(max_length=255),
        default=list,
        blank=True,
        help_text='Article authors'
    )
    publish_date = models.DateTimeField(null=True, blank=True)
    language = models.CharField(max_length=50, help_text='Content language')
    
    # Links Found
    external_links = ArrayField(
        models.URLField(),
        default=list,
        blank=True,
        help_text='External links in article'
    )
    
    # Status
    scrape_success = models.BooleanField(default=True)
    scrape_error = models.TextField(blank=True, null=True)
    
    # Timestamps
    scraped_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'scraped_content'
        ordering = ['-scraped_at']
    
    def __str__(self):
        return f"{self.title} ({self.domain})"
