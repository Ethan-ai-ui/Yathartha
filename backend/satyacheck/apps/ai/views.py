"""
Views for AI verification endpoints.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import AIModel, ModelConfiguration
from satyacheck.services.ai_service import get_model
import logging

logger = logging.getLogger('satyacheck.ai')


class AIModelViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AI models.
    Admin only access.
    """
    
    queryset = AIModel.objects.all()
    permission_classes = [IsAdminUser]
    
    @action(detail=False, methods=['get'])
    def list_active(self, request):
        """Get list of active models."""
        models = AIModel.objects.filter(is_active=True)
        data = [
            {
                'id': str(m.id),
                'name': m.name,
                'version': m.version,
                'type': m.model_type,
                'accuracy': m.accuracy,
            }
            for m in models
        ]
        return Response(data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a model."""
        model = self.get_object()
        model.is_active = True
        model.save()
        return Response({'success': True, 'message': 'Model activated.'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a model."""
        model = self.get_object()
        model.is_active = False
        model.save()
        return Response({'success': True, 'message': 'Model deactivated.'})


class AnalysisTestViewSet(viewsets.ViewSet):
    """
    ViewSet for testing AI analysis.
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def test_text_analysis(self, request):
        """
        Test text analysis.
        POST: /api/v1/ai/test-text-analysis/
        """
        text = request.data.get('text', '')
        language = request.data.get('language', 'en')
        
        if not text:
            return Response(
                {'error': 'Text is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Run analysis
        model = get_model()
        result = model.analyze_text(text, language)
        
        return Response(result, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def test_image_analysis(self, request):
        """
        Test image analysis.
        POST: /api/v1/ai/test-image-analysis/
        """
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Image file is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        image_file = request.FILES['image']
        
        # Run analysis
        model = get_model()
        result = model.analyze_image(image_file.temporary_file_path())
        
        return Response(result, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def test_url_analysis(self, request):
        """
        Test URL content analysis.
        POST: /api/v1/ai/test-url-analysis/
        """
        url = request.data.get('url', '')
        
        if not url:
            return Response(
                {'error': 'URL is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Scrape and analyze
        from satyacheck.services.web_scraper import WebScraper
        
        scraper = WebScraper()
        scraped = scraper.scrape_url(url)
        
        if not scraped['success']:
            return Response(
                {'error': scraped.get('error', 'Failed to scrape URL.')},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Analyze scraped content
        model = get_model()
        text_result = model.analyze_text(scraped['main_text'], scraped['language'])
        
        return Response(
            {
                'scraped_content': {
                    'title': scraped['title'],
                    'description': scraped['description'],
                    'authors': scraped['authors'],
                    'language': scraped['language'],
                    'links_count': len(scraped.get('links', [])),
                },
                'analysis': text_result,
            },
            status=status.HTTP_200_OK
        )
