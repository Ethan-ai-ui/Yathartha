# 🚀 Production Deployment Checklist

## Pre-Deployment Setup (24-48 hours before)

### Security Configuration
- [ ] Generate strong `SECRET_KEY` (use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- [ ] Generate strong `JWT_SECRET_KEY` (minimum 32 characters)
- [ ] Set `DEBUG=False` in production
- [ ] Enable `SECURE_SSL_REDIRECT=True`
- [ ] Configure `ALLOWED_HOSTS` correctly (your domain)
- [ ] Set `SECURE_BROWSER_XSS_FILTER=True`
- [ ] Configure `SECURE_HSTS_SECONDS=31536000`
- [ ] Setup CORS to only allow frontend domain
- [ ] Rotate all API keys and credentials

### Database & Cache
- [ ] Create PostgreSQL database and user
- [ ] Set strong database password
- [ ] Enable database backups (daily minimum)
- [ ] Test database connection from server
- [ ] Setup Redis with password (if needed)
- [ ] Test Redis connection
- [ ] Create database indexes (covered by migrations)
- [ ] Run migrations: `python manage.py migrate`

### External Services
- [ ] Setup email service (Gmail SMTP or SendGrid)
  - [ ] Get SMTP credentials
  - [ ] Test email sending
  - [ ] Configure email templates
  
- [ ] Setup SMS service (Twilio or similar)
  - [ ] Get API credentials
  - [ ] Test SMS sending
  - [ ] Configure message templates
  
- [ ] Setup error tracking (Sentry)
  - [ ] Create account and project
  - [ ] Get DSN
  - [ ] Configure error alerts
  
- [ ] Setup logging and monitoring
  - [ ] Configure CloudWatch or DataDog
  - [ ] Setup dashboard
  - [ ] Configure alerts

### Code & Files
- [ ] Run all tests: `python manage.py test`
- [ ] Check code quality: `python -m flake8 satyacheck/`
- [ ] Collect static files: `python manage.py collectstatic`
- [ ] Verify all migrations are applied
- [ ] Review DEBUG logs are disabled
- [ ] Remove any test/dummy data
- [ ] Verify all settings are environment-based

---

## Deployment Day Checklist

### 30 Minutes Before
- [ ] Notify team of deployment
- [ ] Have rollback plan ready
- [ ] Backup production database
- [ ] Verify all services are healthy
- [ ] Confirm downtime window with stakeholders

### Deployment (Docker)
```bash
# Pull latest code
git pull origin main

# Build Docker image
docker build -t satyacheck:latest .

# Push to registry (if using)
docker push your-registry/satyacheck:latest

# Pull on production server
docker pull your-registry/satyacheck:latest

# Stop existing containers
docker-compose down

# Start new containers
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser if needed
docker-compose exec backend python manage.py createsuperuser

# Check logs
docker-compose logs -f
```

### Deployment (Traditional Server)
```bash
# SSH into server
ssh -i your-key.pem user@server-ip

# Navigate to project
cd /var/www/satyacheck-backend

# Pull latest code
git pull origin main

# Activate venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Restart services
sudo supervisorctl restart satyacheck:*
sudo supervisorctl restart satyacheck_celery
sudo supervisorctl restart satyacheck_beat

# Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Post-Deployment Verification
- [ ] Check website is accessible: https://yourdomain.com
- [ ] Test API endpoint: https://yourdomain.com/api/v1/auth/profile/
- [ ] Check admin panel: https://yourdomain.com/admin/
- [ ] Verify logs show no errors
- [ ] Test user registration/login
- [ ] Test submission creation
- [ ] Test file uploads
- [ ] Monitor error tracking (Sentry)
- [ ] Check database health

### Monitoring (First 24 Hours)
- [ ] Monitor error rates in Sentry
- [ ] Monitor API response times
- [ ] Monitor server CPU/Memory usage
- [ ] Monitor database connection pool
- [ ] Monitor Redis memory usage
- [ ] Monitor Celery task queue
- [ ] Check for failed jobs
- [ ] Review user feedback

---

## Performance Tuning

### Django Settings
```python
# Increase worker count
WSGI_WORKERS = 8  # 2 * CPU_CORES

# Configure database connection pooling
DATABASES = {
    'default': {
        ...
        'CONN_MAX_AGE': 600,  # 10 minutes
        'OPTIONS': {
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000'  # 30 seconds
        }
    }
}

# Optimize caching
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
            'COMPRESSOR': 'django_redis.compressors.zlib.ZlibCompressor',
        }
    }
}

