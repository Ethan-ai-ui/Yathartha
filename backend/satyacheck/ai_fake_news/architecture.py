"""
System Architecture for Fake News Detection
Defines the layered pipeline and module boundaries.
"""

from enum import Enum

class NewsLabel(Enum):
    REAL = 'Real'
    LIKELY_REAL = 'Likely Real'
    UNCERTAIN = 'Uncertain'
    LIKELY_FAKE = 'Likely Fake'
    FAKE = 'Fake'

class ExplainabilityPayload:
    def __init__(self, reasons, signals, confidence):
        self.reasons = reasons  # List of human-readable explanations
        self.signals = signals  # Dict of signal_name: value
        self.confidence = confidence  # float

class DetectionResult:
    def __init__(self, label, confidence, explainability):
        self.label = label  # NewsLabel
        self.confidence = confidence  # float
        self.explainability = explainability  # ExplainabilityPayload
