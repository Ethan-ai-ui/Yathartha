"""
AI Service Module
Core misinformation detection engine.
Handles text, image, video, and audio analysis.
"""

import logging
import torch
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger('satyacheck.ai')


class MisinformationDetectionModel:

        def verify_claim(self, headline, article, claim, image_url=None, user=None, model_instance=None, request_metadata=None):
            """
            Strict fake news verification pipeline:
            Input → Claim extraction → Source retrieval → Cross-verification → Scoring → Verdict → Structured output
            Returns:
                {
                  "verdict": "REAL | FAKE | UNCERTAIN",
                  "confidence": 0-100,
                  "explanation": "Clear factual reasoning",
                  "sources": [ {"title": "", "publisher": "", "url": ""} ]
                }
            """
            from satyacheck.apps.ai.models_interaction import AIInteractionLog
            from .web_scraper import WebScraper
            import json
            import re
            reputable_domains = [
                'reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'theguardian.com',
                'npr.org', 'factcheck.org', 'snopes.com', 'politifact.com', 'gov', 'edu'
            ]
            try:
                # 1. Claim extraction (use provided claim or extract from headline/article)
                extracted_claim = claim or (headline if headline else article[:120])
                if not extracted_claim:
                    raise ValueError("No claim provided or extractable.")

                # 2. Source retrieval (search trusted sources)
                scraper = WebScraper()
                # For demo: search Google News or Bing API, here just use a static list for now
                # In production, integrate a real search API
                candidate_urls = self._search_candidate_urls(extracted_claim)
                sources = []
                for url in candidate_urls:
                    domain = re.sub(r'^www\.', '', url.split('/')[2]) if '://' in url else url
                    if not any(d in domain for d in reputable_domains):
                        continue  # Penalize/skip low-credibility domains
                    scraped = scraper.scrape_url(url)
                    if scraped.get('success'):
                        sources.append({
                            'title': scraped.get('title', ''),
                            'publisher': domain,
                            'url': url
                        })
                if not sources:
                    raise ValueError("No reputable sources found.")

                # 3. Cross-verification (simple keyword/claim match for demo)
                agreement = 0
                for s in sources:
                    if extracted_claim.lower() in (s['title'] + ' ' + s.get('publisher', '')).lower():
                        agreement += 1
                # 4. Scoring (deterministic)
                credibility_score = min(100, 60 + 10 * agreement)
                linguistic_score = 100 - self._check_misinformation_keywords(extracted_claim)
                cross_source_score = 80 if agreement else 40
                final_score = int((credibility_score * 0.4 + linguistic_score * 0.3 + cross_source_score * 0.3))
                # 5. Verdict
                if final_score > 75 and agreement:
                    verdict = "REAL"
                elif final_score < 50:
                    verdict = "FAKE"
                else:
                    verdict = "UNCERTAIN"
                # 6. Explanation
                explanation = (
                    f"Claim cross-checked against {len(sources)} reputable sources. "
                    f"Agreement: {agreement}. Deterministic score: {final_score}. "
                    f"Linguistic deception score: {linguistic_score}."
                )
                # 7. Output
                output = {
                    "verdict": verdict,
                    "confidence": final_score,
                    "explanation": explanation,
                    "sources": sources
                }
                # Store interaction
                AIInteractionLog.objects.create(
                    user=user,
                    model=model_instance,
                    input_type='claim_verification',
                    input_data=json.dumps({
                        'headline': headline,
                        'article': article,
                        'claim': claim,
                        'image_url': image_url
                    }),
                    output_data=json.dumps(output),
                    success=True,
                    error_message=None,
                    fallback_used=False,
                    request_metadata=request_metadata,
                    response_metadata={"score": final_score, "agreement": agreement},
                )
                return output
            except Exception as e:
                # Log and return UNCERTAIN
                output = {
                    "verdict": "UNCERTAIN",
                    "confidence": 0,
                    "explanation": f"Verification failed: {str(e)}",
                    "sources": []
                }
                try:
                    AIInteractionLog.objects.create(
                        user=user,
                        model=model_instance,
                        input_type='claim_verification',
                        input_data=json.dumps({
                            'headline': headline,
                            'article': article,
                            'claim': claim,
                            'image_url': image_url
                        }),
                        output_data=json.dumps(output),
                        success=False,
                        error_message=str(e),
                        fallback_used=True,
                        request_metadata=request_metadata,
                        response_metadata=None,
                    )
                except Exception as log_exc:
                    logger.error(f"Failed to log AI interaction: {log_exc}")
                return output

        def _search_candidate_urls(self, claim):
            """Stub: In production, use a real search API. Here, return static reputable URLs."""
            # This should be replaced with a real search (Google News, Bing, etc.)
            return [
                'https://www.reuters.com/world/fact-check-claim-example',
                'https://www.bbc.com/news/example-claim',
                'https://www.factcheck.org/2026/01/example-claim',
            ]
    """
    Main misinformation detection model.
    Uses transformer-based NLP models for text analysis.
    """
    
    def __init__(self):
        """Initialize AI models."""
        self.device = 'cuda' if settings.USE_GPU and torch.cuda.is_available() else 'cpu'
        
        # Load fake news detection model
        try:
            model_name = 'distilbert-base-uncased-finetuned-sst-2-english'
            self.classifier = pipeline(
                'text-classification',
                model=model_name,
                device=0 if self.device == 'cuda' else -1
            )
            logger.info(f"Loaded classifier model: {model_name}")
        except Exception as e:
            logger.error(f"Failed to load classifier model: {str(e)}")
            self.classifier = None
        
        # Load zero-shot classification for flexible categorization
        try:
            self.zero_shot = pipeline(
                'zero-shot-classification',
                model='facebook/bart-large-mnli',
                device=0 if self.device == 'cuda' else -1
            )
            logger.info("Loaded zero-shot classification model")
        except Exception as e:
            logger.error(f"Failed to load zero-shot model: {str(e)}")
            self.zero_shot = None
        
        # TF-IDF for text similarity
        self.tfidf = TfidfVectorizer(max_features=1000, stop_words='english')
        
        # Misinformation keywords and patterns
        self.misinformation_keywords = self._load_keywords()
    
    def analyze_text(self, text, language='en', user=None, model_instance=None, request_metadata=None):
        """
        Analyze text for misinformation.
        
        Args:
            text (str): Text to analyze
            language (str): Language code
        Returns:
            dict: Analysis results with score and explanation
        """
        from satyacheck.apps.ai.models_interaction import AIInteractionLog
        import json
        result = None
        error_message = None
        fallback_used = False
        try:
            if not text:
                result = {
                    'score': 50,
                    'confidence': 'low',
                    'category': 'unverifiable',
                    'explanation': 'No text provided for analysis.'
                }
                fallback_used = True
            else:
                # Text preprocessing
                cleaned_text = self._preprocess_text(text)
                # Get multiple analysis scores
                sentiment_score = self._analyze_sentiment(cleaned_text)
                keyword_score = self._check_misinformation_keywords(cleaned_text)
                length_score = self._analyze_text_length(cleaned_text)
                urgency_score = self._check_urgency_language(cleaned_text)
                # Combine scores using weighted average
                final_score = (
                    sentiment_score * 0.3 +
                    keyword_score * 0.3 +
                    length_score * 0.2 +
                    urgency_score * 0.2
                )
                # Determine category
                category = self._determine_category(cleaned_text, final_score)
                # Generate explanation
                explanation = self._generate_explanation(final_score, category, language)
                # Determine confidence
                confidence = self._calculate_confidence(final_score)
                result = {
                    'score': min(100, max(0, final_score)),
                    'confidence': confidence,
                    'category': category,
                    'explanation': explanation,
                    'component_scores': {
                        'sentiment': sentiment_score,
                        'keywords': keyword_score,
                        'length': length_score,
                        'urgency': urgency_score,
                    }
                }
        except Exception as e:
            logger.error(f"Text analysis error: {str(e)}")
            error_message = str(e)
            result = {
                'score': 50,
                'confidence': 'low',
                'category': 'unverifiable',
                'explanation': 'Unable to complete analysis. Please try again.'
            }
            fallback_used = True
        # Log to AIInteractionLog
        try:
            AIInteractionLog.objects.create(
                user=user,
                model=model_instance,
                input_type='text',
                input_data=text,
                output_data=json.dumps(result),
                success=not fallback_used,
                error_message=error_message,
                fallback_used=fallback_used,
                request_metadata=request_metadata,
                response_metadata=None,
            )
        except Exception as log_exc:
            logger.error(f"Failed to log AI interaction: {log_exc}")
        return result
    
    def analyze_image(self, image_path):
        """
        Analyze image for deepfakes and manipulation.
        
        Args:
            image_path (str): Path to image file
        
        Returns:
            dict: Analysis results
        """
        try:
            # Check if image is a deepfake (simplified implementation)
            # In production, use specialized deepfake detection models
            
            deepfake_score = self._check_image_deepfake(image_path)
            manipulation_score = self._check_image_manipulation(image_path)
            
            final_score = (deepfake_score * 0.6 + manipulation_score * 0.4)
            
            category = 'deepfake' if deepfake_score > 70 else 'manipulated_image' if final_score > 60 else 'other'
            
            return {
                'score': min(100, max(0, final_score)),
                'confidence': 'medium' if final_score > 40 else 'low',
                'category': category,
                'explanation': f'Image analysis indicates potential {category}. Score: {final_score:.1f}%',
                'deepfake_score': deepfake_score,
                'manipulation_score': manipulation_score,
            }
        
        except Exception as e:
            logger.error(f"Image analysis error: {str(e)}")
            return {
                'score': 50,
                'confidence': 'low',
                'category': 'unverifiable',
                'explanation': 'Unable to complete image analysis.'
            }
    
    def analyze_video(self, video_path):
        """
        Analyze video for deepfakes and manipulation.
        
        Args:
            video_path (str): Path to video file
        
        Returns:
            dict: Analysis results
        """
        try:
            # Sample frames from video and analyze
            deepfake_score = self._check_video_deepfake(video_path)
            audio_score = self._check_video_audio(video_path)
            
            final_score = (deepfake_score * 0.7 + audio_score * 0.3)
            
            return {
                'score': min(100, max(0, final_score)),
                'confidence': 'medium' if final_score > 40 else 'low',
                'category': 'manipulated_video' if final_score > 60 else 'other',
                'explanation': f'Video analysis complete. Manipulation likelihood: {final_score:.1f}%',
                'deepfake_score': deepfake_score,
                'audio_consistency_score': audio_score,
            }
        
        except Exception as e:
            logger.error(f"Video analysis error: {str(e)}")
            return {
                'score': 50,
                'confidence': 'low',
                'category': 'unverifiable',
                'explanation': 'Unable to complete video analysis.'
            }
    
    def analyze_audio(self, audio_path):
        """
        Analyze audio for deepfakes and manipulation.
        
        Args:
            audio_path (str): Path to audio file
        
        Returns:
            dict: Analysis results
        """
        try:
            deepfake_score = self._check_audio_deepfake(audio_path)
            
            return {
                'score': min(100, max(0, deepfake_score)),
                'confidence': 'medium' if deepfake_score > 40 else 'low',
                'category': 'deepfake' if deepfake_score > 70 else 'manipulated_video' if deepfake_score > 50 else 'other',
                'explanation': f'Audio analysis indicates potential synthesis. Score: {deepfake_score:.1f}%',
                'deepfake_score': deepfake_score,
            }
        
        except Exception as e:
            logger.error(f"Audio analysis error: {str(e)}")
            return {
                'score': 50,
                'confidence': 'low',
                'category': 'unverifiable',
                'explanation': 'Unable to complete audio analysis.'
            }
    
    # Helper Methods
    
    @staticmethod
    def _preprocess_text(text):
        """Preprocess text for analysis."""
        text = text.lower().strip()
        return text
    
    def _analyze_sentiment(self, text):
        """Analyze sentiment and credibility."""
        try:
            if self.classifier:
                result = self.classifier(text[:512])  # Limit to 512 tokens
                if result[0]['label'] == 'NEGATIVE':
                    return 70  # Negative sentiment might indicate misinformation
                elif result[0]['label'] == 'POSITIVE':
                    return 40
                else:
                    return 50
        except Exception as e:
            logger.debug(f"Sentiment analysis error: {str(e)}")
        
        return 50
    
    def _check_misinformation_keywords(self, text):
        """Check for misinformation keywords and patterns."""
        keyword_count = 0
        dangerous_keywords = self.misinformation_keywords.get('dangerous', [])
        
        for keyword in dangerous_keywords:
            if keyword.lower() in text:
                keyword_count += 1
        
        # Score based on keywords found
        score = min(100, keyword_count * 10)
        return score
    
    @staticmethod
    def _analyze_text_length(text):
        """Analyze text length for misinformation indicators."""
        word_count = len(text.split())
        
        # Very short texts are harder to verify
        if word_count < 20:
            return 60
        elif word_count < 50:
            return 50
        else:
            return 40
    
    @staticmethod
    def _check_urgency_language(text):
        """Check for urgency language patterns."""
        urgency_words = [
            'urgent', 'breaking', 'exclusive', 'must read', 'unbelievable',
            'shocking', 'banned', 'don\'t share', 'do not share', 'secret'
        ]
        
        urgency_count = sum(1 for word in urgency_words if word in text.lower())
        return min(100, urgency_count * 15)
    
    @staticmethod
    def _determine_category(text, score):
        """Determine misinformation category."""
        if 'fake' in text.lower() or 'hoax' in text.lower():
            return 'fake_news'
        elif 'propaganda' in text.lower():
            return 'propaganda'
        elif 'spam' in text.lower() or 'promotional' in text.lower():
            return 'spam'
        elif 'satire' in text.lower() or 'joke' in text.lower():
            return 'satire'
        elif score > 60:
            return 'misleading'
        else:
            return 'other'
    
    @staticmethod
    def _generate_explanation(score, category, language):
        """Generate human-readable explanation."""
        explanations = {
            'en': {
                'fake_news': 'Analysis suggests this content may contain false or misleading information. Verify with trusted sources.',
                'propaganda': 'Content appears to contain propaganda or biased messaging. Cross-reference with multiple sources.',
                'spam': 'This appears to be promotional or spam content.',
                'satire': 'This content may be satirical or comedic. Treat as entertainment, not news.',
                'misleading': 'Content contains potentially misleading information. Verify before sharing.',
                'other': 'Analysis complete. Content appears generally credible.',
            },
            'ne': {
                'fake_news': 'यो सामग्री गलत वा भ्रामक जानकारी समावेश गरीरहेको देखिन्छ।',
                'propaganda': 'यो सामग्री प्रचार वा पक्षपाती सन्देश समावेश गरीरहेको देखिन्छ।',
                'spam': 'यो प्रचारमूलक वा स्पैम सामग्री हो।',
                'satire': 'यो सामग्री व्यङ्ग्य हो।',
                'misleading': 'यो सामग्रीले सम्भावित रूपमा भ्रामक जानकारी समावेश गर्दछ।',
                'other': 'विश्लेषण पूरा भयो।',
            }
        }
        
        default_explanation = explanations.get(language, explanations['en'])
        return default_explanation.get(category, 'Analysis complete.')
    
    @staticmethod
    def _calculate_confidence(score):
        """Calculate confidence level."""
        if score >= 70 or score <= 30:
            return 'high'
        elif score >= 50 or score <= 50:
            return 'medium'
        else:
            return 'low'
    
    @staticmethod
    def _check_image_deepfake(image_path):
        """Check if image is a deepfake."""
        # Placeholder implementation
        # In production, use specialized deepfake detection models like:
        # - FaceForensics++
        # - MediaForensics
        return np.random.randint(20, 50)  # Random score for demo
    
    @staticmethod
    def _check_image_manipulation(image_path):
        """Check if image has been manipulated."""
        # Placeholder implementation
        # In production, use image forensics techniques
        return np.random.randint(20, 50)  # Random score for demo
    
    @staticmethod
    def _check_video_deepfake(video_path):
        """Check if video contains deepfake."""
        # Placeholder implementation
        return np.random.randint(20, 50)
    
    @staticmethod
    def _check_video_audio(video_path):
        """Check audio-video consistency in video."""
        # Placeholder implementation
        return np.random.randint(20, 50)
    
    @staticmethod
    def _check_audio_deepfake(audio_path):
        """Check if audio is synthetically generated."""
        # Placeholder implementation
        return np.random.randint(20, 50)
    
    @staticmethod
    def _load_keywords():
        """Load misinformation keywords and patterns."""
        return {
            'dangerous': [
                'immediate action', 'urgent purchase', 'limited time', 'exclusive',
                'unbelievable results', 'banned', 'shocking truth', 'hidden',
                'fake', 'hoax', 'conspiracy'
            ],
            'fact_check_phrases': [
                'according to', 'studies show', 'experts say', 'verified by',
                'research indicates'
            ]
        }


# Singleton instance
_model_instance = None


def get_model():
    """Get or initialize the AI model."""
    global _model_instance
    if _model_instance is None:
        _model_instance = MisinformationDetectionModel()
    return _model_instance
