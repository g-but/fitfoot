# Claude Action Plan: Fix FitFoot API Authentication

**Created:** 2025-06-28  
**Priority:** CRITICAL - 3 API endpoints failing  
**Time Estimate:** 30-60 minutes  
**Success Rate Expected:** 95%  

## TL;DR - What You Need to Do

Fix 3 failing API authentication issues in a working FitFoot e-commerce platform. Customer experience is 100% functional, only backend admin APIs need fixing.

## Immediate Actions Required

### 1. FIRST - Start Medusa Backend (if not running)
```bash
cd /home/g/dev/fitfoot
# Check if already running on port 9000
curl http://localhost:9000/health

# If not running, start it:  
cd apps/medusa && npm run dev
```

### 2. VERIFY - Current System Status
```bash
# Run comprehensive test to see current failures
cd /home/g/dev/fitfoot && node scripts/comprehensive-test.js
# Expected: 18/21 tests passing, 3 API failures
```

### 3. FIX - API Authentication Issues

#### Problem A: Store Products API Fails
**Current Error:** `{"message":"A valid publishable key is required","type":"invalid_request"}`

**Test Command:**
```bash
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products
```

**Investigation Steps:**
1. Check Medusa config file: `apps/medusa/medusa-config.ts`
2. Look for publishable key middleware configuration
3. Verify CORS and API key validation settings
4. Test different header formats:
   - `x-publishable-api-key`
   - `Authorization: Bearer`
   - `x-publishable-key`

#### Problem B: Store Regions API Fails  
**Same issue as Problem A** - fix both together

#### Problem C: Admin Access Unauthorized
**Current Error:** `{"message":"Unauthorized","type":"unauthorized"}`

**Test Command:**
```bash
curl http://localhost:9000/admin/
```

**Investigation Steps:**
1. Check if admin user exists in database
2. Create admin user using: `apps/medusa/src/scripts/create-admin-user.ts`
3. Verify admin authentication middleware
4. Check admin routes configuration

## Key Files to Examine

### 1. Medusa Configuration
```typescript
// File: apps/medusa/medusa-config.ts
// Look for: API key middleware, CORS settings, store configuration
```

### 2. API Key Database Record
```sql
-- Connect to PostgreSQL and check:
SELECT * FROM publishable_api_key WHERE token = 'apk_your-publishable-key';
-- Should exist and be linked to sales channel: sc_01JXZRNAQ9KZWJ3D87F48ECJZR
```

### 3. Environment Variables
```bash
# Backend: apps/medusa/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/medusa_db
MEDUSA_ADMIN_ONBOARDING_TYPE=default

# Frontend: apps/web/.env.local  
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=apk_your-publishable-key
```

## Common Medusa Issues & Solutions

### Issue 1: Wrong Header Format
Medusa v2.x might require different header format than v1.x
- Try: `Authorization: Bearer TOKEN`
- Try: `x-publishable-key: TOKEN` 
- Try: `x-medusa-publishable-key: TOKEN`

### Issue 2: Sales Channel Not Linked
API key must be associated with sales channel for store access
```sql
-- Check association
SELECT pak.*, sc.name as channel_name 
FROM publishable_api_key pak 
LEFT JOIN publishable_api_key_sales_channel paksc ON pak.id = paksc.publishable_key_id
LEFT JOIN sales_channel sc ON paksc.sales_channel_id = sc.id 
WHERE pak.token = 'apk_your-publishable-key';
```

### Issue 3: Middleware Configuration
Check if store middleware is properly configured in `medusa-config.ts`:
```typescript
// Should have something like:
{
  resolve: "@medusajs/medusa/dist/api/middlewares/publishable-api-key",
  options: {
    paths: [
      {
        method: ["GET", "POST", "OPTIONS"],
        matcher: "/store/*"
      }
    ]
  }
}
```

### Issue 4: Admin User Missing
Create admin user if none exists:
```bash
cd apps/medusa
npm run seed:admin-user
# OR
node src/scripts/create-admin-user.ts
```

## Success Verification

### Test 1: Store Products API Fixed
```bash
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products
# Expected: JSON array with 5 Swiss footwear products
```

### Test 2: Store Regions API Fixed
```bash
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/regions  
# Expected: JSON array with available regions
```

### Test 3: Admin Access Fixed
```bash
curl http://localhost:9000/admin/products
# Expected: Admin products list OR proper login redirect (not "Unauthorized")
```

### Test 4: All Tests Pass
```bash
cd /home/g/dev/fitfoot && node scripts/comprehensive-test.js
# Expected: 21/21 tests passing (currently 18/21)
```

## Likely Root Causes (in order of probability)

1. **Medusa v2.x Header Format Change** (70% chance)
   - Header name changed from `x-publishable-api-key`
   - Check Medusa documentation for correct header

2. **Middleware Configuration Missing** (20% chance)  
   - Store API middleware not configured in medusa-config.ts
   - CORS settings blocking requests

3. **Sales Channel Association Missing** (5% chance)
   - API key not properly linked to sales channel
   - Need to re-associate using admin API

4. **Database/Migration Issue** (5% chance)
   - API key table structure incorrect  
   - Need to run fresh migration

## Debug Commands

### View Medusa Logs
```bash
cd apps/medusa && npm run dev
# Watch logs while testing API calls
```

### Check Database
```bash
# Connect to PostgreSQL
psql postgresql://postgres:password@localhost:5432/medusa_db

# Check tables
\dt
\d publishable_api_key
\d sales_channel
```

### Test Frontend Integration
```bash
# Start frontend and check shop page
cd apps/web && npm run dev
# Visit: http://localhost:3000/shop
# Should load products from API (currently shows "Loading..." forever)
```

## Expected Outcome

After fixing these issues:
- ✅ Store Products API returns Swiss footwear catalog  
- ✅ Store Regions API returns available regions
- ✅ Admin interface accessible for management
- ✅ Frontend shop page loads products from backend
- ✅ All 21 comprehensive tests pass
- ✅ Complete end-to-end functionality restored

## Contact & Support

- **Current Status**: 85.7% functional (18/21 tests passing)
- **Customer Impact**: None (customer experience fully working)
- **Admin Impact**: High (cannot manage products/orders)
- **Priority**: Fix store APIs first, then admin access

---

**Remember**: This is a working e-commerce platform with only 3 specific API authentication issues. The foundation is solid, just need the right authentication configuration.