# Optimize pagination
REST_FRAMEWORK['PAGE_SIZE'] = 20  # Lower on slow connections
```

### Gunicorn Configuration
```bash
# gunicorn_config.py
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gthread"
threads = 2
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
```

### Nginx Optimization
```nginx
# Enable compression
gzip on;
gzip_vary on;
gzip_types text/plain text/css text/xml text/javascript 
    application/x-javascript application/xml+rss;
gzip_comp_level 6;

# Enable caching
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=backend:10m;
proxy_cache_valid 200 1h;
proxy_cache_use_stale error timeout invalid_header updating;

# Connection pooling
upstream django {
    keepalive 32;
    server backend:8000;
}
```

### Database Optimization
```sql
-- Analyze tables
ANALYZE;

-- Check missing indexes
SELECT schemaname, tablename FROM pg_tables 
WHERE schemaname = 'public';

-- Monitor slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();
```

---

## Scaling Strategy

### Horizontal Scaling (Multiple Servers)

1. **Load Balancer** (AWS ELB, Nginx, HAProxy)
   - Distributes traffic across multiple API servers
   - Health checks every 5 seconds
   - Sticky sessions (if needed)

2. **API Servers** (Multiple instances)
   - Stateless Django instances
   - Auto-scaling group (scale based on CPU/Memory)
   - Min: 2, Max: 10, Target: 70% CPU

3. **Shared Database** (RDS)
   - PostgreSQL with read replicas
   - Auto-scaling storage
   - Automated backups
   - Multi-AZ for high availability

4. **Shared Cache** (ElastiCache)
   - Redis cluster for high availability
   - Auto-failover
   - Persistence enabled

5. **Celery Workers** (Separate instances)
   - Scale independently based on queue depth
   - Auto-scaling based on pending tasks
   - Min: 1, Max: 5

### Vertical Scaling (Larger Server)
- Increase CPU cores
- Increase RAM
- Use faster SSD storage
- Upgrade database instance type

---

## Disaster Recovery

### Backup Strategy
```bash
# Daily automated backups
0 2 * * * pg_dump satyacheck | gzip > /backups/satyacheck_$(date +\%Y\%m\%d).sql.gz

# Weekly offsite backups
0 3 * * 0 aws s3 cp /backups/satyacheck_*.sql.gz s3://my-backups/

# Keep last 30 days locally, 1 year in S3
find /backups -name "satyacheck_*.sql.gz" -mtime +30 -delete
```

### Restore Procedure
```bash
# Restore from latest backup
gunzip < /backups/satyacheck_latest.sql.gz | psql satyacheck

# Verify restore
psql satyacheck -c "SELECT COUNT(*) FROM users_user;"

# Verify application
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> get_user_model().objects.count()
```

### Data Consistency
- Use database transactions
- Enable integrity constraints
- Regular data validation checks
- Audit logging on critical operations

---

## Monitoring & Alerting

### Metrics to Monitor
- API response time (p50, p95, p99)
- Error rate (5xx, 4xx, timeouts)
- Database query time
- Celery task queue depth
- Server CPU usage
- Server memory usage
- Disk space usage
- Network I/O

### Alerts to Setup
```yaml
Alerts:
  - API Error Rate > 5% → Page on-call
  - API Response Time p95 > 1s → Warning
  - Database Connection Pool > 80% → Warning
  - Server Disk Space > 85% → Warning
  - Celery Queue > 1000 tasks → Warning
  - Redis Memory > 80% → Warning
  - Failed deployments → Notify team
