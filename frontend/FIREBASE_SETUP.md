# Firebase Authentication Setup Guide

## Quick Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "fraud-guard-auth")
4. Disable Google Analytics (optional for free tier)
5. Click "Create project"

### 2. Enable Email/Password Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Under "Sign-in method" tab, click "Email/Password"
4. Toggle **Enable** switch ON
5. Save changes

### 3. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register app with nickname (e.g., "Fraud Guard Web")
5. Copy the `firebaseConfig` object values

### 4. Update .env File
Replace the placeholder values in `.env` with your Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 5. Create Test User (Optional)
1. In Firebase Console > Authentication > Users
2. Click "Add user"
3. Enter email: `admin@fraudguard.com`
4. Enter password: `Test123!`
5. Click "Add user"

### 6. Start the Application
```bash
npm run dev
```

## Using the Authentication System

### Sign In Flow
1. Navigate to `/signin`
2. Enter email and password
3. On success, redirected to `/dashboard`

### Protected Routes
- `/dashboard` - Fraud detection dashboard
- `/simulator` - Transaction simulator
- `/settings` - User profile and sign out

### Sign Out
1. Navigate to Settings page via sidebar
2. Click "Sign Out" button
3. Redirected to Sign In page

## Troubleshooting

### "Firebase: Error (auth/operation-not-allowed)"
- Ensure Email/Password authentication is enabled in Firebase Console

### "Firebase: Error (auth/invalid-api-key)"
- Check that all environment variables are set correctly in `.env`
- Restart the dev server after changing `.env` values

### CORS Errors
- Verify the domain is authorized in Firebase Console > Authentication > Settings > Authorized domains

## Firebase Free Tier Limits
- **Authentication**: Unlimited users
- **Email/Password**: No charges
- **Storage**: 1 GB (not used in this implementation)
- **Bandwidth**: 10 GB/month (not used in this implementation)

## Security Best Practices
- Never commit `.env` file to version control (already in `.gitignore`)
- Use Firebase Security Rules to restrict data access
- Enable 2FA for Firebase Console access
- Regularly review authenticated users in Firebase Console
