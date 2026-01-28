# Frontend Integration Complete ✅

## What's Connected

### 🔐 Authentication
- ✅ Signup with email, password, username, and role
- ✅ Login with email/password
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Profile management
- ✅ Logout functionality
- ✅ OTP verification ready
- ✅ Password change ready

### 📝 Content Submission
- ✅ Submit text content
- ✅ Upload images
- ✅ Upload videos
- ✅ Upload audio files
- ✅ Submit links for analysis
- ✅ Language selection (English, Nepali, Hindi)
- ✅ Real-time analysis results

### 📊 User Dashboard
- Ready to display user submissions
- Ready to show analysis results
- Ready to display statistics

### 🎯 Verify Page
- ✅ Multiple content type support
- ✅ File upload handling
- ✅ Real-time API connection
- ✅ Results display
- ✅ Share and report functionality

### 🔗 API Integration
- ✅ Auth endpoints (signup, login, logout, profile, etc.)
- ✅ Submission endpoints (create, list, get results, flag)
- ✅ Analytics endpoints (overview, trends, reports)
- ✅ Admin endpoints (dashboard, moderation, bans)

## API Configuration

The frontend is configured to connect to your backend at:
```
http://localhost:8000/api/v1
```

This is set in `.env.local`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## How to Use

### 1. Sign Up
- Click "Get Started" in the header
- Fill in username, email, password, and role
- Account is created and you're logged in automatically

### 2. Verify Content
- Go to /verify page
- Select content type (text, image, video, audio, link)
- Enter content or upload file
- Click "Analyze Content"
- View results

### 3. Dashboard
- After login, click dashboard in header
- View your submissions and analysis results

### 4. Settings
- Click profile dropdown
- Manage account, change password, view submissions

## Backend Requirements

Make sure your backend is running:
```bash
cd backend
.\venv\Scripts\python manage.py runserver 0.0.0.0:8000
```

API should be available at: http://localhost:8000/api/v1/

## Frontend Development

Start the frontend dev server:
```bash
npm run dev
# or
yarn dev
```

Frontend will be available at: http://localhost:5173/

## Token Storage

Tokens are stored in localStorage for persistence:
```javascript
// Access tokens
const tokens = JSON.parse(localStorage.getItem("tokens"));
const user = JSON.parse(localStorage.getItem("user"));
```

## Error Handling

All API errors are caught and displayed as toast notifications. Check the console for detailed error messages.

## CORS Configuration

Make sure your backend has CORS properly configured. In `.env.backend`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,...
```

## API Services

All API endpoints are in `/src/services/api.ts`:
- `authAPI` - Authentication endpoints
- `submissionsAPI` - Content submission
- `analyticsAPI` - Analytics and reports
- `adminAPI` - Admin functions

## Authentication Context

Use the `useAuth()` hook in any component:
```tsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
  const { user, login, signup, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.username}</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
};
```

## Next Steps

1. ✅ Start backend: `python manage.py runserver`
2. ✅ Start frontend: `npm run dev`
3. ✅ Create account: Click "Get Started"
4. ✅ Verify content: Go to /verify
5. ✅ View results: Check dashboard

Everything is connected and ready to go! 🚀
