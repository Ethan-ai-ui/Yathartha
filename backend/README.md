# SatyaCheck Backend - Nepali Misinformation Detection Platform

## Overview

SatyaCheck is a comprehensive backend system for detecting and verifying misinformation in Nepali content. Built with Django 6, PostgreSQL, and advanced AI/ML capabilities, it provides a complete platform for citizens, journalists, and NGOs to submit and verify content.

## Features

### 1. User Management & Authentication
- JWT-based authentication with refresh tokens
- User roles: Citizen, Journalist, NGO, Admin
- Email-based OTP verification
- Two-factor authentication support
- Activity logging and audit trails

### 2. Content Submission
- Support for multiple submission types: Text, Image, Video, Audio, Links
- Metadata capture: language, location, tags
- Anonymous submission support
- Secure file storage with size limits
- Multi-language support (Nepali, English, Hindi)

### 3. AI-Powered Verification
- **Text Analysis**: Fake news, propaganda, spam, satire detection
- **Image Analysis**: Deepfake and manipulation detection
- **Video Analysis**: Frame-level deepfake detection, audio-video consistency checks
- **Audio Analysis**: Synthetic speech detection
- **Link Analysis**: Web scraping, content extraction, source credibility analysis
- Real-time scoring (0-100% misinformation probability)
- Multi-language explanations

### 4. Content Verification Results
- Comprehensive verification reports with:
  - Misinformation score and confidence level
  - Category classification
  - Key findings and supporting evidence
  - Fact-checking sources
  - Similar articles/references
  - Risk level assessment

### 5. Web Scraping & Source Verification
- Automatic content extraction from URLs
- Trusted source database (news outlets, government sites)
- Source credibility scoring
- Cross-reference with fact-checking databases

### 6. Admin & Moderator Features
- Moderation queue with priority levels
- Content flagging and approval workflow
- User management and banning
- Admin reports and statistics
- Bulk submission actions

### 7. Analytics & Reporting
- Real-time submission statistics
- Misinformation trends tracking
- Top flagged/verified content
- User activity analytics
- Report generation (CSV, JSON export)
- Daily/weekly/monthly reports

### 8. Security & Compliance
- CORS protection
- Rate limiting (100 req/hour anonymous, 1000 req/hour authenticated)
- Input validation and sanitization
- Secure password hashing (bcrypt)
- Audit logging for all actions
- Admin action tracking

## Project Structure

```
backend/
├── manage.py                           # Django management script
├── requirements.txt                    # Python dependencies
├── .env.example                        # Environment variables template
├── README.md                           # This file
│
├── satyacheck/                         # Main Django project
│   ├── __init__.py
│   ├── celery.py                       # Celery configuration
│   │
│   ├── core/                           # Core configuration
│   │   ├── settings.py                 # Django settings
│   │   ├── urls.py                     # URL routing
│   │   ├── wsgi.py                     # WSGI application
│   │   ├── asgi.py                     # ASGI application
│   │   ├── middleware.py               # Custom middleware
│   │   └── views.py                    # Error views
│   │
│   ├── apps/                           # Django applications
│   │   ├── users/                      # User authentication
│   │   │   ├── models.py               # User, OTP, Activity models
│   │   │   ├── views.py                # Auth endpoints
│   │   │   ├── serializers.py          # DRF serializers
│   │   │   ├── urls.py                 # API routes
│   │   │   └── admin.py                # Admin interface
│   │   │
│   │   ├── submissions/                # Content submissions
│   │   │   ├── models.py               # Submission, VerificationResult models
│   │   │   ├── views.py                # Submission endpoints
│   │   │   ├── serializers.py          # DRF serializers
│   │   │   ├── urls.py                 # API routes
│   │   │   └── admin.py                # Admin interface
│   │   │
│   │   ├── ai/                         # AI verification engine
│   │   │   ├── models.py               # AIModel configuration
│   │   │   ├── views.py                # Analysis endpoints
│   │   │   ├── serializers.py          # DRF serializers
│   │   │   ├── tasks.py                # Celery async tasks
│   │   │   ├── urls.py                 # API routes
│   │   │   └── admin.py                # Admin interface
│   │   │
│   │   ├── admin_panel/                # Admin dashboard
│   │   │   ├── models.py               # Report, Ban, Queue models
│   │   │   ├── views.py                # Admin endpoints
│   │   │   ├── serializers.py          # DRF serializers
│   │   │   ├── urls.py                 # API routes
│   │   │   └── admin.py                # Admin interface
│   │   │
│   │   ├── reporting/                  # Analytics & reporting
│   │   │   ├── models.py               # Report, Trend models
│   │   │   ├── views.py                # Analytics endpoints
│   │   │   ├── serializers.py          # DRF serializers
│   │   │   ├── urls.py                 # API routes
│   │   │   └── admin.py                # Admin interface
│   │   │
│   │   └── common/                     # Common utilities
│   │       └── __init__.py
│   │
│   ├── services/                       # Business logic services
│   │   ├── ai_service.py               # AI model and analysis
│   │   └── web_scraper.py              # Web scraping utilities
│   │
│   └── utils/                          # Helper utilities
│       └── helpers.py                  # Common functions
│
├── media/                              # Uploaded files
├── logs/                               # Application logs
│
└── scripts/                            # Utility scripts
    ├── setup.py                        # Initial setup
    ├── create_superuser.py             # Create admin user
    └── populate_sources.py             # Populate trusted sources
```

