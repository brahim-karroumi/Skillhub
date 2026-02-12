# SkillHub Deployment Guide

## Issues Fixed ✅

### 1. **File System Write Problem**
- **Problem**: Vercel serverless functions have a read-only file system (except `/tmp`)
- **Solution**: Modified `fileDB.ts` to use `/tmp` directory in production
- **⚠️ Important**: `/tmp` storage is NOT persistent across function invocations

### 2. **Express Server Configuration**
- **Problem**: `app.listen()` doesn't work with Vercel serverless functions
- **Solution**: Export the Express app for serverless use while keeping local development working

### 3. **Missing Vercel Configuration**
- **Problem**: No `vercel.json` to tell Vercel how to deploy
- **Solution**: Created `vercel.json` with modern routing (no deprecated `builds` field) and `api/` directory for serverless function

---

## Deployment Steps for Vercel

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project settings and add:

```
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

### Step 2: Deploy

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## ⚠️ CRITICAL LIMITATION

**Your current setup uses JSON files for data storage, which will NOT persist in Vercel!**

### Why?
- Vercel serverless functions are stateless
- `/tmp` directory is cleared between cold starts
- Any data written will be lost when the function spins down

### What This Means:
- ✅ Users can register/login during a session
- ❌ Data will be lost after ~5-15 minutes of inactivity
- ❌ Not suitable for production use

---

## Recommended Solutions

### Option A: Use a Real Database (Recommended)

#### 1. **MongoDB Atlas** (Free tier available)
```bash
npm install mongoose
```

#### 2. **Vercel Postgres** (Paid)
```bash
npm install @vercel/postgres
```

#### 3. **Supabase** (Free tier available)
```bash
npm install @supabase/supabase-js
```

### Option B: Deploy to a Different Platform

If you want to keep using JSON files, deploy to platforms that support persistent file systems:

1. **Railway.app** (Free tier)
   - Supports persistent volumes
   - Easy deployment from GitHub

2. **Render.com** (Free tier)
   - Supports persistent disks
   - Simple setup

3. **DigitalOcean App Platform**
   - More control
   - Affordable pricing

---

## Testing Your Deployment

After deploying to Vercel:

1. Visit: `https://your-app.vercel.app/register`
2. Register a new user
3. Login
4. Add some skills
5. **Wait 15-20 minutes** (let the function go cold)
6. Try to login again - your data will likely be gone

---

## Next Steps

### For Production:
1. **Choose a database** (MongoDB Atlas is the easiest)
2. **Refactor `fileDB.ts`** to use the database
3. **Update controllers** to use async/await properly
4. **Add error handling** for database operations

### For Quick Testing:
Your current setup will work on Vercel for short-term testing, but don't rely on it for real users!

---

## Local Development

```bash
# Install dependencies
npm install

# Set up .env file
cp .env.example .env
# Edit .env and set JWT_SECRET

# Run in development mode
npm run dev

# Visit http://localhost:10000
```

---

## Troubleshooting

### "FUNCTION_INVOCATION_FAILED" Error
- ✅ **Fixed** - This was caused by:
  - Missing `vercel.json`
  - Using `app.listen()` in serverless context
  - File system write errors

### Environment Variables Not Working
- Ensure `JWT_SECRET` is set in Vercel dashboard
- Redeploy after adding environment variables

### Data Not Persisting
- **Expected behavior** with current setup
- Migrate to a database for persistence

---

## Questions?

If you need help migrating to a database, let me know which one you'd prefer:
- MongoDB (easiest)
- PostgreSQL (more structured)
- Vercel KV (simplest, but limited features)
