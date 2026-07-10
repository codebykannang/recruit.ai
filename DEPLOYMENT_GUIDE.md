# RecruitAI — React Frontend Deployment Guide

## Project Structure

```
recruitai-react/        ← React frontend (this folder)
recruitai-backend/      ← Flask backend (original, updated)
```

---

## 🆓 FREE Hosting Stack (100% Free Forever)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Netlify** | React Frontend | Unlimited sites, 100GB bandwidth |
| **Railway** | Flask Backend | 5$ credit/month (enough for hobby) |
| **Clever Cloud** | MySQL DB | 256MB free forever |

---

## STEP 1 — Deploy Flask Backend to Railway

### 1.1 Create `Procfile` in recruitai-backend/
```
web: gunicorn app:app --bind 0.0.0.0:$PORT
```

### 1.2 Install gunicorn
```bash
pip install gunicorn
pip freeze > requirements.txt
```

### 1.3 Deploy to Railway
1. Go to https://railway.app → New Project → Deploy from GitHub
2. Connect your GitHub repo (push recruitai-backend/ to a repo)
3. Add environment variables in Railway dashboard:
   ```
   SECRET_KEY=your-secret-key-here
   MYSQL_HOST=your-clever-cloud-host
   MYSQL_USER=your-db-user
   MYSQL_PASSWORD=your-db-password
   MYSQL_DB=your-db-name
   FRONTEND_URL=https://YOUR_SITE.netlify.app
   ```
4. Railway auto-detects Python and deploys
5. Copy your Railway URL: `https://recruitai-xxx.railway.app`

### Alternative: Render.com (also free)
1. Go to https://render.com → New Web Service
2. Connect GitHub repo
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `gunicorn app:app`
5. Add same environment variables

---

## STEP 2 — Set MySQL on Clever Cloud

1. Go to https://clever-cloud.com → Add Service → MySQL
2. Copy host, user, password, database from the dashboard
3. Run schema: `mysql -h HOST -u USER -p DATABASE < schema.sql`
4. Add credentials to Railway env vars (Step 1.3)

---

## STEP 3 — Deploy React Frontend to Netlify

### 3.1 Update `.env.production` in recruitai-react/
```
REACT_APP_API_URL=https://YOUR_RAILWAY_URL.railway.app
```

### 3.2 Build
```bash
cd recruitai-react
npm run build
```

### 3.3 Deploy to Netlify
**Option A — Drag & Drop (Easiest)**
1. Go to https://app.netlify.com
2. Drag the `recruitai-react/build/` folder into the deploy area
3. Done! You get a URL like `https://amazing-site-123.netlify.app`

**Option B — CLI**
```bash
npm install -g netlify-cli
netlify login
cd recruitai-react
netlify deploy --prod --dir=build
```

**Option C — GitHub Auto-deploy**
1. Push project to GitHub
2. Netlify → New site from Git → Connect repo
3. Build command: `npm run build`
4. Publish directory: `build`
5. Environment variables: `REACT_APP_API_URL=https://your-railway-url`

### 3.4 Fix React Router (SPA routing)
Create `recruitai-react/public/_redirects`:
```
/*    /index.html   200
```
This is already handled in the build. ✅

---

## STEP 4 — Connect Frontend to Backend

In Netlify site settings → Environment variables:
```
REACT_APP_API_URL=https://your-railway-url.railway.app
```

Then rebuild and redeploy.

---

## Local Development

### Backend
```bash
cd recruitai-backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DB credentials
python app.py
# Runs at http://localhost:5000
```

### Frontend
```bash
cd recruitai-react
npm install
# Make sure .env has: REACT_APP_API_URL=http://localhost:5000
npm start
# Runs at http://localhost:3000
```

---

## 3D Landing Page Features

The new React landing page includes:
- **3D floating resume models** built with Three.js + @react-three/fiber
- **AI node ring** orbiting the resume with glowing cyan nodes
- **Floating particle field** for depth
- **Parallax scroll** on the hero section
- **Framer Motion** page transitions, hover animations, scroll reveals
- **Responsive design** — mobile, tablet, laptop, desktop all perfectly fit

---

## Responsive Breakpoints

| Device | Width | Behavior |
|--------|-------|----------|
| Mobile | < 768px | Single column, hamburger nav, stacked canvas |
| Tablet | 768–1024px | 2-column grid, collapsed sidebar |
| Laptop | 1024–1440px | Full layout, sidebar hover-expand |
| Desktop | > 1440px | Full layout, max-width containers |

---

## Environment Variables Reference

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (.env)
```
SECRET_KEY=change-me-in-production
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=recruitai
FRONTEND_URL=https://yoursite.netlify.app
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your-app-password
```
