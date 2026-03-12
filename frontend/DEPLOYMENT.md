# Vercel Deployment Guide

This guide explains how to deploy the FraudGuard frontend to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A deployed Flask backend (e.g., on Heroku, Railway, or AWS)
- Firebase project configured with Authentication and Firestore

## Deployment Steps

### 1. Prepare Your Backend API

Ensure your Flask backend is deployed and accessible via HTTPS. Note your backend URL (e.g., `https://your-api.herokuapp.com`).

### 2. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your repository (GitHub/GitLab/Bitbucket)
4. Select the `frontend` folder as the root directory

### 3. Configure Build Settings

Vercel should auto-detect your Vite project. Verify the following settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 4. Add Environment Variables

In the Vercel project settings, add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend-url.com` | Your deployed Flask backend URL |
| `VITE_FIREBASE_API_KEY` | Your Firebase API key | From Firebase Console |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Firebase Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Your project ID | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Your app ID | Firebase app ID |

> **Important:** Copy these values from your Firebase Console > Project Settings > General

### 5. Deploy

Click **"Deploy"** and wait for Vercel to build and deploy your application.

## Configuration Files

### `vercel.json`

The `vercel.json` file in the root directory contains:

- **Rewrites:** Routes all requests to `index.html` for client-side routing (React Router)
- **Headers:** Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- **Caching:** Aggressive caching for static assets in `/assets/`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### `vite.config.ts`

Already configured correctly for Vercel deployment with:
- Path aliases (`@` → `./src`)
- React SWC plugin for fast builds
- Standard Vite build output to `dist/`

## Post-Deployment

### 1. Test Routes

After deployment, test that all routes work:
- Visit `https://your-app.vercel.app/`
- Navigate to `/batch-analysis`
- Refresh the page (should not show 404)
- Navigate to `/dashboard`

### 2. Configure Firebase

In your Firebase Console:
1. Go to **Authentication > Settings > Authorized domains**
2. Add your Vercel domain: `your-app.vercel.app`

### 3. Update CORS Settings

In your Flask backend (`app.py`), update CORS to allow your Vercel domain:

```python
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://your-app.vercel.app",
            "http://localhost:8080"
        ]
    }
})
```

## Troubleshooting

### Routes Return 404 on Refresh

**Problem:** Navigating to `/batch-analysis` works, but refreshing returns 404.

**Solution:** Verify `vercel.json` exists in the root directory with the rewrite rule.

### Environment Variables Not Working

**Problem:** API calls fail or Firebase doesn't connect.

**Solution:**
1. Ensure all environment variables are added in Vercel dashboard
2. Variables must start with `VITE_` to be accessible in the frontend
3. Redeploy after adding environment variables

### CORS Errors

**Problem:** API calls fail with CORS errors.

**Solution:**
1. Update Flask backend CORS configuration to include Vercel domain
2. Ensure `VITE_API_URL` points to the correct backend URL (with HTTPS)

### Build Fails

**Problem:** Vercel build fails with TypeScript errors.

**Solution:**
1. Run `npm run build` locally to check for errors
2. Fix any TypeScript errors in the code
3. Commit and push changes

## Custom Domain

To add a custom domain:
1. Go to Vercel project settings > Domains
2. Add your custom domain (e.g., `fraudguard.com`)
3. Update DNS records as instructed by Vercel
4. Add the custom domain to Firebase authorized domains

## Environment-Specific Builds

To build for different environments:

- **Development:** `npm run build:dev`
- **Production:** `npm run build`

## Monitoring

- **Logs:** View real-time logs in Vercel dashboard > Deployments > [Your Deployment] > Runtime Logs
- **Analytics:** Enable Vercel Analytics in project settings
- **Performance:** Use Vercel Speed Insights for performance monitoring

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/tutorial#deploying)

