# SatyaCheck - Complete Run Guide

## Prerequisites Checklist

Before starting, verify you have these installed on your system:

### Required Software
- **Python 3.9+** - Run `python --version` in terminal
- **Node.js 18+** - Run `node --version` in terminal  
- **PostgreSQL 12+** - Run `psql --version` in terminal (or check Services on Windows)
- **Redis** - Required for caching and Celery tasks

### Installation Status (Windows)
```powershell
# Check Python
python --version

# Check Node.js
node --version
npm --version

# Check PostgreSQL
psql --version

# Check if PostgreSQL service is running (Windows)
Get-Service postgres* | Format-Table
```

If any are missing, install them before proceeding.

---

## Part 1: Start PostgreSQL Database

### On Windows (Easiest)
PostgreSQL usually runs as a Windows Service automatically. Verify it's running:

```powershell
# Check PostgreSQL service status
Get-Service "postgresql*"

# If not running, start it
Start-Service postgresql-x64-15  # (adjust version number as needed)
```

### If PostgreSQL isn't running
1. Open **Services** (Win+R → `services.msc`)
2. Find "postgresql-x64-XX"
3. Right-click → **Start**

**Expected**: Service shows "Running" status ✅

---

## Part 2: Start Redis Cache

Redis is needed for Celery and session management.

### Windows Option 1: Using WSL (Recommended)
```powershell
# Open WSL terminal
wsl

# Start Redis server
redis-server

# Expected output:
# Ready to accept connections
```

### Windows Option 2: Docker Desktop
```powershell
# If Docker is installed
docker run -d -p 6379:6379 redis:alpine

# Check if running
docker ps
```

### Verify Redis is working
```powershell
# Open new terminal and test
redis-cli ping

# Expected output: PONG
```

---

## Part 3: Start Backend Server

### Step 1: Navigate to backend directory
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha"
```

### Step 2: Activate Python virtual environment
```powershell
# Activate venv
.\venv\Scripts\Activate.ps1

# You should see (venv) at the start of your terminal line
```

### Step 3: Run database migrations
```powershell
python manage.py migrate

# Expected output:
# Running migrations:
# ...
# Operations to perform: ...
```

### Step 4: Start the backend server
```powershell
python manage.py runserver

# Expected output:
# Django version 6.0.1, using settings 'satyacheck.core.settings'
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

**✅ Backend is running at**: `http://localhost:8000`

### Verify Backend is working
Open in your browser:
- http://localhost:8000/api/v1/ - API root
- http://localhost:8000/api/docs/ - Interactive Swagger documentation

---

## Part 4: Start Celery Workers (Optional but Recommended)

Celery handles async tasks like AI analysis. In production, it's essential.

### Open a NEW terminal window
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha"
.\venv\Scripts\Activate.ps1

# Start Celery worker
celery -A satyacheck worker -l info

# Expected output:
# celery@DESKTOP-XXXX ready.
# [Tasks]
# [...]
```

**Note**: You can skip this for development, but AI analysis will fail. For full testing, keep this running.

---

## Part 5: Start Frontend Server

### Open a NEW terminal window (third terminal)
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha"

# Install dependencies (one-time)
npm install

# Start development server
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
# ➜  Press h to show help
```

**✅ Frontend is running at**: `http://localhost:5173`

---

## Part 6: Test the Complete Flow

### 1. Open the Application
Navigate to `http://localhost:5173` in your browser

### 2. Create a Test Account
- Click **"Get Started"** button (top-right)
- Click **"Sign Up"** tab
- Fill in form:
  - Email: `test@example.com`
  - Password: `TestPassword123!`
  - Confirm: `TestPassword123!`
  - User Type: Select "Citizen"
- Click **Sign Up** button
- You should see success message ✅

### 3. Login
- Refresh page or click "Sign In" if logged out
- Log back in with your test credentials
- You should see user dropdown in header ✅

### 4. Submit Content for Verification
- Click **"Verify Content"** link in navigation
- Fill in test content:
  - **Content Type**: Select "Text"
  - **Content**: Paste some text (e.g., "Nepal is located in South Asia")
  - **Language**: Select "English"
- Click **"Analyze Content"** button
- You'll see analysis results (misinformation score)
  - Green = Likely accurate
  - Red = Likely misinformation
  - Score shows confidence ✅

### 5. View Dashboard
- Click your **email dropdown** (top-right)
- Click **"Dashboard"**
- You should see:
  - **Stats cards** showing submission counts
  - **My Submissions tab** with your submitted content
  - **Analytics tab** with charts and trends
  - **Settings tab** with your profile info ✅

