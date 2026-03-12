# Pre-Deployment Checklist

Use this checklist before deploying to Vercel:

## 🔧 Configuration Files

- [x] `vercel.json` created with rewrite rules for React Router
- [x] `vite.config.ts` properly configured (path aliases, React plugin)
- [x] `.env.example` updated with all required variables
- [ ] `.env` contains your actual Firebase credentials (DO NOT commit this file)

## 🔐 Environment Variables (Add to Vercel Dashboard)

Collect these values before deployment:

- [ ] `VITE_API_URL` - Your deployed Flask backend URL (HTTPS)
- [ ] `VITE_FIREBASE_API_KEY` - From Firebase Console
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - From Firebase Console
- [ ] `VITE_FIREBASE_PROJECT_ID` - From Firebase Console
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - From Firebase Console
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - From Firebase Console
- [ ] `VITE_FIREBASE_APP_ID` - From Firebase Console

## 🚀 Backend Preparation

- [ ] Flask backend deployed and accessible via HTTPS
- [ ] Backend CORS configured to allow Vercel domain
- [ ] Backend API endpoints tested and working
- [ ] Database (Firestore) properly configured

## 🔥 Firebase Configuration

- [ ] Firebase project created
- [ ] Authentication enabled (Google Sign-In)
- [ ] Firestore database created with 'batches' collection
- [ ] Firebase authorized domains will include Vercel domain (add after deployment)

## 📦 Build Verification

Run these commands locally first:

```bash
# Install dependencies
npm install

# Run type checking
npm run lint

# Test production build
npm run build

# Preview production build
npm run preview
```

- [ ] `npm install` completes without errors
- [ ] `npm run lint` passes (or only warnings)
- [ ] `npm run build` succeeds (creates `dist/` folder)
- [ ] `npm run preview` shows working app on localhost

## 🧪 Testing Checklist

Test these features locally before deploying:

- [ ] Login with Google works
- [ ] CSV upload to Batch Analysis works
- [ ] Dashboard displays data after upload
- [ ] Charts render correctly (no blank charts)
- [ ] Navigation between pages works
- [ ] Logout works
- [ ] Protected routes redirect to login when not authenticated

## 🌐 Vercel Setup

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Build settings verified (Framework: Vite, Build: `npm run build`, Output: `dist`)
- [ ] All environment variables added to Vercel dashboard
- [ ] Deployment triggered

## ✅ Post-Deployment Testing

After deploying to Vercel:

- [ ] Home page loads correctly
- [ ] Navigation works (click links between pages)
- [ ] Refresh on `/batch-analysis` doesn't show 404
- [ ] Refresh on `/dashboard` doesn't show 404
- [ ] Login with Google works
- [ ] API calls to backend succeed
- [ ] CSV upload and analysis works
- [ ] Dashboard visualizations display correctly

## 🔒 Security Checklist

- [ ] `.env` file in `.gitignore` (not committed to Git)
- [ ] Firebase API keys are restricted (optional but recommended)
- [ ] Backend uses HTTPS (not HTTP)
- [ ] CORS only allows your frontend domain(s)

## 📝 Update Firebase After Deployment

Once you have your Vercel URL:

1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Add your Vercel domain (e.g., `your-app.vercel.app`)
3. If using custom domain, add that too

## 🐛 Common Issues

### Issue: 404 on Route Refresh
**Fix:** Verify `vercel.json` exists with rewrite rules

### Issue: Environment Variables Not Working
**Fix:** 
- Ensure variables start with `VITE_`
- Redeploy after adding variables to Vercel

### Issue: CORS Errors
**Fix:** 
- Update Flask CORS to include Vercel domain
- Use HTTPS URL for `VITE_API_URL`

### Issue: Firebase Auth Fails
**Fix:** 
- Add Vercel domain to Firebase authorized domains
- Verify all Firebase env variables are correct

## 🎉 Success Indicators

Your deployment is successful when:

- ✅ All routes work without 404 errors
- ✅ Login/logout works
- ✅ CSV uploads process successfully
- ✅ Dashboard charts display data
- ✅ No console errors (except optional warnings)
- ✅ Page refreshes work on all routes
