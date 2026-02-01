## SatyaCheck AI System Documentation

### Overview
SatyaCheck is an AI-powered news authenticity verification platform. It analyzes user-submitted claims, headlines, articles, and optional images/URLs to determine the likelihood of misinformation using a deterministic, auditable pipeline.

### AI Pipeline
**Input → Claim Extraction → Source Retrieval → Cross-Verification → Scoring → Verdict → Structured Output**

#### 1. Input
- User submits: headline, article, claim, optional image/source URL.

#### 2. Claim Extraction
- Uses provided claim or extracts from headline/article.

#### 3. Source Retrieval
- Searches only reputable sources (e.g., Reuters, BBC, FactCheck.org, .gov, .edu).
- Penalizes or excludes low-credibility/clickbait domains.

#### 4. Cross-Verification
- Checks for claim agreement across sources using deterministic keyword/claim matching.

#### 5. Scoring
- Combines:
  - Source credibility
  - Claim consistency
  - Linguistic deception markers
  - Cross-source agreement
- All scoring is deterministic and explainable.

#### 6. Verdict
- Outputs one of: `REAL`, `FAKE`, `UNCERTAIN`.
- If any step fails, returns `UNCERTAIN` with explanation.

#### 7. Structured Output
```
{
  "verdict": "REAL | FAKE | UNCERTAIN",
  "confidence": 0-100,
  "explanation": "Clear factual reasoning",
  "sources": [
    { "title": "", "publisher": "", "url": "" }
  ]
}
```

### Fallback Logic
- If claim extraction, source retrieval, or cross-verification fails, the system returns `UNCERTAIN` and logs the reason.
- No hallucinated sources or free-form answers.
- All results are persisted and auditable.

### Data Storage
- Stores: user input, extracted claims, sources used, verdicts, scores, timestamps, user ID.
- All results are traceable for legal/ethical scrutiny.

### Security
- Token-based authentication (access/refresh tokens, httpOnly cookies).
- Rate limiting on all sensitive endpoints.
- Standardized API responses and error handling.