### 6. Test Download Report
- Go to **Analytics tab** in Dashboard
- Click **"Download Report"** button
- You should get a JSON file with analytics data ✅

### 7. Test Share Submission
- Go to **My Submissions tab**
- Click **"..."** menu on any submission
- Click **"Share"**
- URL should be copied to clipboard ✅

---

## Common Terminal States

### Terminal 1 - Backend Server (MUST BE RUNNING)
```
Django version 6.0.1, using settings 'satyacheck.core.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Terminal 2 - Celery Worker (Recommended)
```
celery@YOUR-COMPUTER ready.
[Tasks]
[2024-01-15 10:30:45,123: INFO/MainProcess] Connected to redis://localhost:6379/0
```

### Terminal 3 - Frontend Dev Server (MUST BE RUNNING)
```
➜  Local:   http://localhost:5173/
➜  Press h to show help
```

All three terminals should be running with no error messages.

---

## Troubleshooting

### Error: "Connection refused" when starting backend
**Issue**: PostgreSQL or Redis not running

**Solution**:
```powershell
# Check PostgreSQL
Get-Service postgres* | Format-Table

# Start if needed
Start-Service postgresql-x64-15

# Check Redis (in WSL)
wsl
redis-cli ping  # Should return PONG
```

### Error: "port 8000 already in use"
**Issue**: Another process is using port 8000

**Solution**:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (if PID is 1234)
taskkill /PID 1234 /F

# Or use different port
python manage.py runserver 8001
```

### Error: "ModuleNotFoundError" 
**Issue**: Virtual environment not activated

**Solution**:
```powershell
# Make sure you see (venv) in terminal
.\venv\Scripts\Activate.ps1

# If still fails, reinstall dependencies
pip install -r requirements.txt
```

### Error: "No module named 'django'"
**Issue**: Dependencies not installed

**Solution**:
```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Frontend shows blank page
**Issue**: Backend API not running or CORS issue

**Solution**:
1. Make sure Terminal 1 (backend) is running: `http://localhost:8000/api/v1/`
2. Check browser console for errors (F12)
3. Restart frontend: stop Terminal 3, then `npm run dev`

### Login doesn't work
**Issue**: Backend not responding

**Solution**:
1. Check Terminal 1 shows "Starting development server"
2. Test API manually: `http://localhost:8000/api/v1/auth/login/` in browser
3. If 404, migrations didn't run. Run: `python manage.py migrate`

### AI Analysis shows score 0
**Issue**: Celery worker not running

**Solution**: Start Celery in Terminal 2:
```powershell
celery -A satyacheck worker -l info
```

---

## Quick Start Command Cheatsheet

### Create a new terminal and run this for backend:
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha" ; .\venv\Scripts\Activate.ps1 ; python manage.py migrate ; python manage.py runserver
```

### Create a new terminal and run this for frontend:
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha" ; npm run dev
```

### Create a new terminal for Celery (optional):
```powershell
cd "c:\Users\Prithak Koirala\Documents\Yathartha" ; .\venv\Scripts\Activate.ps1 ; celery -A satyacheck worker -l info
```

---

## Success Checklist

After following all steps, you should have:

- ✅ PostgreSQL running (Windows Service)
- ✅ Redis running (WSL or Docker)
- ✅ Backend server running (Terminal 1) at `http://localhost:8000`
- ✅ Frontend server running (Terminal 3) at `http://localhost:5173`
- ✅ Can create account and login
- ✅ Can submit content for verification
- ✅ Can view dashboard with submissions and analytics
- ✅ Can download reports and share submissions
- ✅ (Optional) Celery worker running for AI analysis

---

## File Locations Reference

| Component | Location | Port |
|-----------|----------|------|
| Frontend Code | `src/` | 5173 |
| Backend Code | `backend/satyacheck/` | 8000 |
| Database Config | `backend/.env` | (PostgreSQL) |
| Redis Server | WSL or Docker | 6379 |
| Celery Config | `backend/satyacheck/celery.py` | N/A |
| API Docs | `http://localhost:8000/api/docs/` | - |

---

## Environment Variables

Frontend (`.env.local`):
```
VITE_API_URL=http://localhost:8000/api/v1
```

Backend (`.env`):
```
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.postgresql
DB_NAME=yathartha
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_URL=redis://localhost:6379/0
```

---

## Production Deployment

This guide covers local development. For production deployment (Docker, AWS, etc.), see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment to all platforms
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment verification

---

## Need Help?

Check the API documentation while running:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/

All API endpoints are documented with examples and response schemas.
