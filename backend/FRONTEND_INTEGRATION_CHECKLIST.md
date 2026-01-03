# 🔗 Frontend-Backend Integration Checklist

## Phase 1: Backend Setup & Documentation Review

### Backend Team Tasks
- [ ] Backend running locally (http://localhost:8000)
- [ ] All services running:
  - [ ] Django API
  - [ ] PostgreSQL
  - [ ] Redis
  - [ ] Celery worker
  - [ ] Celery beat
- [ ] Migrations completed: `python manage.py migrate`
- [ ] Superuser created: `python manage.py createsuperuser`
- [ ] Test data loaded: `python scripts/setup.py`
- [ ] Sample trusted sources in database

### Frontend Team Tasks
- [ ] Read INTEGRATION.md completely
- [ ] Read API documentation: http://localhost:8000/api/docs/
- [ ] Review example request/response codes
- [ ] Setup Axios/fetch with interceptors
- [ ] Configure CORS in .env: `VITE_API_URL=http://localhost:8000/api/v1`

---

## Phase 2: Authentication Integration

### Backend Endpoints Ready
```
POST   /auth/signup/              - Register user
POST   /auth/login/               - Login
POST   /auth/logout/              - Logout
GET    /auth/profile/             - Get current user
PUT    /auth/update-profile/      - Update profile
POST   /auth/change-password/     - Change password
POST   /auth/request-otp/         - Request OTP
POST   /auth/verify-otp/          - Verify OTP
POST   /auth/token/refresh/       - Refresh token
```

### Frontend Implementation Checklist

#### 1. Signup Flow
- [ ] Create signup form component
- [ ] Validate email format
- [ ] Validate password strength
- [ ] Call POST /auth/signup/
- [ ] Store access_token in localStorage
- [ ] Store refresh_token securely
- [ ] Redirect to dashboard
- [ ] Handle validation errors
- [ ] Show success message

#### 2. Login Flow
- [ ] Create login form component
- [ ] Accept email or username
- [ ] Call POST /auth/login/
- [ ] Store tokens
- [ ] Redirect to dashboard
- [ ] Display error messages
- [ ] Show loading indicator
- [ ] Implement "Remember me" (optional)

#### 3. Token Management
- [ ] Add Authorization header to all requests
- [ ] Implement token refresh interceptor
- [ ] Handle 401 responses
- [ ] Auto-logout on token expiration
- [ ] Clear localStorage on logout
- [ ] Redirect to login on unauthorized

#### 4. OTP Verification
- [ ] Create OTP request form
- [ ] Create OTP verification form
- [ ] Call POST /auth/request-otp/
- [ ] Call POST /auth/verify-otp/
- [ ] Handle OTP expiration
- [ ] Implement retry logic
- [ ] Show remaining attempts

#### 5. Profile Management
- [ ] Create profile view component
- [ ] Display user information
- [ ] Create profile update form
- [ ] Call PUT /auth/update-profile/
- [ ] Update local state after success
- [ ] Show profile picture
- [ ] Display user role

#### 6. Password Change
- [ ] Create password change form
- [ ] Validate current password
- [ ] Validate new password strength
- [ ] Call POST /auth/change-password/
- [ ] Clear form on success
- [ ] Show confirmation message

**Test Cases:**
```typescript
// Signup with valid data → Success
// Signup with existing email → Error
// Signup with weak password → Error
// Login with correct credentials → Success
// Login with incorrect password → Error
// Token refresh when expired → New token
// Access protected endpoint without token → 401
// OTP verification with wrong code → Error
```

---

## Phase 3: Content Submission Integration

### Backend Endpoints Ready
```
POST   /submissions/               - Create submission
GET    /submissions/               - List submissions
GET    /submissions/{id}/          - Get submission
PUT    /submissions/{id}/          - Update submission
DELETE /submissions/{id}/          - Delete submission
GET    /submissions/{id}/results/  - Get verification results
POST   /submissions/{id}/flag/     - Flag submission
POST   /submissions/bulk_action/   - Bulk operations
```

### Frontend Implementation Checklist

#### 1. Text Submission
- [ ] Create text submission form
- [ ] Input: title, description, text_content, language
- [ ] Call POST /submissions/
- [ ] Show submission status
- [ ] Poll for results (GET /submissions/{id}/results/)
- [ ] Display verification result when ready
- [ ] Handle long-running analysis (show spinner)

#### 2. Image Submission
- [ ] Create image upload form
- [ ] Validate file type (jpg, png, etc.)
- [ ] Validate file size (< 10MB)
- [ ] Show upload progress bar
- [ ] Call POST /submissions/ with FormData
- [ ] Display submitted image
- [ ] Show analysis progress
- [ ] Display results

#### 3. Video Submission
- [ ] Create video upload form
- [ ] Validate file type (mp4, webm, etc.)
- [ ] Validate file size (< 100MB)
- [ ] Show upload progress
- [ ] Call POST /submissions/ with FormData
- [ ] Display video player
- [ ] Show estimated analysis time
- [ ] Display results

#### 4. Audio Submission
- [ ] Create audio upload form
- [ ] Validate file type (mp3, wav, etc.)
- [ ] Validate file size (< 50MB)
- [ ] Show upload progress
- [ ] Call POST /submissions/ with FormData
- [ ] Display audio player
- [ ] Show analysis progress
- [ ] Display results

#### 5. Link Submission
- [ ] Create link submission form
- [ ] Input: source_url, title (optional)
- [ ] Validate URL format
- [ ] Call POST /submissions/ with link type
- [ ] Show scraped content preview
- [ ] Display analysis progress
- [ ] Show verification results

#### 6. Results Display
- [ ] Display misinformation score (0-100)
- [ ] Show risk level (high/medium/low)
- [ ] Display category (fake_news, propaganda, etc.)
- [ ] Show confidence level
- [ ] Display explanation in user's language
- [ ] Show key findings
- [ ] Link to supporting sources
- [ ] Show recommendation
- [ ] Display "Verified by" if manually reviewed

#### 7. Submission Management
- [ ] List user's submissions
- [ ] Filter by status (analyzing, completed, flagged)
- [ ] Search submissions
- [ ] Sort by date, score
- [ ] Show submission history
- [ ] Delete submission
- [ ] Edit submission metadata

**Test Cases:**
```typescript
// Submit valid text → Success, "analyzing" status
// Submit while analyzing → Show loading state
// Get results for completed submission → Misinformation score displayed
// Submit large file → Handle file size error
// Submit with invalid URL → Validation error
// Bulk flag submissions → Success
// Bulk export as CSV → File downloaded
```

---

## Phase 4: Results & Verification Display

### Key Components to Build

#### 1. Verification Result Card
```
┌─────────────────────────────────┐
│  Score: 75% (HIGH RISK) 🔴      │
│  Category: Fake News            │
│  Confidence: High               │
│  ─────────────────────────────  │
│  Explanation:                   │
│  This claim contradicts...      │
│  ─────────────────────────────  │
│  Key Findings:                  │
│  • Finding 1                    │
│  • Finding 2                    │
│  ─────────────────────────────  │
│  Recommendation: Do not share   │
│  Sources: [Link 1] [Link 2]     │
└─────────────────────────────────┘
```

#### 2. Analysis Progress
```
Submission received ✓
Extracting content ✓
Analyzing text...
Checking images
Verifying sources
```

#### 3. Misinformation Severity Indicator
- [ ] 0-30%: Green (Likely accurate)
- [ ] 30-70%: Orange (Potentially misleading)
- [ ] 70-100%: Red (Likely false)

#### 4. Evidence Display
- [ ] Show supporting sources
- [ ] Link to fact-checks
- [ ] Display similar articles
- [ ] Show verification history

---

## Phase 5: Admin & Moderation Features

### Backend Endpoints Ready
```
GET    /admin/dashboard/           - Statistics
GET    /admin/reports/             - List reports
POST   /admin/reports/assign/      - Assign report
GET    /admin/moderation-queue/    - Queue items
POST   /admin/bans/                - Ban user
```

### Frontend Implementation Checklist

#### 1. Admin Dashboard
- [ ] Create dashboard page (admin-only)
- [ ] Display total submissions
- [ ] Show pending reports
- [ ] Display moderation queue size
- [ ] Show average misinformation score
- [ ] Display active users
- [ ] Chart: submissions by type
- [ ] Chart: submissions by status

#### 2. Moderation Queue
- [ ] List pending submissions
- [ ] Sort by priority (high/medium/low)
- [ ] Filter by type
- [ ] Show submission details
- [ ] Action buttons: approve, reject, flag
- [ ] Add notes/comments
- [ ] Mark as reviewed
- [ ] Assign to moderator

#### 3. Content Reporting
- [ ] Display user reports
- [ ] Show report status
- [ ] Assign to admin
- [ ] Add resolution notes
- [ ] Mark as resolved
- [ ] View reported content
- [ ] Take action (flag, ban user, etc.)

#### 4. User Management
- [ ] List users with filtering
- [ ] View user profile
- [ ] Ban user (temporary/permanent)
- [ ] View user activity history
- [ ] See user submissions
- [ ] Reset user password
- [ ] Change user role

**Test Cases:**
```typescript
// View dashboard as admin → Statistics displayed
// View dashboard as regular user → Redirect to dashboard
// Approve submission → Status updated, user notified
// Ban user → User cannot login
// Unban user → User can login again
```

---

## Phase 6: Analytics & Reporting

### Backend Endpoints Ready
```
GET    /analytics/overview/        - Statistics
GET    /analytics/trends/          - Trend data
GET    /analytics/top-content/     - Top submissions
POST   /reports/generate-daily/    - Generate report
```

### Frontend Implementation Checklist

#### 1. Analytics Dashboard
- [ ] Create analytics page
- [ ] Display total submissions
- [ ] Show submissions by category
- [ ] Display submissions by language
- [ ] Show average misinformation score
- [ ] Display analysis times
- [ ] Show error rates

#### 2. Trend Analysis
- [ ] Chart: misinformation by category over time
- [ ] Chart: submissions by date
- [ ] Chart: accuracy by source
- [ ] Filter by date range
- [ ] Filter by category
- [ ] Show peak times

#### 3. Report Generation
- [ ] Create daily report
- [ ] Create weekly report
- [ ] Create custom report
- [ ] Choose date range
- [ ] Select metrics
- [ ] Export as PDF
- [ ] Export as CSV
- [ ] Email report

#### 4. Statistics Display
- [ ] Total submissions analyzed
- [ ] Breakdown by type (text, image, video, audio, link)
- [ ] Breakdown by status
- [ ] Average analysis time
- [ ] Top categories
- [ ] Top sources

**Test Cases:**
```typescript
// View analytics for last 7 days → Data displayed
// Generate daily report → Report created
// Export as CSV → File downloaded
// View trends by category → Chart displayed
// Custom date range → Data filtered correctly
```

---

## Phase 7: Error Handling & UX

### Error Messages to Implement
- [ ] Network timeout (> 30 seconds)
- [ ] 400: Validation errors - show field errors
- [ ] 401: Unauthorized - redirect to login
- [ ] 403: Forbidden - show permission error
- [ ] 404: Not found - show 404 page
- [ ] 429: Rate limited - show retry message
- [ ] 500: Server error - show generic message
- [ ] Connection lost - show offline mode

### User Experience
- [ ] Loading indicators for async operations
- [ ] Success messages for completed actions
- [ ] Error notifications with details
- [ ] Confirmation dialogs for destructive actions
- [ ] Form validation feedback
- [ ] File upload progress
- [ ] Retry logic for failed requests
- [ ] Skeleton loaders while fetching

### Accessibility
- [ ] ARIA labels on form fields
- [ ] Keyboard navigation support
- [ ] Color contrast (WCAG AA)
- [ ] Focus indicators
- [ ] Error announcements
- [ ] Loading announcements
- [ ] Alt text for images

---

## Phase 8: Testing & Verification

### Integration Tests
```typescript
// Test signup to dashboard flow
// Test submission creation to results display
// Test admin operations
// Test multi-language support
// Test file uploads
// Test token refresh
// Test error handling
// Test offline mode
```

### Load Testing
- [ ] Test with 10 concurrent users
- [ ] Test with 100 concurrent users
- [ ] Test with large file uploads
- [ ] Test with slow network
- [ ] Test mobile responsiveness

### Security Testing
- [ ] XSS prevention
- [ ] CSRF token validation
- [ ] SQL injection (via backend)
- [ ] Token security
- [ ] Input validation
- [ ] HTTPS requirement
- [ ] Secure headers

---

## Phase 9: Deployment Preparation

### Frontend .env Configuration
```env
# API
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_BETA_FEATURES=false

# Logging
VITE_LOG_LEVEL=info
VITE_SENTRY_DSN=https://...

# File upload
VITE_MAX_FILE_SIZE=104857600  # 100MB
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,video/mp4,audio/mpeg
```

### Pre-Deployment Checklist
- [ ] All API endpoints tested
- [ ] Error handling verified
- [ ] Loading states working
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Accessibility tested
- [ ] Security tested
- [ ] Cross-browser tested

### Deployment
- [ ] Build frontend: `npm run build`
- [ ] Test build locally: `npm run preview`
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production

---

## Troubleshooting Guide

### CORS Errors
```javascript
// Error: Access to XMLHttpRequest blocked by CORS
// Solution: Update CORS_ALLOWED_ORIGINS in backend settings
// and verify frontend URL is whitelisted
```

### 401 Unauthorized
```javascript
// Error: 401 Unauthorized
// Solutions:
// 1. Check if token is being sent
// 2. Verify token hasn't expired
// 3. Refresh token
// 4. Re-login
```

### 404 Not Found
```javascript
// Error: 404 Not Found
// Solutions:
// 1. Verify endpoint path is correct
// 2. Check API version (/api/v1/)
// 3. Verify resource exists
// 4. Check recent API changes
```

### Timeout
```javascript
// Error: Request timeout
// Solutions:
// 1. Increase timeout setting
// 2. Check network connectivity
// 3. Verify backend is running
// 4. Check for slow database queries
```

---

## Communication

### Daily Standup Points
- [ ] Backend team: Services running, no issues
- [ ] Frontend team: API integration progress
- [ ] Any blocking issues
- [ ] Planned work for next day

### Issues Tracking
- Use GitHub Issues for bugs
- Tag with `frontend`, `backend`, `integration`
- Include error logs and screenshots
- Link related issues

### Code Review
- [ ] Frontend PR: Check API usage patterns
- [ ] Backend PR: Check response format compliance
- [ ] Integration tests: Verify both sides work together

---

## Success Criteria

✅ **Phase Complete When:**
1. All API endpoints accessible
2. Authentication flow working
3. File uploads working
4. Results displaying correctly
5. Admin features functional
6. Analytics dashboard complete
7. Error handling tested
8. Performance acceptable
9. Mobile responsive
10. Security verified

---

## Resources

- **Integration Guide**: INTEGRATION.md
- **API Docs**: http://localhost:8000/api/docs/
- **Code Examples**: INTEGRATION.md (Component Examples section)
- **GitHub Issues**: Report bugs with `frontend` label
- **Daily Standup**: Team Slack/Discord

---

**Next Steps:**
1. Review this checklist with both teams
2. Assign tasks by phase
3. Start Phase 1: Backend Setup
4. Daily progress tracking
5. Weekly integration review

**Estimated Timeline**: 3-4 weeks for full integration

Good luck! 🎉