```

### Tools
- Sentry - Error tracking
- DataDog/NewRelic - APM
- CloudWatch - Metrics and logs
- PagerDuty - Alerting
- Grafana - Dashboards

---

## Security Hardening (Post-Deployment)

### HTTPS & SSL
- [ ] Install SSL certificate (Let's Encrypt)
- [ ] Force HTTPS (redirect HTTP)
- [ ] Enable HSTS
- [ ] Test SSL with ssllabs.com

### DDoS Protection
- [ ] Enable CloudFlare or AWS Shield
- [ ] Configure rate limiting
- [ ] Setup IP blocking
- [ ] Monitor for attack patterns

### API Security
- [ ] Enable API versioning
- [ ] Implement request signing (HMAC)
- [ ] Rate limit by user/IP
- [ ] Whitelist known clients
- [ ] Monitor for suspicious patterns

### Access Control
- [ ] Restrict SSH access (security groups)
- [ ] Use key-based authentication
- [ ] Disable password authentication
- [ ] Setup VPN for admin access
- [ ] Enable audit logging

### Vulnerability Management
- [ ] Run dependency check: `safety check`
- [ ] Scan Docker image: `trivy image satyacheck`
- [ ] OWASP dependency check
- [ ] Regular security updates

---

## Rollback Plan

### If Something Goes Wrong

```bash
# Stop current deployment
docker-compose down

# Revert to previous version
git checkout main~1
docker-compose up -d

# Or use previous Docker image
docker tag satyacheck:previous satyacheck:latest
docker-compose up -d

# Notify team immediately
# Investigate issue
# Create fix
# Test thoroughly
# Re-deploy
```

### Runbooks for Common Issues

**API not responding:**
1. Check if containers are running: `docker-compose ps`
2. Check logs: `docker-compose logs backend`
3. Check database: `psql satyacheck -c "SELECT 1;"`
4. Restart services: `docker-compose restart`

**Database issues:**
1. Check connection: `psql satyacheck -c "SELECT 1;"`
2. Check disk space: `df -h`
3. Check slow queries: `tail /var/log/postgresql/postgresql.log`
4. Restart: `sudo systemctl restart postgresql`

**Celery not processing:**
1. Check Redis: `redis-cli ping`
2. Check worker: `celery -A satyacheck inspect active`
3. Check logs: `docker-compose logs celery`
4. Restart: `docker-compose restart celery`

---

## Post-Deployment Review (1 Week)

- [ ] Review error logs for issues
- [ ] Analyze performance metrics
- [ ] Gather user feedback
- [ ] Review security audit logs
- [ ] Check cost/resource usage
- [ ] Plan optimizations
- [ ] Document lessons learned
- [ ] Update runbooks

---

## Communication

### Before Deployment
```
Subject: Scheduled Deployment - [Date/Time]

SatyaCheck backend will be updated on [DATE] at [TIME] UTC.
Expected downtime: 5-10 minutes
Systems affected: API, admin panel
No action required from users.
```

### During Deployment
- Monitor Slack/email for updates
- Keep team on standby
- Update status every 5 minutes

### After Deployment
```
Subject: Deployment Complete ✅

SatyaCheck backend has been successfully deployed.
All systems are operational.
Changes: [List of changes]
Performance: [Metrics]
```

---

## Checklist Summary
- [ ] 38 pre-deployment items completed
- [ ] Deployment executed successfully
- [ ] Post-deployment verification passed
- [ ] Monitoring active for 24 hours
- [ ] Team notified and aware
- [ ] Rollback plan ready if needed
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Lessons documented

**Deployment Status: READY** ✅
