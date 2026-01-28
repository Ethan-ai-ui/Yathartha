# SatyaCheck Backend - Deployment & Operations Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Checklist](#production-checklist)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Python 3.10+
- PostgreSQL 12+
- Redis 5+
- Git

### Quick Setup

```bash
# Clone repository
git clone https://github.com/yourusername/satyacheck-backend.git
cd satyacheck-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run setup
python scripts/setup.py

# Run development server in separate terminals:

# Terminal 1: Django
python manage.py runserver

# Terminal 2: Celery worker
celery -A satyacheck worker -l info

# Terminal 3: Celery Beat
celery -A satyacheck beat -l info

# Terminal 4: Redis (if not already running)
redis-server
```

### Accessing the Application
- API: http://localhost:8000/api/v1/
- Admin Panel: http://localhost:8000/admin/
- API Schema: http://localhost:8000/api/schema/

### Database Setup Manually

```bash
# Create PostgreSQL database
createdb satyacheck
createuser satyacheck_user
# Run migrations
python manage.py migrate
# Create superuser
python manage.py createsuperuser
```

---

## Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Create initial data
docker-compose exec backend python manage.py migrate
docker-compose exec backend python scripts/setup.py

# Check status
docker-compose ps
```

### Services
- **backend**: Django application (port 8000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)
- **celery**: Async task worker
- **celery_beat**: Scheduled task scheduler

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f celery
```

### Stop Services

```bash
docker-compose down
```

### Production Compose

For production, update environment variables in `docker-compose.yml`:

```yaml
environment:
  DEBUG: 'False'
  SECRET_KEY: 'your-long-random-secret'
  DB_PASSWORD: 'strong-password'
  ALLOWED_HOSTS: 'yourdomain.com,www.yourdomain.com'
```

---

## Cloud Deployment

### AWS EC2 + RDS + ElastiCache

#### 1. Launch EC2 Instance
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update and install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3.10 python3.10-venv python3-pip \
    postgresql-client git nginx supervisor

# Clone repository
git clone https://github.com/yourusername/satyacheck-backend.git
cd satyacheck-backend
```

#### 2. Setup Application
```bash
# Create virtual environment
python3.10 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Configure environment
nano .env
# Set:
# DB_HOST=your-rds-endpoint
# REDIS_URL=redis://your-elasticache-endpoint:6379/0
# ALLOWED_HOSTS=yourdomain.com
# DEBUG=False
```

#### 3. Setup Gunicorn with Supervisor
```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/satyacheck.conf
```

```ini
[program:satyacheck]
directory=/home/ubuntu/satyacheck-backend
command=/home/ubuntu/satyacheck-backend/venv/bin/gunicorn \
    --workers=4 \
    --worker-class=gthread \
    --threads=2 \
    --bind=127.0.0.1:8000 \
    satyacheck.core.wsgi:application
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/satyacheck/gunicorn.log

[program:satyacheck_celery]
directory=/home/ubuntu/satyacheck-backend
command=/home/ubuntu/satyacheck-backend/venv/bin/celery -A satyacheck worker -l info
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/satyacheck/celery.log

[program:satyacheck_beat]
directory=/home/ubuntu/satyacheck-backend
command=/home/ubuntu/satyacheck-backend/venv/bin/celery -A satyacheck beat -l info
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/satyacheck/beat.log
```

```bash
# Create log directory
sudo mkdir -p /var/log/satyacheck
sudo chown ubuntu:ubuntu /var/log/satyacheck

# Start supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

#### 4. Setup Nginx Reverse Proxy
```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/satyacheck
sudo ln -s /etc/nginx/sites-available/satyacheck /etc/nginx/sites-enabled/

# Test and enable
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### 6. Run Migrations
```bash
source venv/bin/activate
python manage.py migrate
python scripts/setup.py
```

### Heroku Deployment

#### 1. Create `Procfile`
```
web: gunicorn satyacheck.core.wsgi
worker: celery -A satyacheck worker -l info
beat: celery -A satyacheck beat -l info
```

#### 2. Deploy
```bash
# Create app
heroku create satyacheck-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set ALLOWED_HOSTS=satyacheck-api.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Start worker and beat
heroku ps:scale worker=1 beat=1
```

### DigitalOcean App Platform

1. Create a new App
2. Connect GitHub repository
3. Set environment variables in App Spec:
```yaml
env:
  - key: DEBUG
    value: "False"
  - key: SECRET_KEY
    value: ${SECRET_KEY}
  - key: DB_HOST
    value: ${db.hostname}
  - key: DB_NAME
    value: ${db.database}
  - key: DB_USER
    value: ${db.username}
  - key: DB_PASSWORD
    value: ${db.password}
  - key: REDIS_URL
    value: ${redis.connection_string}
