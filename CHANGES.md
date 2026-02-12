# Changes Made to Fix Vercel Deployment

## Summary

Your application was crashing on Vercel with `FUNCTION_INVOCATION_FAILED` because it was designed for traditional server hosting, not serverless functions.

---

## Files Modified

### 1. ✅ `vercel.json` (NEW)

**Purpose**: Tells Vercel how to route your application (using modern config without deprecated `builds` field)

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

### 2. ✅ `api/index.js` (NEW)

**Purpose**: Vercel serverless function entry point that imports your Express app

```javascript
import app from '../dist/index.js';
export default app;
```

### 3. ✅ `index.ts`

**Changes**:
- Wrapped `app.listen()` in an environment check
- Added `export default app` for Vercel serverless

**Before**:
```typescript
const PORT = parseInt(process.env.PORT || "10000");
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

**After**:
```typescript
// For local development
if (process.env.NODE_ENV !== "production") {
    const PORT = parseInt(process.env.PORT || "10000");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default app;
```

### 4. ✅ `src/utils/fileDB.ts`

**Changes**:
- Added detection for Vercel environment
- Uses `/tmp` directory in production (only writable location on Vercel)
- Automatically copies initial data from `src/data` to `/tmp`
- Added error handling

**Key Addition**:
```typescript
const getDataPath = (fileName: string) => {
  // In production (Vercel), use /tmp directory
  if (process.env.VERCEL) {
    return path.join("/tmp", fileName);
  }
  // In development, use local src/data
  return path.join(process.cwd(), "src", "data", fileName);
};
```

### 5. ✅ `package.json`

**Updated Build Script**:
```json
"build": "tsc && npm run copy-views && npm run copy-data",
"copy-views": "mkdir -p dist/src/views && cp -r src/views/* dist/src/views/",
"copy-data": "mkdir -p dist/src/data && cp -r src/data/* dist/src/data/"
```

**Why**: TypeScript only compiles `.ts` files. We need to manually copy:
- EJS view templates (`src/views/*.ejs`)
- Initial JSON data files (`src/data/*.json`)

### 6. ✅ Deleted `.vercelignore`

**Problem**: Initially created a `.vercelignore` that blocked source files
**Solution**: Removed it - Vercel needs TypeScript source files to compile!

---

## Why It Was Failing

### 1. **File System Writes**
- Vercel functions can only write to `/tmp`
- Your code tried to write to `src/data/` which is read-only
- **Result**: Crash on any write operation (register, login, add skill)

### 2. **Server Listening**
- `app.listen()` tries to bind to a port
- Vercel functions don't work this way
- **Result**: Function couldn't start properly

### 3. **No Vercel Configuration**
- Vercel didn't know how to handle your Express app
- **Result**: Routing and build failures

---

## Current Limitations

### ⚠️ DATA IS NOT PERSISTENT

Because we're using `/tmp` storage:
- Data survives during active sessions
- Data is **LOST** when the function goes cold (15-20 min inactivity)
- **NOT production-ready** for real users

### Example Timeline:
```
10:00 AM - User registers → Data saved to /tmp
10:05 AM - User adds skills → Still works
10:25 AM - Function goes cold → /tmp cleared
10:30 AM - User tries to login → User not found!
```

---

## How to Deploy NOW

```bash
# 1. Make sure you've built the project
npm run build

# 2. Install Vercel CLI
npm i -g vercel

# 3. Login
vercel login

# 4. Deploy
vercel --prod

# 5. Set environment variable in Vercel dashboard
# JWT_SECRET=your-secret-key
# NODE_ENV=production
```

---

## Recommended Next Steps

### For Real Production Use:

1. **Add a Database** (Choose one):
   - MongoDB Atlas (free tier, easiest)
   - Vercel Postgres
   - Supabase (free tier)

2. **Refactor File Storage**:
   - Replace `readData()` and `writeData()` with database queries
   - Update all controllers to use database

3. **Add Proper Error Handling**:
   - Handle database connection errors
   - Add retry logic
   - Implement proper logging

### Or Use Different Hosting:

If you prefer to keep JSON files:
- Deploy to **Railway.app** (supports persistent storage)
- Deploy to **Render.com** (supports persistent disks)
- Use **DigitalOcean App Platform**

---

## Testing Checklist

After deployment:

- [ ] Visit `/register` - Can you register?
- [ ] Visit `/login` - Can you login?
- [ ] Visit `/api/v1/skills` - Can you see dashboard?
- [ ] Add a skill - Does it save?
- [ ] Refresh page - Still there?
- [ ] **Wait 20 minutes** - Still there? (Probably not! 😅)

---

## Questions?

If you want help:
1. Setting up MongoDB
2. Migrating to a different hosting platform
3. Adding proper database support

Just ask!
