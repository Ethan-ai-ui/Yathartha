"""
Celery tasks for background processing.
"""

from celery import shared_task
from django.core.cache import cache
from django.utils import timezone
import logging

from satyacheck.apps.submissions.models import Submission, VerificationResult, ScrapedContent
from satyacheck.services.ai_service import get_model
from satyacheck.services.web_scraper import WebScraper, find_similar_articles

logger = logging.getLogger('satyacheck.ai')


@shared_task
def analyze_submission(submission_id):
    """
    Analyze a submission for misinformation.
    This task runs asynchronously in Celery.
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        
        logger.info(f"Starting analysis for submission {submission_id}")
        
        # Mark as analyzing
        submission.status = 'analyzing'
        submission.save(update_fields=['status'])
        
        # Get AI model
        model = get_model()
        
        # Perform analysis based on type
        if submission.submission_type == 'text':
            result = model.analyze_text(submission.text_content, submission.language)
        elif submission.submission_type == 'image':
            result = model.analyze_image(submission.file.path)
        elif submission.submission_type == 'video':
            result = model.analyze_video(submission.file.path)
        elif submission.submission_type == 'audio':
            result = model.analyze_audio(submission.file.path)
        elif submission.submission_type == 'link':
            # Scrape and analyze
            result = analyze_link_submission.apply_async(args=[submission_id]).get()
        else:
            logger.error(f"Unknown submission type: {submission.submission_type}")
            return
        
        # Create verification result
        verification = VerificationResult.objects.create(
            submission=submission,
            misinformation_score=result['score'],
            confidence_level=result['confidence'],
            primary_category=result['category'],
            explanation=result['explanation'],
            explanation_nepali=result.get('explanation_nepali', ''),
            explanation_hindi=result.get('explanation_hindi', ''),
            model_used='distilbert-base-uncased',
            model_version='1.0',
            text_analysis_score=result.get('component_scores', {}).get('sentiment'),
        )
        
        # Mark submission as completed
        submission.status = 'completed'
        submission.analyzed_at = timezone.now()
        submission.save(update_fields=['status', 'analyzed_at'])
        
        logger.info(f"Analysis completed for submission {submission_id} - Score: {result['score']}")
        
        # Send notification (if needed)
        notify_user_analysis_complete.delay(submission_id)
        
        return {
            'success': True,
            'submission_id': submission_id,
            'score': result['score'],
        }
    
    except Submission.DoesNotExist:
        logger.error(f"Submission not found: {submission_id}")
        return {'success': False, 'error': 'Submission not found'}
    
    except Exception as e:
        logger.error(f"Error analyzing submission {submission_id}: {str(e)}")
        
        # Mark as completed with error
        try:
            submission = Submission.objects.get(id=submission_id)
            submission.status = 'completed'
            submission.save(update_fields=['status'])
        except:
            pass
        
        return {'success': False, 'error': str(e)}


@shared_task
def analyze_link_submission(submission_id):
    """
    Analyze a link submission.
    Scrapes the URL and analyzes the content.
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        
        logger.info(f"Scraping link for submission {submission_id}: {submission.source_url}")
        
        # Scrape content
        scraper = WebScraper()
        scraped = scraper.scrape_url(submission.source_url)
        
        if not scraped['success']:
            logger.error(f"Failed to scrape URL: {scraped.get('error')}")
            result = {
                'score': 50,
                'confidence': 'low',
                'category': 'unverifiable',
                'explanation': 'Unable to verify content from URL.'
            }
        else:
            # Save scraped content
            ScrapedContent.objects.create(
                submission=submission,
                source_url=submission.source_url,
                domain=scraped['domain'],
                title=scraped['title'],
                description=scraped['description'],
                main_text=scraped['main_text'],
                authors=scraped['authors'],
                language=scraped['language'],
                external_links=scraped.get('links', []),
            )
            
            # Analyze text content
            model = get_model()
            result = model.analyze_text(scraped['main_text'], scraped['language'])
            
            # Add source analysis
            from satyacheck.services.web_scraper import NewsAggregator
            if NewsAggregator.is_trusted_source(submission.source_url):
                credibility = NewsAggregator.get_source_credibility(submission.source_url)
                result['source_credibility_score'] = credibility
        
        return result
    
    except Exception as e:
        logger.error(f"Error analyzing link submission {submission_id}: {str(e)}")
        return {
            'score': 50,
            'confidence': 'low',
            'category': 'unverifiable',
            'explanation': 'Error analyzing URL content.'
        }


