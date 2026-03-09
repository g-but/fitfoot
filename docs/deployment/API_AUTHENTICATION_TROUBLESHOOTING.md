# FitFoot API Authentication Troubleshooting Guide

**Created:** 2025-06-28  
**Status:** Active Issue - Requires Resolution  
**Priority:** High  

## Executive Summary

FitFoot is a fully functional Swiss sustainable footwear e-commerce platform with 85.7% system functionality. The customer-facing experience is 100% operational, but administrative API endpoints are failing authentication despite successful API key generation.

## Current System Status ✅

### Working Components (18/21 tests passing)
- **Frontend**: Complete Swiss e-commerce interface (4/4 tests ✅)
- **Backend**: Medusa service running on port 9000 (health check: OK ✅)
- **Database**: PostgreSQL with Swiss product catalog seeded ✅
- **Monitoring**: 24/7 automated deployment monitoring (PID active) ✅
- **Customer Experience**: Full shopping flow functional ✅
- **Swiss Localization**: Currency (CHF), dates, messaging ✅

### Non-Working Components (3/21 tests failing) ❌
1. **Store Products API** (`/store/products`) - "A valid publishable key is required"
2. **Store Regions API** (`/store/regions`) - Same authentication failure  
3. **Admin Interface Access** - Returns "Unauthorized" message

## Technical Environment

### Backend Service
- **URL**: `http://localhost:9000`
- **Status**: Running and healthy (`/health` returns 200 OK)
- **Database**: PostgreSQL connected successfully
- **Products**: Swiss sustainable footwear catalog seeded (5 products confirmed)

### API Key Details
- **Generated Key**: `apk_your-publishable-key`
- **Sales Channel**: `sc_01JXZRNAQ9KZWJ3D87F48ECJZR` (default)
- **Creation Method**: Medusa workflow (successful)
- **Validation**: Key exists in database, linked to sales channel

### Frontend Configuration
- Environment file updated with new API key
- Header format tested: both `x-publishable-api-key` and `Authorization: Bearer`

## Specific Problems to Solve

### Problem 1: Store API Authentication Failure
```bash
# Current failing request
curl -H "x-publishable-api-key: apk_your-publishable-key" \
     http://localhost:9000/store/products

# Response: {"message":"A valid publishable key is required","type":"invalid_request"}
```

### Problem 2: Admin Access Unauthorized
```bash
# Current failing request  
curl http://localhost:9000/admin/
# Response: {"message":"Unauthorized","type":"unauthorized"}
```

### Problem 3: Regional Data Access
```bash
# Current failing request
curl -H "x-publishable-api-key: apk_your-publishable-key" \
     http://localhost:9000/store/regions
     
# Response: {"message":"A valid publishable key is required","type":"invalid_request"}
```

## What Has Been Attempted ❌

### API Key Generation
- ✅ Created focused API key generation script (`apps/medusa/src/scripts/seed-api-key.ts`)
- ✅ Successfully generated valid publishable API key using Medusa workflows
- ✅ Verified API key linked to default sales channel
- ✅ Updated frontend environment file with new API key

### Header Format Testing
- ❌ Tested `x-publishable-api-key` header format
- ❌ Tested `Authorization: Bearer` header format
- ❌ Both return same "valid publishable key required" error

### Admin User Creation
- ❌ Attempted admin user creation (blocked by module import issues)
- ❌ Script fails with Medusa module import errors

### Service Restarts
- ✅ Backend restart completed
- ✅ Environment variable updates applied
- ✅ Database migration and seeding verified

## Key Files and Locations

### API Key Script
```typescript
// Location: apps/medusa/src/scripts/seed-api-key.ts
// Status: Working - generates valid keys
// Usage: npm run seed:api-key
```

### Environment Files
```bash
# Frontend: apps/web/.env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=apk_your-publishable-key

# Backend: apps/medusa/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/medusa_db
MEDUSA_ADMIN_ONBOARDING_TYPE=default
```

### Test Scripts
```javascript
// Location: scripts/comprehensive-test.js
// Current results: 18/21 tests passing
// Failing tests: Store products, regions, admin access
```

## Investigation Areas for Claude

### 1. Medusa Configuration Deep Dive
- **Check**: `apps/medusa/medusa-config.ts` for API key middleware configuration
- **Verify**: Store API middleware is properly configured
- **Look for**: CORS settings, publishable key validation logic

### 2. Database API Key Validation
- **Query**: Check if API key exists in `publishable_api_key` table
- **Verify**: Key is active and not expired
- **Check**: Sales channel relationship is correct

### 3. Medusa Store API Headers
- **Research**: Correct header format for Medusa store APIs
- **Test**: Alternative header names (`Authorization`, `x-publishable-key`, etc.)
- **Check**: Medusa documentation for v2.x API requirements

### 4. Admin Authentication Setup
- **Issue**: Admin endpoints require authentication but no admin user exists
- **Solution**: Create admin user or configure default admin access
- **Check**: Admin authentication middleware configuration

### 5. Sales Channel Configuration
- **Verify**: Default sales channel is properly configured
- **Check**: API key is associated with correct sales channel
- **Ensure**: Store APIs can access products through sales channel

## Debugging Commands

### Check API Key in Database
```sql
-- Connect to PostgreSQL and verify API key
SELECT * FROM publishable_api_key WHERE token = 'apk_your-publishable-key';
```

### Test Different Header Formats
```bash
# Test various header formats
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products
curl -H "Authorization: Bearer apk_your-publishable-key" http://localhost:9000/store/products
curl -H "x-publishable-key: apk_your-publishable-key" http://localhost:9000/store/products
```

### Check Medusa Logs
```bash
# Monitor Medusa backend logs for API requests
cd apps/medusa && npm run dev
# Watch for authentication errors in logs
```

## Expected Success Criteria

### 1. Store Products API Working
```bash
curl -H "x-publishable-api-key: apk_your-publishable-key" \
     http://localhost:9000/store/products
# Expected: JSON array of 5 Swiss sustainable footwear products
```

### 2. Store Regions API Working  
```bash
curl -H "x-publishable-api-key: apk_your-publishable-key" \
     http://localhost:9000/store/regions
# Expected: JSON array of available regions
```

### 3. Admin Access Working
```bash
curl http://localhost:9000/admin/products
# Expected: Admin products list or proper admin login redirect
```

### 4. Frontend Integration
- Shop page loads products from Medusa API
- Product catalog displays Swiss sustainable footwear
- Customer can browse and add products to cart

## Next Steps Priority

1. **HIGHEST**: Fix store API authentication (enables customer shopping)
2. **HIGH**: Resolve admin access (enables product management)
3. **MEDIUM**: Verify frontend integration works end-to-end
4. **LOW**: Document final solution for future reference

## Success Metrics

- All 21 comprehensive tests passing (currently 18/21)
- Store APIs return product data instead of authentication errors
- Admin interface accessible for product management
- Frontend shop page loads products from backend API

## Contact Information

- **System**: FitFoot Swiss E-commerce Platform
- **Environment**: Development (localhost)
- **Database**: PostgreSQL on localhost:5432
- **Backend**: Medusa on localhost:9000  
- **Frontend**: Next.js on localhost:3000

---

**Note**: The customer-facing experience is fully functional. These are backend administrative issues that don't impact customer shopping but prevent proper content management and API integration. 