## Installation & Setup

### Prerequisites

- Python 3.10+
- PostgreSQL 12+
- Redis 6+
- Git

### 1. Clone and Setup Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Required variables:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=satyacheck
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_EXPIRATION_HOURS=24

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### 3. Setup PostgreSQL Database

```bash
# Create database and user
psql -U postgres

psql=> CREATE DATABASE satyacheck;
psql=> CREATE USER satyacheck_user WITH PASSWORD 'your_password';
psql=> ALTER ROLE satyacheck_user SET client_encoding TO 'utf8';
psql=> ALTER ROLE satyacheck_user SET default_transaction_isolation TO 'read committed';
psql=> ALTER ROLE satyacheck_user SET default_transaction_deferrable TO on;
psql=> ALTER ROLE satyacheck_user SET timezone TO 'UTC';
psql=> GRANT ALL PRIVILEGES ON DATABASE satyacheck TO satyacheck_user;
psql=> \q
```

### 4. Run Migrations

```bash
# Apply database migrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser

# Load initial data (optional)
python manage.py loaddata initial_data
```

### 5. Create Trusted Sources

```bash
python manage.py shell

# From Django shell:
from satyacheck.apps.submissions.models import SourceDatabase

# Add trusted sources
sources = [
    {
        'name': 'BBC',
        'url': 'https://www.bbc.com',
        'source_type': 'news',
        'country': 'int',
        'credibility_score': 85,
        'language': 'en',
    },
    {
        'name': 'Setopati',
        'url': 'https://www.setopati.com',
        'source_type': 'news',
        'country': 'np',
        'credibility_score': 75,
        'language': 'ne',
    },
]

for source in sources:
    SourceDatabase.objects.create(**source)
```

### 6. Run Development Server

```bash
# Start Django development server
python manage.py runserver

# Start Celery worker (in a new terminal)
celery -A satyacheck worker -l info

# Start Celery beat (for scheduled tasks)
celery -A satyacheck beat -l info
```

The API will be available at: `http://localhost:8000/api/v1/`

## API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/v1/auth/signup/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "citizen"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully.",
  "user": { ... },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful.",
  "user": { ... },
  "tokens": { ... }
}
```

#### Get Profile
```http
GET /api/v1/auth/profile/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "citizen",
    "is_verified": false,
    "submission_count": 0,
    ...
  }
}
```

### Submission Endpoints

#### Create Submission
```http
POST /api/v1/submissions/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "News Article Title",
  "description": "Detailed description",
  "submission_type": "text",
  "text_content": "The full text content here...",
  "language": "en",
  "location": "Kathmandu",
  "tags": ["news", "politics"],
  "is_anonymous": false
}

Response: 201 Created
{
  "id": "uuid",
  "title": "News Article Title",
  "status": "analyzing",
  "created_at": "2024-01-10T12:34:56Z",
  ...
}
```

#### Get Submission
```http
GET /api/v1/submissions/<id>/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": "uuid",
  "title": "News Article Title",
  "status": "completed",
  "verification_result": {
    "misinformation_score": 65.5,
    "primary_category": "misleading",
    "explanation": "...",
    ...
  },
  ...
}
```

#### Get Verification Results
```http
GET /api/v1/submissions/<id>/results/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": "uuid",
  "misinformation_score": 65.5,
  "confidence_level": "high",
  "primary_category": "misleading",
  "explanation": "Analysis suggests this content may contain misleading information...",
  "key_findings": ["Finding 1", "Finding 2"],
  "supporting_evidence": ["https://fact-check.example.com/..."],
  ...
}
```

### AI Analysis Endpoints

#### Test Text Analysis
```http
POST /api/v1/ai/test/test_text_analysis/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "The text to analyze",
  "language": "en"
}

Response: 200 OK
{
  "score": 45.2,
  "confidence": "medium",
  "category": "misleading",
  "explanation": "...",
  "component_scores": {
    "sentiment": 40,
    "keywords": 50,
    "length": 30,
    "urgency": 45
  }
}
```

#### Test URL Analysis
```http
POST /api/v1/ai/test/test_url_analysis/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "url": "https://example.com/article"
}

