"""
Admin configuration for submissions.
"""

from django.contrib import admin
from .models import Submission, VerificationResult, SourceDatabase, ScrapedContent


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    """Admin interface for submissions."""
    
    list_display = ('title', 'submission_type', 'user', 'status', 'is_flagged', 'created_at')
    list_filter = ('submission_type', 'status', 'language', 'is_flagged', 'created_at')
    search_fields = ('title', 'description', 'user__username')
    readonly_fields = ('id', 'created_at', 'updated_at', 'analyzed_at', 'verified_at')
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('id', 'user', 'title', 'description', 'submission_type', 'language')
        }),
        ('Content', {
            'fields': ('text_content', 'file', 'source_url')
        }),
        ('Metadata', {
            'fields': ('location', 'tags', 'is_anonymous')
        }),
        ('Verification', {
            'fields': ('status', 'is_flagged', 'flag_reason', 'verified_by', 'verification_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'analyzed_at', 'verified_at')
        }),
    )


@admin.register(VerificationResult)
class VerificationResultAdmin(admin.ModelAdmin):
    """Admin interface for verification results."""
    
    list_display = ('submission', 'misinformation_score', 'primary_category', 'confidence_level')
    list_filter = ('primary_category', 'confidence_level', 'created_at')
    search_fields = ('submission__title', 'explanation')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(SourceDatabase)
class SourceDatabaseAdmin(admin.ModelAdmin):
    """Admin interface for source database."""
    
    list_display = ('name', 'source_type', 'country', 'credibility_score', 'is_verified')
    list_filter = ('source_type', 'country', 'is_verified')
    search_fields = ('name', 'url')
    readonly_fields = ('id', 'created_at', 'updated_at')


@admin.register(ScrapedContent)
class ScrapedContentAdmin(admin.ModelAdmin):
    """Admin interface for scraped content."""
    
    list_display = ('title', 'domain', 'scrape_success', 'scraped_at')
    list_filter = ('scrape_success', 'language', 'scraped_at')
    search_fields = ('title', 'source_url', 'domain')
    readonly_fields = ('id', 'scraped_at')