@shared_task
def find_similar_news(submission_id):
    """
    Find similar news articles for a submission.
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        
        if submission.submission_type not in ['text', 'link']:
            return
        
        # Get text to search for
        if submission.submission_type == 'text':
            text = submission.text_content
        else:
            text = submission.title + ' ' + submission.description
        
        # Find similar articles (limited implementation)
        similar = find_similar_articles(text, max_results=5)
        
        logger.info(f"Found {len(similar)} similar articles for submission {submission_id}")
        
        # Update verification result with similar articles
        try:
            verification = submission.verification_result
            verification.similar_articles = [article['url'] for article in similar]
            verification.save(update_fields=['similar_articles'])
        except:
            pass
    
    except Exception as e:
        logger.error(f"Error finding similar news for {submission_id}: {str(e)}")


@shared_task
def notify_user_analysis_complete(submission_id):
    """
    Send notification to user when analysis is complete.
    """
    try:
        submission = Submission.objects.get(id=submission_id)
        user = submission.user
        
        if not user:
            return
        
        # Send email notification (implement with email service)
        logger.info(f"Would send email notification to {user.email} for submission {submission_id}")
        
        # In production, integrate with email service:
        # send_mail(
        #     subject='Your submission analysis is complete',
        #     message='...',
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        # )
    
    except Exception as e:
        logger.error(f"Error notifying user: {str(e)}")


@shared_task
def generate_daily_report():
    """
    Generate daily report of submissions and statistics.
    Run once per day.
    """
    from django.utils import timezone
    from datetime import timedelta
    from django.db.models import Count, Avg
    from satyacheck.apps.reporting.models import Report, MisinformationTrend
    
    try:
        # Get submissions from last 24 hours
        start = timezone.now() - timedelta(days=1)
        submissions = Submission.objects.filter(created_at__gte=start)
        
        # Calculate statistics
        data = {
            'total_submissions': submissions.count(),
            'by_type': dict(
                submissions.values('submission_type').annotate(
                    count=Count('id')
                ).values_list('submission_type', 'count')
            ),
            'average_score': submissions.filter(
                verification_result__isnull=False
            ).aggregate(
                Avg('verification_result__misinformation_score')
            )['verification_result__misinformation_score__avg'] or 0,
        }
        
        # Create report
        Report.objects.create(
            title='Daily Report - ' + timezone.now().strftime('%Y-%m-%d'),
            report_type='daily',
            start_date=start,
            end_date=timezone.now(),
            data=data,
            is_public=True
        )
        
        # Update trends
        for category in ['fake_news', 'propaganda', 'spam', 'satire', 'misleading']:
            count = submissions.filter(
                verification_result__primary_category=category
            ).count()
            
            avg_score = submissions.filter(
                verification_result__primary_category=category
            ).aggregate(
                Avg('verification_result__misinformation_score')
            )['verification_result__misinformation_score__avg'] or 0
            
            if count > 0:
                MisinformationTrend.objects.update_or_create(
                    date=timezone.now().date(),
                    category=category,
                    language=None,
                    defaults={'count': count, 'average_score': avg_score}
                )
        
        logger.info("Daily report generated successfully")
    
    except Exception as e:
        logger.error(f"Error generating daily report: {str(e)}")


@shared_task
def cleanup_old_logs():
    """
    Clean up old logs and temporary files.
    Run once per week.
    """
    from datetime import timedelta
    from django.utils import timezone
    from satyacheck.apps.users.models import OTPVerification
    
    try:
        # Delete expired OTPs
        thirty_days_ago = timezone.now() - timedelta(days=30)
        OTPVerification.objects.filter(created_at__lt=thirty_days_ago).delete()
        
        logger.info("Cleanup task completed")
    
    except Exception as e:
        logger.error(f"Error in cleanup task: {str(e)}")
