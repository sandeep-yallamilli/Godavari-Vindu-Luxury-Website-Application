# Production Deployment Guide: Firebase + Vercel + Supabase

This repository is pre-configured for full production deployment across **Firebase** (Frontend), **Vercel** (Backend), and **Supabase** (Database).

---

## 🛠️ Summary of Pre-Configured Files

| Service | Component | Key Configuration File |
| :--- | :--- | :--- |
| **Supabase** | PostgreSQL Database | [backend/deploy_supabase.py](file:///s:/PROJECTS/sandeep%20project%20files/python/my%20project/Godavari-vindu-luxury/backend/deploy_supabase.py) |
| **Vercel** | Django WSGI Backend | [backend/vercel.json](file:///s:/PROJECTS/sandeep%20project%20files/python/my%20project/Godavari-vindu-luxury/backend/vercel.json), [vercel.json](file:///s:/PROJECTS/sandeep%20project%20files/python/my%20project/Godavari-vindu-luxury/vercel.json) |
| **Firebase** | React + Vite Hosting | [frontend/firebase.json](file:///s:/PROJECTS/sandeep%20project%20files/python/my%20project/Godavari-vindu-luxury/frontend/firebase.json), [frontend/.firebaserc](file:///s:/PROJECTS/sandeep%20project%20files/python/my%20project/Godavari-vindu-luxury/frontend/.firebaserc) |

---

## 📌 STEP 1: Supabase Database Migration & Seeding

1. Create a PostgreSQL project at [supabase.com](https://supabase.com).
2. Copy your Connection String from **Project Settings -> Database -> Connection String (URI)**.
   - Use **Transaction Pooler** mode (Port `6543`) for Vercel serverless compatibility.
   - Example: `postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
3. Update `backend/.env` with your `DATABASE_URL`:
   ```env
   DATABASE_URL=postgres://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```
4. Run the automated database setup command:
   ```bash
   npm run setup:supabase
   ```
   *This command runs all Django migrations and populates menu categories, items, and site assets from `initial_data.json` into Supabase.*

---

## 📌 STEP 2: Vercel Backend Deployment

### Option A: Via Vercel CLI (Recommended)
Run the following command from the workspace root:
```bash
npm run deploy:backend
```

### Option B: Via Vercel Web Dashboard
1. Go to [vercel.com/new](https://vercel.com/new) and import your Git Repository.
2. Set **Root Directory** to `backend`.
3. Add the following **Environment Variables**:

| Variable Name | Value / Description | Example |
| :--- | :--- | :--- |
| `DEBUG` | `False` | `False` |
| `SECRET_KEY` | Strong random secret string | `django-insecure-prod-key-123` |
| `ALLOWED_HOSTS` | `.vercel.app,*` | `.vercel.app` |
| `DATABASE_URL` | Supabase Transaction Pooler URL | `postgres://postgres...:6543/postgres` |
| `FRONTEND_URL` | Your live Firebase app URL | `https://godavari-vindu-luxury.web.app` |
| `CORS_ALLOWED_ORIGINS` | Firebase web.app and firebaseapp.com URLs | `https://godavari-vindu-luxury.web.app,https://godavari-vindu-luxury.firebaseapp.com` |

4. Click **Deploy**. Note down your live Vercel URL (e.g. `https://godavari-vindu-backend.vercel.app`).

---

## 📌 STEP 3: Firebase Hosting Frontend Deployment

1. Make sure Firebase CLI is logged in:
   ```bash
   npx firebase-tools login
   ```
2. Update `frontend/.env.production` with your live Vercel backend URL:
   ```env
   VITE_API_URL=https://godavari-vindu-backend.vercel.app/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   VITE_WHATSAPP_NUMBER=+919963278455
   ```
3. Update project ID in `frontend/.firebaserc` (replace `godavari-vindu-luxury` with your Firebase project ID):
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```
4. Build & Deploy:
   ```bash
   npm run build:frontend
   npm run deploy:frontend
   ```

---

## ✅ STEP 4: Verification & Health Check

After completing deployment:
1. Visit your Vercel backend health endpoint: `https://godavari-vindu-backend.vercel.app/api/menu/categories/`
2. Open your live Firebase Hosting URL in a browser (`https://your-firebase-app.web.app`).
3. Test menu loading, authentication, cart, reservation forms, and image assets.
