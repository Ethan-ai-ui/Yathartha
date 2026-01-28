# SatyaCheck Frontend-Backend Integration Guide

## Overview

This guide explains how to integrate the React/Vite frontend with the Django REST API backend.

## Backend API Base URL

```javascript
// In frontend .env
VITE_API_URL=http://localhost:8000/api/v1
```

## Authentication Flow

### 1. User Registration

**Request:**
```javascript
POST /api/v1/auth/signup/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+977-9841234567",
  "role": "citizen"  // citizen, journalist, ngo, admin
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "citizen",
    "is_verified": false
  }
}
```

**Frontend Implementation:**
```typescript
// src/services/auth.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function signup(data: SignupData) {
  const response = await api.post('/auth/signup/', data);
  
  // Store tokens
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  
  // Store user
  localStorage.setItem('user', JSON.stringify(response.data.user));
  
  return response.data;
}
```

### 2. User Login

**Request:**
```javascript
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "citizen"
  }
}
```

### 3. Token Management

**Add to Axios instance:**
```typescript
// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      try {
        const refresh = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh }
        );
        localStorage.setItem('access_token', response.data.access);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${response.data.access}`;
        return api(error.config);
      } catch {
        // Logout user
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Content Submission API

### 1. Text Submission

**Request:**
```javascript
POST /api/v1/submissions/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "submission_type": "text",
  "title": "Claim about COVID-19",
  "description": "Need fact-checking",
  "text_content": "The claim being analyzed...",
  "language": "en",
  "location": "Kathmandu",
  "tags": ["covid", "health"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "submission_type": "text",
  "title": "Claim about COVID-19",
  "status": "analyzing",
  "created_at": "2024-01-15T10:30:00Z",
  "analysis_status": "in_progress"
}
```

### 2. Image Submission

**Request:**
```javascript
POST /api/v1/submissions/
Content-Type: multipart/form-data
Authorization: Bearer {access_token}

FormData:
- submission_type: "image"
- title: "Suspicious image"
- description: "Please analyze this image"
- file: [image file]
- language: "en"
```

**Response:**
```json
{
  "id": "uuid",
  "submission_type": "image",
  "file": "https://api.satyacheck.com/media/uploads/image.jpg",
  "status": "analyzing",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### 3. Video Submission

**Request:**
```javascript
POST /api/v1/submissions/
Content-Type: multipart/form-data
Authorization: Bearer {access_token}

FormData:
- submission_type: "video"
- title: "Video to verify"
- file: [video file]
- language: "en"
```

### 4. Link Submission

**Request:**
```javascript
POST /api/v1/submissions/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "submission_type": "link",
  "source_url": "https://example-news.com/article",
  "title": "Article title",
  "language": "en"
}
```

**Response:**
```json
{
  "id": "uuid",
  "submission_type": "link",
  "source_url": "https://example-news.com/article",
  "status": "analyzing",
  "scraped_content": {
    "title": "Article Title",
    "description": "Article description",
    "main_text": "Full article text..."
  }
}
```

## Get Verification Results

**Request:**
```javascript
GET /api/v1/submissions/{id}/results/
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "id": "uuid",
  "submission_id": "uuid",
  "misinformation_score": 75.5,
  "confidence_level": "high",
  "category": "fake_news",
  "explanation_en": "This claim has been fact-checked and found to be false...",
  "explanation_ne": "यो दाबी तथ्य-जाँच गरिएको छ र गलत पाइएको छ...",
  "risk_level": "high",
  "recommendation": "Do not share",
  "key_findings": [
    "Claim contradicts official sources",
    "Similar debunking found on Snopes"
  ],
  "similar_articles": [
    "https://factcheck.org/article1",
    "https://snopes.com/article2"
  ],
  "analyzed_at": "2024-01-15T10:35:00Z"
}
```

## Frontend Component Examples

### Submission Form Component

```typescript
// src/components/SubmitContent.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';

