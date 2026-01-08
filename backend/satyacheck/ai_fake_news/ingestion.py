"""
Data Ingestion Layer
Handles input of text, metadata, and normalization of input structure.
"""
from typing import Dict, Any

def ingest_article(text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Accepts raw text and metadata, returns normalized dict.
    """
    # Validate and normalize input
    return {
        'text': text.strip(),
        'metadata': metadata or {},
    }
