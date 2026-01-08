"""
Decision Layer
Maps scores to output classes, attaches explainability payload, and ensures deterministic, fail-safe output.
"""
from typing import Dict, Any
from .architecture import NewsLabel, DetectionResult, ExplainabilityPayload

def make_decision(scored: Dict[str, Any]) -> DetectionResult:
    """
    Maps score and label to NewsLabel, attaches explainability, and ensures deterministic output.
    """
    label = NewsLabel[scored['label'].replace(' ', '_').upper()] if scored['label'] else NewsLabel.UNCERTAIN
    explain = ExplainabilityPayload(
        reasons=scored['explainability']['reasons'],
        signals=scored['explainability']['signals'],
        confidence=scored['explainability']['confidence'],
    )
    return DetectionResult(label, scored['confidence'], explain)