```

---

## Production Checklist

### Security
- [ ] Change SECRET_KEY to a random 50+ character string
- [ ] Set DEBUG=False
- [ ] Enable HTTPS/SSL
- [ ] Set ALLOWED_HOSTS correctly
- [ ] Configure SECURE_SSL_REDIRECT = True
- [ ] Set SECURE_BROWSER_XSS_FILTER = True
- [ ] Configure Content Security Policy
- [ ] Enable CORS for only your frontend domain
- [ ] Implement rate limiting
- [ ] Setup Web Application Firewall (AWS WAF, Cloudflare)

### Database
- [ ] Regular automated backups (daily)
- [ ] Enable point-in-time recovery
- [ ] Use strong passwords for DB users
- [ ] Enable SSL for DB connections
- [ ] Create read replicas for scaling
- [ ] Monitor query performance
- [ ] Setup connection pooling

### Monitoring
- [ ] Setup Sentry for error tracking
- [ ] Configure CloudWatch/DataDog for logs
- [ ] Setup uptime monitoring
- [ ] Create alerts for error rates
- [ ] Monitor disk space usage
- [ ] Setup performance monitoring
- [ ] Create dashboards for KPIs

### Application
- [ ] Run database migrations
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Setup email notifications
- [ ] Configure logging to persistent storage
- [ ] Test all critical workflows
- [ ] Setup automated tests in CI/CD
- [ ] Document deployment process
- [ ] Create runbooks for common issues

### Infrastructure
- [ ] Setup load balancer
- [ ] Configure auto-scaling
- [ ] Enable health checks
- [ ] Setup CDN for static files
- [ ] Configure backups
- [ ] Setup DDoS protection
- [ ] Document architecture
- [ ] Setup VPN for database access

---

## Monitoring & Logging

### Application Logging

```python
# Configure in settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/errors.log',
            'maxBytes': 1024 * 1024 * 10,  # 10MB
            'backupCount': 5,
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'ERROR',
    },
}
```

### Monitoring with Sentry

```python
# Install
pip install sentry-sdk

# Configure in settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project-id",
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=False
)
```

### Celery Monitoring with Flower

```bash
pip install flower
celery -A satyacheck events -l info --logfile=logs/flower.log &
flower -A satyacheck --port=5555
# Access: http://localhost:5555
```

### Health Checks

```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:8000/api/v1/health/ || alert_on_failure
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: could not translate host name "localhost" to address
```

Solution:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U satyacheck_user -d satyacheck

# Verify .env
cat .env | grep DB_
```

#### 2. Celery Not Processing Tasks
```bash
# Check Redis connection
redis-cli ping

# Check Celery worker
celery -A satyacheck worker -l debug

# Check Celery status
celery -A satyacheck inspect active_queues
```

#### 3. Static Files Not Loading
```bash
# Collect static files
python manage.py collectstatic --clear --noinput

# Check permissions
ls -la staticfiles/
sudo chown -R www-data:www-data staticfiles/
```

#### 4. Out of Memory Issues
```bash
# Check memory usage
free -h

# Limit Celery workers
celery -A satyacheck worker -l info -c 2

# Configure in docker-compose.yml
environment:
  - CFLAGS=-O0
```

#### 5. High CPU Usage
```bash
# Profile tasks
celery -A satyacheck worker -l info --pool=solo

# Check for long-running tasks
celery -A satyacheck inspect active
```

### Debug Commands

```bash
# Check Django setup
python manage.py shell
>>> from django.conf import settings
>>> settings.INSTALLED_APPS

# Check database connection
python manage.py dbshell

# Run tests
python manage.py test

# Check email configuration
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Test', 'Test message', 'from@example.com', ['to@example.com'])

# Flush database (DANGEROUS - development only)
python manage.py flush --no-input
```

---

## Performance Optimization

### Database Optimization

```bash
# Analyze slow queries
python manage.py shell
>>> from django.db import connection
>>> from django.test.utils import CaptureQueriesContext
>>> with CaptureQueriesContext(connection) as ctx:
...     # run your code
>>> for query in ctx.captured_queries:
...     print(query['time'], query['sql'])
```

### Caching Strategy

```python
# Cache API responses (settings.py)
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}

# Cache ORM queries
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # 5 minutes
def my_view(request):
    pass
```

### Async Processing

```python
# Move heavy operations to Celery
from celery import shared_task

@shared_task
def analyze_submission_async(submission_id):
    # Heavy processing
    pass
```

---

## Backup & Recovery

### Automated Backups

```bash
# Backup database daily
0 2 * * * pg_dump satyacheck > /backups/satyacheck_$(date +\%Y\%m\%d).sql

# Backup Redis
0 3 * * * redis-cli BGSAVE /backups/redis_$(date +\%Y\%m\%d).rdb
```

### Restore Database

```bash
# From backup
psql satyacheck < /backups/satyacheck_20240101.sql

# From S3
aws s3 cp s3://my-bucket/satyacheck_backup.sql . && \
psql satyacheck < satyacheck_backup.sql
```

---

## Support & Resources

- Documentation: https://docs.satyacheck.com
- API Reference: https://api.satyacheck.com/docs
- Issue Tracker: https://github.com/yourusername/satyacheck-backend/issues
- Slack Community: https://satyacheck.slack.com