Response: 200 OK
{
  "scraped_content": {
    "title": "Article Title",
    "description": "...",
    "authors": ["Author Name"],
    "language": "en",
    "links_count": 5
  },
  "analysis": {
    "score": 45.2,
    "confidence": "medium",
    "category": "other",
    "explanation": "..."
  }
}
```

### Admin Endpoints

#### Get Dashboard
```http
GET /api/v1/admin/dashboard/dashboard/
Authorization: Bearer <admin_token>

Response: 200 OK
{
  "total_submissions": 1250,
  "total_users": 450,
  "open_reports": 12,
  "moderation_queue": 5,
  "recent_submissions_7_days": 145,
  "average_misinformation_score": 52.3,
  "submissions_by_type": {
    "text": 450,
    "image": 300,
    "video": 200,
    ...
  },
  "submissions_by_status": {
    "completed": 800,
    "pending": 250,
    ...
  }
}
```

#### Get Moderation Queue
```http
GET /api/v1/admin/moderation/?priority=high
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": "uuid",
    "submission": { ... },
    "priority": "high",
    "reason": "User reported as potential fake news",
    "assigned_to": null,
    "created_at": "2024-01-10T12:34:56Z"
  },
  ...
]
```

### Reporting Endpoints

#### Get Analytics Overview
```http
GET /api/v1/reports/analytics/overview/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "total_submissions": 1250,
  "total_verified": 950,
  "total_flagged": 120,
  "by_type": { "text": 450, "image": 300, ... },
  "by_status": { "completed": 800, ... },
  "by_language": { "en": 600, "ne": 400, ... }
}
```

#### Generate Daily Report
```http
POST /api/v1/reports/reports/generate_daily/
Authorization: Bearer <admin_token>

Response: 201 Created
{
  "id": "uuid",
  "title": "Daily Report",
  "report_type": "daily",
  "data": { ... },
  "created_at": "2024-01-10T12:34:56Z"
}
```

## Database Models

### Users App
- **User**: Custom user model with roles and verification status
- **OTPVerification**: Email/SMS OTP for 2FA and password reset
- **UserActivity**: Audit log of user actions

### Submissions App
- **Submission**: User-submitted content
- **VerificationResult**: AI analysis results
- **VerificationHistory**: Track historical analyses
- **SourceDatabase**: Trusted news sources
- **ScrapedContent**: Web-scraped content from URLs

### AI App
- **AIModel**: Registry of available AI models
- **ModelConfiguration**: Configuration for each model

### Admin Panel App
- **AdminReport**: Reports created by admins
- **ModerationQueue**: Submissions waiting for moderation
- **UserBan**: Banned users

### Reporting App
- **Report**: Generated reports/statistics
- **MisinformationTrend**: Trends in misinformation
- **TopContent**: Most flagged/verified content
- **UserStatistic**: User activity statistics

## Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test satyacheck.apps.users

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

## Deployment

### Using Gunicorn + Nginx

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn satyacheck.core.wsgi:application --bind 0.0.0.0:8000 --workers 4

# Configure Nginx as reverse proxy
# See deployment/nginx.conf
```

### Using Docker

```bash
# Build image
docker build -t satyacheck-backend .

# Run container
docker run -p 8000:8000 --env-file .env satyacheck-backend
```

### Production Checklist

- [ ] Set DEBUG=False in .env
- [ ] Update SECRET_KEY and JWT_SECRET_KEY
- [ ] Configure allowed hosts
- [ ] Set up HTTPS/SSL
- [ ] Configure email service for OTP/notifications
- [ ] Set up database backups
- [ ] Configure Redis for caching
- [ ] Set up Celery workers
- [ ] Configure logging
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Review security settings
- [ ] Load initial data (trusted sources, etc.)

## Common Issues & Troubleshooting

### Database Connection Error
```
Error: could not connect to server: Connection refused

Solution:
- Ensure PostgreSQL is running
- Check DB credentials in .env
- Verify DB_HOST and DB_PORT
```

### AI Model Loading Error
```
Error: Failed to load classifier model

Solution:
- Check internet connection (models download from Hugging Face)
- Try reducing model size (use distilbert instead of bert)
- Check available disk space
```

### Port Already in Use
```
Solution:
# Change port
python manage.py runserver 8001
```

### Redis Connection Error
```
Solution:
- Ensure Redis is running: redis-cli ping
- Check REDIS_URL in .env
- Default: redis://localhost:6379/0
```

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/new-feature`
4. Submit pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please:
- Create an issue on GitHub
- Contact the development team
- Check existing documentation

## Security

If you discover a security vulnerability, please email security@satyacheck.com instead of using the issue tracker.

## Acknowledgments

- Built with Django and Django REST Framework
- AI models from Hugging Face Transformers
- Inspired by fact-checking platforms like Snopes and FactCheck.org

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready
