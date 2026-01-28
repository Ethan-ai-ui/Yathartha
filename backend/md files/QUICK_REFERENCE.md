# ⚡ SatyaCheck Backend - Quick Reference Card

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Setup
cp .env.example .env              # Update with your settings
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Initialize
python validate_config.py          # Verify setup
python scripts/setup.py            # Create DB and superuser

# 3. Run Services (in separate terminals)
redis-server                       # Terminal 1
python manage.py runserver         # Terminal 2
celery -A satyacheck worker -l info # Terminal 3
celery -A satyacheck beat -l info  # Terminal 4

# 4. Access
Admin: http://localhost:8000/admin/
API: http://localhost:8000/api/v1/
Docs: http://localhost:8000/api/docs/
```

---

## 📝 Common Commands

### Django Management
```bash
python manage.py migrate              # Run migrations
python manage.py makemigrations       # Create migrations
python manage.py shell                # Interactive Python shell
python manage.py createsuperuser      # Create admin user
python manage.py collectstatic        # Collect static files
python manage.py test                 # Run tests
python manage.py flush                # Clear database (dev only)
```

### Celery
```bash
celery -A satyacheck worker -l info        # Worker
celery -A satyacheck beat -l info          # Scheduler
celery -A satyacheck inspect active        # See active tasks
celery -A satyacheck inspect scheduled     # See scheduled tasks
flower -A satyacheck --port=5555          # Monitor UI
```

### Database
```bash
psql satyacheck                      # Connect to DB
pg_dump satyacheck > backup.sql      # Backup
psql satyacheck < backup.sql         # Restore
```

### Git
```bash
git status                           # Check changes
git add .                           # Stage all
git commit -m "message"             # Commit
git push origin main                # Push to GitHub
```

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `.env` | Configuration (CREATE FROM .env.example) |
| `manage.py` | Django CLI |
| `satyacheck/core/settings.py` | Django settings |
| `satyacheck/celery.py` | Celery config |
| `requirements.txt` | Python dependencies |
| `docker-compose.yml` | Docker services |
| `README.md` | Full documentation |

---

## 🔌 API Endpoints (Essential)

### Auth
```
POST   /auth/signup/
POST   /auth/login/
GET    /auth/profile/
POST   /auth/logout/
POST   /auth/token/refresh/
```

### Submissions
```
POST   /submissions/                 Create
GET    /submissions/                 List
GET    /submissions/{id}/            Retrieve
GET    /submissions/{id}/results/    Get results
POST   /submissions/{id}/flag/       Flag
```

### Admin
```
GET    /admin/dashboard/
GET    /admin/reports/
GET    /admin/moderation-queue/
```

---

## 🗄️ Database Models

```
User
├── Submission
├── OTPVerification
├── UserActivity
└── UserBan

Submission
├── VerificationResult
└── ScrapedContent

AdminReport
ModerationQueue
SourceDatabase
AIModel
```

---

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check error messages
python validate_config.py
docker-compose logs backend

# Common issues:
# 1. Port already in use: sudo lsof -i :8000
# 2. .env missing: cp .env.example .env
# 3. DB not running: psql -U user -d satyacheck
```

### Celery Not Working
```bash
# Verify Redis
redis-cli ping

# Check Celery status
celery -A satyacheck inspect active

# View task logs
celery -A satyacheck worker -l debug
```

### Database Issues
```bash
# Test connection
psql -h localhost -U user -d satyacheck -c "SELECT 1;"

# Check migrations
python manage.py showmigrations

# Recreate if needed
python manage.py migrate --fake
python manage.py migrate
```

---

## 📊 Monitoring

### Health Check
```bash
# API health
curl http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Bearer {token}"

# Database
python manage.py shell
>>> from django.db import connection
>>> connection.cursor().execute("SELECT 1")

# Redis
redis-cli ping
```

### View Logs
```bash
# Django
tail -f logs/satyacheck.log

# Celery
tail -f logs/celery.log

# Docker
docker-compose logs -f backend
docker-compose logs -f celery
```

---

## 🚢 Docker Commands

```bash
# Build
docker build -t satyacheck:latest .

# Run
docker-compose up -d                # Start
docker-compose down                 # Stop
docker-compose ps                   # Status
docker-compose logs -f              # Logs

# Database in Docker
docker-compose exec postgres psql -U user -d satyacheck
```

---

## 🔐 Security Checklist

- [ ] Changed SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Updated ALLOWED_HOSTS
- [ ] Set strong database password
- [ ] Configured email service
- [ ] Enabled HTTPS
- [ ] Setup firewall rules
- [ ] Enabled audit logging

---

## 📞 Help Resources

| Need | Location |
|------|----------|
| Installation | README.md |
| Deployment | DEPLOYMENT.md |
| Integration | INTEGRATION.md |
| Complete Reference | INDEX.md |
| Checklist | DEPLOYMENT_CHECKLIST.md |
| API Docs | http://localhost:8000/api/docs/ |

---

## 🎯 Performance Tips

```bash
# Monitor resources
watch -n 1 'ps aux | grep python'
docker stats

# Database optimization
ANALYZE;
VACUUM ANALYZE;

# Clear cache
redis-cli FLUSHDB

# Check slow queries
tail -f /var/log/postgresql/postgresql.log
```

---

## 🔄 Deployment Quick Steps

```bash
# 1. Prepare
git pull origin main
python validate_config.py
python manage.py migrate

# 2. Docker Deploy
docker-compose down
docker build -t satyacheck:latest .
docker-compose up -d

# 3. Verify
curl http://localhost:8000/api/v1/auth/profile/
docker-compose ps
docker-compose logs -f
```

---

## ✅ Quick Checklist

- [ ] Code ready (git push done)
- [ ] .env configured
- [ ] Database running
- [ ] Redis running
- [ ] Django running
- [ ] Celery running
- [ ] Admin accessible
- [ ] API responding
- [ ] Tests passing
- [ ] Logs clean

---

## 🆘 Emergency Contacts

When things go wrong:

1. **Check logs first**
   ```bash
   docker-compose logs backend
   tail -f logs/satyacheck.log
   ```

2. **Validate config**
   ```bash
   python validate_config.py
   ```

3. **Check services**
   ```bash
   docker-compose ps
   redis-cli ping
   psql -U user -d satyacheck -c "SELECT 1;"
   ```

4. **Review documentation**
   - DEPLOYMENT.md → Troubleshooting section
   - README.md → Common issues

5. **Roll back if needed**
   ```bash
   git checkout main~1
   docker-compose restart
   ```

---

**Last Updated:** January 2024
**Status:** Production Ready ✅
**Version:** 1.0.0

Keep this card handy for quick reference! 📌
