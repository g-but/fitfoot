# 🚀 Fitfoot Deployment Guide

## Vercel Deployment Setup

### 1. **Connect GitHub to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click "New Project"
3. Import your `fitfoot` repository from GitHub
4. Vercel will auto-detect this as a monorepo

### 2. **Configure Project Settings**

When setting up the project in Vercel:

- **Framework Preset**: Next.js
- **Root Directory**: `apps/web` (IMPORTANT!)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 3. **Environment Variables**

Add these environment variables in Vercel dashboard:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-05-27
```

### 4. **Auto-Deployment**

Once configured:
- ✅ Every push to `main` branch will auto-deploy
- ✅ Pull requests will create preview deployments
- ✅ Vercel will build from the `apps/web` directory
- ✅ Environment variables will be injected automatically

### 5. **Custom Domain (Optional)**

1. In Vercel dashboard, go to your project
2. Click "Domains" tab
3. Add your custom domain (e.g., `fitfoot.ch`)
4. Follow DNS configuration instructions

## 🔧 **Troubleshooting**

### Build Issues
- Ensure `apps/web` is set as root directory
- Check that all environment variables are set
- Verify Sanity project ID and dataset are correct

### Sanity Connection
- Make sure Sanity Studio is deployed separately if needed
- Verify CORS settings in Sanity dashboard allow your Vercel domain

### Performance
- Images are optimized automatically by Next.js
- Static pages are pre-rendered for better performance
- API routes are serverless functions

## 📱 **Mobile & SEO**

- ✅ Fully responsive design
- ✅ SEO optimized with proper meta tags
- ✅ Fast loading with Next.js optimizations
- ✅ Swiss design principles implemented

## 🎯 **Next Steps After Deployment**

1. Test all pages on the live site
2. Verify Sanity content updates reflect on the website
3. Set up custom domain if desired
4. Configure analytics (Google Analytics, etc.)
5. Set up monitoring and error tracking

Your Fitfoot website is now ready for the world! 🌍 