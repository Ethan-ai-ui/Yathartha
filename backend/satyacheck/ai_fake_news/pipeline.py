"""
Pipeline Orchestration for Fake News Detection
Connects all layers for end-to-end processing.
"""
from typing import Dict, Any
from .ingestion import ingest_article
from .preprocessing import preprocess
from .features import extract_features
from .reasoning import score_claim
from .decision import make_decision

def detect_fake_news(text: str, metadata: Dict[str, Any]) -> Any:
    """
    Orchestrates the full pipeline from ingestion to decision.
    Returns DetectionResult.
    """
    article = ingest_article(text, metadata)
    preprocessed = preprocess(article)
    features = extract_features(preprocessed)
    scored = score_claim(features)
    decision = make_decision(scored)
    return decision