export function SubmitContent() {
  const [formData, setFormData] = useState({
    submission_type: 'text',
    title: '',
    text_content: '',
    language: 'en'
  });

  const submitMutation = useMutation({
    mutationFn: (data) => api.post('/submissions/', data),
    onSuccess: (data) => {
      console.log('Submission created:', data);
      // Show success message
      // Redirect to results page
    },
    onError: (error) => {
      console.error('Submission failed:', error);
      // Show error message
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select 
        value={formData.submission_type}
        onChange={(e) => setFormData({...formData, submission_type: e.target.value})}
      >
        <option value="text">Text</option>
        <option value="image">Image</option>
        <option value="video">Video</option>
        <option value="link">Link</option>
      </select>

      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />

      {formData.submission_type === 'text' && (
        <textarea
          placeholder="Paste the content you want to fact-check"
          value={formData.text_content}
          onChange={(e) => setFormData({...formData, text_content: e.target.value})}
          required
        />
      )}

      <button type="submit" disabled={submitMutation.isPending}>
        {submitMutation.isPending ? 'Analyzing...' : 'Submit for Analysis'}
      </button>
    </form>
  );
}
```

### Results Display Component

```typescript
// src/components/VerificationResult.tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

interface Props {
  submissionId: string;
}

export function VerificationResult({ submissionId }: Props) {
  const { data: submission } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => api.get(`/submissions/${submissionId}/`),
    refetchInterval: submission?.status === 'analyzing' ? 2000 : false
  });

  const { data: results } = useQuery({
    queryKey: ['results', submissionId],
    queryFn: () => api.get(`/submissions/${submissionId}/results/`),
    enabled: submission?.status === 'completed'
  });

  if (!submission) return <div>Loading...</div>;

  if (submission.status === 'analyzing') {
    return <div>🔄 Analysis in progress...</div>;
  }

  if (!results) return <div>No results available</div>;

  const scoreColor = results.risk_level === 'high' ? 'red' : 
                    results.risk_level === 'medium' ? 'orange' : 'green';

  return (
    <div className="result-card">
      <h2>Verification Result</h2>
      
      <div className="score-section">
        <div className={`score ${scoreColor}`}>
          {results.misinformation_score.toFixed(1)}%
        </div>
        <p>Misinformation Score</p>
      </div>

      <div className="category">
        <strong>Category:</strong> {results.category}
      </div>

      <div className="explanation">
        <strong>Explanation:</strong>
        <p>{results.explanation_en}</p>
      </div>

      <div className="recommendation">
        <strong>Recommendation:</strong>
        <p className={results.risk_level}>{results.recommendation}</p>
      </div>

      {results.key_findings && (
        <div className="findings">
          <strong>Key Findings:</strong>
          <ul>
            {results.key_findings.map((finding, i) => (
              <li key={i}>{finding}</li>
            ))}
          </ul>
        </div>
      )}

      {results.similar_articles && (
        <div className="sources">
          <strong>Related Articles:</strong>
          <ul>
            {results.similar_articles.map((article, i) => (
              <li key={i}>
                <a href={article} target="_blank">View Article</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Error Handling

**Common Error Codes:**

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid request | Check request format and parameters |
| 401 | Unauthorized | Login required, token expired |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not found | Resource doesn't exist |
| 422 | Validation error | Check field validation errors |
| 429 | Rate limited | Wait before making more requests |
| 500 | Server error | Retry or contact support |

**Error Response:**
```json
{
  "detail": "Invalid credentials",
  "errors": {
    "email": ["This field may not be blank."],
    "password": ["This password is too common."]
  }
}
```

**Handle Errors:**
```typescript
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    switch(status) {
      case 401:
        localStorage.clear();
        window.location.href = '/login';
        break;
      case 429:
        showToast('Too many requests. Please try again later.');
        break;
      case 422:
        showValidationErrors(error.response.data.errors);
        break;
      default:
        showToast(detail || 'An error occurred');
    }
    
    return Promise.reject(error);
  }
);
```

## Rate Limiting

The API implements rate limiting:
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour

**Response Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

## API Documentation

Full API documentation available at:
- Development: http://localhost:8000/api/schema/
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Testing Integration

```typescript
// src/__tests__/integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '@/services/api';

describe('Frontend-Backend Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should signup a new user', async () => {
    const response = await api.post('/auth/signup/', {
      email: 'test@example.com',
      username: 'testuser',
      password: 'TestPass123!',
      first_name: 'Test',
      last_name: 'User'
    });

    expect(response.data).toHaveProperty('access_token');
    expect(response.data.user.email).toBe('test@example.com');
  });

  it('should submit and get results', async () => {
    // Login first
    await api.post('/auth/login/', {
      email: 'test@example.com',
      password: 'TestPass123!'
    });

    // Submit content
    const submission = await api.post('/submissions/', {
      submission_type: 'text',
      title: 'Test claim',
      text_content: 'Test content',
      language: 'en'
    });

    expect(submission.data.status).toBe('analyzing');

    // Wait for analysis
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get results
    const results = await api.get(`/submissions/${submission.data.id}/results/`);
    expect(results.data).toHaveProperty('misinformation_score');
  });
});
```

## Webhook Integration (Optional)

Subscribe to submission status changes:

```javascript
POST /api/v1/webhooks/subscribe/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "url": "https://yourapp.com/webhook/analysis-complete",
  "events": ["submission.analyzed", "submission.flagged"]
}
```

**Webhook Payload:**
```json
{
  "event": "submission.analyzed",
  "submission_id": "uuid",
  "status": "completed",
  "results": {
    "misinformation_score": 75.5,
    "category": "fake_news"
  }
}
```

## Support

For integration issues:
1. Check API documentation
2. Review example code
3. Check logs in Django admin
4. Contact development team
