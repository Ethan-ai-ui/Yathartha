"""
Celery Task for Asynchronous Fake News Detection
Ensures async, caching, and deterministic results.
"""
from celery import shared_task
from .pipeline import detect_fake_news
import hashlib
import json
from django.core.cache import cache

@shared_task(bind=True)
def async_detect_fake_news(self, text, metadata):
    """
    Asynchronous task for fake news detection with caching and deterministic output.
    """
    # Deterministic cache key
    key = hashlib.sha256((text + json.dumps(metadata, sort_keys=True)).encode()).hexdigest()
    result = cache.get(key)
    if result:
        return result
    decision = detect_fake_news(text, metadata)
    # Serialize result for caching
    result = {
        'label': decision.label.value,
        'confidence': decision.confidence,
        'explainability': {
            'reasons': decision.explainability.reasons,
            'signals': decision.explainability.signals,
            'confidence': decision.explainability.confidence,
        }
    }
    cache.set(key, result, timeout=3600)
    return result
