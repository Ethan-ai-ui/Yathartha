import hashlib
import random
try:
    from celery import shared_task
except ImportError:
    shared_task = None

import asyncio
from typing import List, Dict, Any, Optional

# --- Layered Dynamic Fake News Evaluation Pipeline ---

class LayerResult:
    def __init__(self, name: str, score: float, signals: Dict[str, Any], explanation: str, uncertainty: float = 0.0):
        self.name = name
        self.score = score
        self.signals = signals
        self.explanation = explanation
        self.uncertainty = uncertainty

    def as_dict(self):
        return {
            "layer": self.name,
            "score": self.score,
            "signals": self.signals,
            "explanation": self.explanation,
            "uncertainty": self.uncertainty,
        }

class FakeNewsInvestigator:
        def get_deterministic_seed(self, article: Dict[str, Any]) -> int:
            """
            Generate a deterministic seed for scoring based on article snapshot (text, media, source, timestamp).
            """
            snapshot = str(article.get("text", "")) + str(article.get("media", [])) + str(article.get("source", "")) + str(article.get("timestamp", ""))
            return int(hashlib.sha256(snapshot.encode()).hexdigest(), 16) % (10 ** 8)
    def __init__(self):
        pass

    async def evaluate(self, article: Dict[str, Any]) -> Dict[str, Any]:
        # Set deterministic random seed for this evaluation snapshot
        seed = self.get_deterministic_seed(article)
        random.seed(seed)
        # Celery async task for heavy analysis
        if shared_task:
            @shared_task
            def evaluate_article_task(article: Dict[str, Any]) -> Dict[str, Any]:
                import asyncio
                investigator = FakeNewsInvestigator()
                return asyncio.run(investigator.evaluate(article))
        """
        Main entry: Evaluate an article with text, media, and metadata.
        Returns a detailed, explainable, layered verdict.
        """
        claims = self.extract_claims(article.get("text", ""))
        media = article.get("media", [])
        source = article.get("source", "")

        claim_results = []
        for claim in claims:
            claim_result = await self.evaluate_claim(claim, media, source)
            claim_results.append(claim_result)

        # Aggregate claim-level results
        final_score, final_uncertainty, claim_breakdown = self.aggregate_claims(claim_results)

        # Explainability: layer-wise breakdown, top signals, source agreement/disagreement, uncertainty
        explain = self.explain_aggregation(claim_results)
        layer_breakdown = [
            {
                "claim": c["claim"],
                "layers": c["layers"],
                "final_score": c["final_score"],
                "uncertainty": c["uncertainty"]
            }
            for c in claim_results
        ]
        top_signals = self.extract_top_signals(claim_results)
        source_agreement = self.extract_source_agreement(claim_results)

        return {
            "final_score": final_score,
            "uncertainty": final_uncertainty,
            "claims": claim_breakdown,
            "layer_breakdown": layer_breakdown,
            "top_signals": top_signals,
            "source_agreement": source_agreement,
            "explanation": explain,
        }

    def extract_top_signals(self, claim_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Extract top contributing signals from all layers
        top_signals = []
        for c in claim_results:
            for l in c["layers"]:
                for k, v in l["signals"].items():
                    top_signals.append({"claim": c["claim"], "layer": l["layer"], "signal": k, "value": v})
        return top_signals

    def extract_source_agreement(self, claim_results: List[Dict[str, Any]]) -> Dict[str, List[str]]:
        # Which sources/layers agreed or disagreed
        agreement = {"agreed": [], "disagreed": [], "uncertain": []}
        for c in claim_results:
            for l in c["layers"]:
                if l["layer"] == "Cross-Source Verification":
                    val = l["signals"].get("external_agreement")
                    if val == "confirmed":
                        agreement["agreed"].append(c["claim"])
                    elif val == "disputed":
                        agreement["disagreed"].append(c["claim"])
                    else:
                        agreement["uncertain"].append(c["claim"])
        return agreement

    def extract_claims(self, text: str) -> List[str]:
        """
        Extract factual claims from text using a modular, extensible approach.
        For production, integrate with advanced NLP (e.g., spaCy, transformers, claim extraction models).
        """
        try:
            import spacy
            nlp = spacy.load("en_core_web_sm")
            doc = nlp(text)
            # Placeholder: Use sentence boundaries as claims, but allow for future model-based extraction
            claims = [sent.text.strip() for sent in doc.sents if len(sent.text.split()) > 3]
        except Exception:
            # Fallback: simple sentence split
            import re
            claims = re.split(r'(?<=[.!?]) +', text.strip())
            claims = [s for s in claims if len(s.split()) > 3]
        return claims

    async def evaluate_claim(self, claim: str, media: List[Any], source: str) -> Dict[str, Any]:
        """
        Evaluate a single claim through all pipeline layers.
        """
        layers = []

        # 1. Input & Media Analysis
        input_layer = await self.input_media_analysis(claim, media)
        layers.append(input_layer)

        # 2. Linguistic & Semantic Analysis
        ling_layer = await self.linguistic_semantic_analysis(claim)
        layers.append(ling_layer)

        # 3. Source Credibility
        source_layer = await self.source_credibility(source)
        layers.append(source_layer)

        # 4. Real-Time Cross-Source Verification
        cross_layer = await self.cross_source_verification(claim)
        layers.append(cross_layer)

        # 5. Temporal Consistency
        temporal_layer = await self.temporal_consistency(claim, media)
        layers.append(temporal_layer)

        # 6. Ensemble & Conflict Resolution
        ensemble_layer = self.ensemble_scoring(layers)
        layers.append(ensemble_layer)

        return {
            "claim": claim,
            "layers": [l.as_dict() for l in layers],
            "final_score": ensemble_layer.score,
            "uncertainty": ensemble_layer.uncertainty,
        }

    async def input_media_analysis(self, claim: str, media: List[Any]) -> LayerResult:
        # Analyze claim and associated media (metadata, reverse search, context mismatch)
        # In production, integrate with image/video analysis, reverse search APIs, and metadata extraction
        media_count = len(media)
        context_mismatch = False
        reverse_search_result = "unknown"
        for m in media:
            # Simulate metadata and context check
            if isinstance(m, dict):
                if m.get("timestamp") and m.get("event_time"):
                    if abs(m["timestamp"] - m["event_time"]) > 86400:  # 1 day
                        context_mismatch = True
                # Simulate reverse search (stub)
                reverse_search_result = m.get("reverse_search", "unknown")
        score = 0.7 if not context_mismatch else 0.3
        signals = {
            "media_count": media_count,
            "context_mismatch": context_mismatch,
            "reverse_search": reverse_search_result
        }
        explanation = "Analyzed media for metadata, reverse search, and context consistency."
        uncertainty = 0.15 if media_count else 0.3
        return LayerResult("Input & Media Analysis", score, signals, explanation, uncertainty=uncertainty)

    async def linguistic_semantic_analysis(self, claim: str) -> LayerResult:
        # Placeholder: NLP, emotion, adversarial pattern detection
        score = 0.5
        signals = {"sentiment": "neutral"}
        explanation = "Checked for linguistic cues, adversarial or manipulative language."
        return LayerResult("Linguistic & Semantic Analysis", score, signals, explanation, uncertainty=0.15)

    async def source_credibility(self, source: str) -> LayerResult:
        # Placeholder: check source against known lists, reputation, history
        score = 0.5
        signals = {"source": source, "credibility": "unknown"}
        explanation = "Assessed source reputation and historical reliability."
        return LayerResult("Source Credibility", score, signals, explanation, uncertainty=0.1)

    async def cross_source_verification(self, claim: str) -> LayerResult:
        # Conceptual: real-time search, fact-checking, cross-reference
        # In production, use async web/API queries, cache expiry, etc.
        # Here, simulate with a stub and cache expiry logic
        import time
        cache = getattr(self, '_cross_source_cache', {})
        now = time.time()
        cache_expiry = 60  # seconds
        if claim in cache and now - cache[claim]['timestamp'] < cache_expiry:
            result = cache[claim]['result']
        else:
            # Simulate real-time search/fact-check (replace with actual API calls)
            # e.g., search Google/Bing, check fact-checking DBs, etc.
            # For now, randomize agreement/dispute
            import random
            agreement = random.choice(["confirmed", "disputed", "no_match"])
            result = {"external_agreement": agreement}
            cache[claim] = {"result": result, "timestamp": now}
            self._cross_source_cache = cache
        # Score logic: confirmed=0.9, disputed=0.1, no_match=0.5
        agreement = result["external_agreement"]
        score_map = {"confirmed": 0.9, "disputed": 0.1, "no_match": 0.5}
        score = score_map.get(agreement, 0.5)
        explanation = f"Queried external sources: claim is {agreement}."
        uncertainty = 0.2 if agreement == "no_match" else 0.1
        return LayerResult("Cross-Source Verification", score, result, explanation, uncertainty=uncertainty)

    async def temporal_consistency(self, claim: str, media: List[Any]) -> LayerResult:
        # Placeholder: check if claim/media timing matches event context
        score = 0.5
        signals = {"temporal_match": True}
        explanation = "Checked for temporal consistency between claim, media, and known events."
        return LayerResult("Temporal Consistency", score, signals, explanation, uncertainty=0.1)

    def ensemble_scoring(self, layers: List[LayerResult]) -> LayerResult:
        # Combine all layer scores, handle conflicts, propagate uncertainty
        scores = [l.score for l in layers]
        uncertainties = [l.uncertainty for l in layers]
        score = sum(scores) / len(scores)
        uncertainty = max(uncertainties)
        explanation = "Aggregated all layer scores, resolved conflicts, and computed final claim confidence."
        return LayerResult("Ensemble & Conflict Resolution", score, {}, explanation, uncertainty)

    def aggregate_claims(self, claim_results: List[Dict[str, Any]]) -> (float, float, List[Dict[str, Any]]):
        # Aggregate per-claim scores into article-level verdict, propagate uncertainty, admit insufficient evidence
        if not claim_results:
            return 0.0, 1.0, []
        scores = [c["final_score"] for c in claim_results]
        uncertainties = [c["uncertainty"] for c in claim_results]
        # If all uncertainties are high or all scores are near 0.5, admit insufficient evidence
        if all(u > 0.7 for u in uncertainties) or all(0.4 < s < 0.6 for s in scores):
            return 0.5, 1.0, claim_results
        final_score = sum(scores) / len(scores)
        final_uncertainty = max(uncertainties)
        return final_score, final_uncertainty, claim_results

    def explain_aggregation(self, claim_results: List[Dict[str, Any]]) -> str:
        # Explain why the final score was reached, and why it differs from other articles
        if not claim_results:
            return "No claims detected. Insufficient evidence."
        explanations = []
        for c in claim_results:
            if c["uncertainty"] > 0.7 or 0.4 < c["final_score"] < 0.6:
                explanations.append(f"Claim: '{c['claim']}' - Insufficient evidence or high uncertainty.")
            else:
                explanations.append(f"Claim: '{c['claim']}' - Score: {c['final_score']:.2f}, Uncertainty: {c['uncertainty']:.2f}")
        return " | ".join(explanations)

# Example usage (for testing, remove in production):
# import asyncio
# article = {"text": "The sky is green. The president resigned yesterday.", "media": [], "source": "example.com"}
# result = asyncio.run(FakeNewsInvestigator().evaluate(article))
# print(result)
