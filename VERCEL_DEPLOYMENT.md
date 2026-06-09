# Vercel Deployment Guide

## Prerequisites
- Vercel account (free at vercel.com)
- MongoDB connection string (MongoDB Atlas)
- Clerk account for authentication

## Deployment Steps

### 1. Deploy the Backend Server

#### Option A: Using Git (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repo
5. Select `server` as the root directory
6. Add environment variables:
   - `MONGO_URI` - Your MongoDB connection string
   - `NODE_ENV` - Set to `production`
   - `CLERK_SECRET_KEY` - From your Clerk dashboard
   - `CLERK_PUBLISHABLE_KEY` - From your Clerk dashboard
7. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
npm i -g vercel
cd server
vercel --prod
# Follow prompts and add environment variables
```

**Note:** After deployment, copy your server URL (e.g., `https://your-project.vercel.app`)

---

### 2. Deploy the Frontend Client

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import your GitHub repo again
3. Select `client` as the root directory
4. Framework preset: Leave as "Vite"
5. Add environment variables:
   - `VITE_API_URL` - Your backend server URL from Step 1 (e.g., `https://your-project.vercel.app`)
6. Click "Deploy"

---

## Environment Variables Setup

### Server (.env in `server` folder)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
NODE_ENV=production
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### Client (.env in `client` folder - usually optional on Vercel)
```
VITE_API_URL=https://your-backend.vercel.app
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

---

## Important Configuration Notes

### CORS Setup
Your server already has CORS configured. Make sure the frontend URL is allowed:
- Update `server.js` FRONTEND_URL to your deployed client URL
- Or set via environment variable

### API Proxy in Development
In development, the client proxies to `http://localhost:5000`. On Vercel:
- The client makes requests to your backend URL directly (no proxy needed)
- Make sure `VITE_API_URL` is set in the frontend environment

---

## Troubleshooting

### "Cannot find module" error
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify

### CORS errors
- Check `FRONTEND_URL` environment variable in server
- Ensure server's CORS includes your frontend domain

### 404 on API calls
- Verify `VITE_API_URL` is correctly set in client
- Check that server routes are properly mounted

### MongoDB connection issues
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access allows Vercel IPs (allow all for now)

---

## Post-Deployment

### Update Clerk Redirect URLs
1. Go to Clerk Dashboard
2. Configure allowed redirect URLs to include your Vercel domains:
   - `https://your-frontend.vercel.app`
   - `https://your-frontend.vercel.app/callback`

### Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

---

## Useful Commands

```bash
# Check if everything builds locally
npm run build
cd client && npm run build
cd ../server && npm start

# Deploy using CLI
vercel --prod
```

## Support
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Clerk Docs: https://clerk.com/docs
