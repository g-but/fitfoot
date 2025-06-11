# 📊 Production Monitoring & Error Tracking Guide

**Created:** 2024-12-28  
**Last Modified:** 2024-12-28  
**Last Modified Summary:** Initial implementation of complete production monitoring suite

## 🎯 Overview

This guide covers the complete production monitoring implementation for Fitfoot, including error tracking, performance monitoring, and analytics.

---

## 🚨 Error Tracking with Sentry

### **Setup & Configuration**

#### **1. Sentry Project Setup**
1. Create account at [sentry.io](https://sentry.io)
2. Create new project for "Next.js"
3. Copy your DSN from project settings

#### **2. Environment Variables**
Add to your `.env.local` and Vercel environment:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org-name
SENTRY_PROJECT=fitfoot-web
```

#### **3. Features Implemented**

✅ **Client-Side Error Tracking**
- Automatic JavaScript error capture
- User session replay (10% sample rate)
- Performance monitoring with Core Web Vitals
- Browser extension error filtering

✅ **Server-Side Error Tracking**  
- API route error monitoring
- SSR error capture
- Performance traces for server requests

✅ **Custom Error Boundary**
- Graceful error handling with user-friendly UI
- Automatic error reporting to Sentry
- Development error details
- "Try Again" and "Go Home" actions

✅ **Performance Monitoring**
- Core Web Vitals tracking (LCP, CLS, FCP)
- Page load performance
- API call monitoring
- E-commerce event tracking

---

## ⚡ Performance Monitoring

### **Sentry Performance**
- **Traces Sample Rate:** 10% in production, 100% in development
- **Custom Measurements:** Page loads, API calls, Core Web Vitals
- **E-commerce Tracking:** Product views, cart actions, purchases

### **Lighthouse CI**
Automated performance testing on every build:

```bash
# Run Lighthouse locally
npm run lighthouse:build

# CI/CD Integration
npm run lighthouse
```

**Performance Budgets:**
- Performance Score: ≥80%
- Accessibility Score: ≥90% 
- SEO Score: ≥90%
- Best Practices: ≥90%

### **Core Web Vitals Targets**
- **LCP:** <4s (target <2.5s)
- **FID:** <300ms (target <100ms)  
- **CLS:** <0.1 (target <0.1)

---

## 🏥 Health Monitoring

### **Health Check Endpoint**
`GET /api/health` provides:

```json
{
  "status": "healthy",
  "timestamp": "2024-12-28T...",
  "version": "commit-sha",
  "environment": "production",
  "dependencies": {
    "database": { "status": "healthy" },
    "ecommerce": { "status": "degraded" }
  },
  "overall_status": "healthy"
}
```

**Monitoring:**
- Sanity CMS connectivity
- Medusa e-commerce status  
- Memory usage and uptime
- Server performance metrics

---

## 🔒 Security Headers

Implemented security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 📈 Analytics (Optional)

### **Privacy-Focused with Umami**

#### **Setup:**
1. Deploy Umami instance or use cloud service
2. Add environment variables:

```bash
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
```

#### **Tracked Events:**
- Page views and sessions
- E-commerce interactions
- Form submissions
- User engagement metrics

---

## 🚀 Deployment Configuration

### **Vercel Environment Variables**

**Required:**
```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=fitfoot-web

# Site Configuration  
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true

# CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-27
```

**Optional:**
```bash
# Analytics
NEXT_PUBLIC_UMAMI_SCRIPT_URL=your-umami-url
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id

# E-commerce
MEDUSA_BACKEND_URL=your-medusa-url
```

---

## 📊 Monitoring Dashboard

### **Sentry Dashboard**
- **Issues:** Real-time error tracking
- **Performance:** Page load and API metrics
- **Releases:** Deploy tracking with source maps
- **Alerts:** Email/Slack notifications for critical errors

### **Key Metrics to Monitor**
1. **Error Rate:** <1% of sessions
2. **Page Load Time:** <3s average
3. **API Response Time:** <500ms average
4. **Availability:** >99.9% uptime
5. **Core Web Vitals:** All in "Good" range

---

## 🔧 Troubleshooting

### **Common Issues**

#### **Sentry Not Capturing Errors**
- Check DSN configuration
- Verify environment variables in Vercel
- Check browser console for Sentry initialization

#### **Performance Monitoring Missing**
- Ensure `tracesSampleRate` is set
- Check if ad blockers are interfering
- Verify production source maps upload

#### **Health Check Failing**
- Check Sanity project ID and dataset
- Verify network connectivity to external services
- Review server logs for specific errors

---

## 📋 Maintenance Tasks

### **Weekly**
- [ ] Review error trends in Sentry
- [ ] Check performance regression alerts
- [ ] Monitor Core Web Vitals scores

### **Monthly** 
- [ ] Analyze user behavior patterns
- [ ] Review and update performance budgets
- [ ] Clean up resolved issues in Sentry

### **Quarterly**
- [ ] Review monitoring coverage
- [ ] Update performance targets
- [ ] Assess monitoring costs and optimization

---

## 🎯 Next Steps

With monitoring in place, consider:

1. **Advanced Alerts:** Custom alerts for business metrics
2. **User Feedback:** Error reporting with user context
3. **A/B Testing:** Performance impact of features
4. **Business Intelligence:** Advanced analytics and insights

**Your application is now production-ready with comprehensive monitoring!** 🚀 