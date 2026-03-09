# Quick Fix Commands for FitFoot API Issues

**URGENT:** Run these commands in order to fix 3 failing API endpoints

## Current Problem
- 18/21 tests passing ✅
- 3 API endpoints failing ❌
- Customer experience: 100% working ✅
- Admin APIs: Not working ❌

## Step 1: Verify System Status
```bash
cd /home/g/dev/fitfoot
curl http://localhost:9000/health
# Should return: {"status":"ok"}
```

## Step 2: Test Current Failures
```bash
# Test 1: Store Products (FAILING)
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products
# Current: {"message":"A valid publishable key is required","type":"invalid_request"}

# Test 2: Store Regions (FAILING)  
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/regions
# Current: {"message":"A valid publishable key is required","type":"invalid_request"}

# Test 3: Admin Access (FAILING)
curl http://localhost:9000/admin/
# Current: {"message":"Unauthorized","type":"unauthorized"}
```

## Step 3: Try Different Header Formats
```bash
# Format 1: Current (failing)
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products

# Format 2: Authorization Bearer  
curl -H "Authorization: Bearer apk_your-publishable-key" http://localhost:9000/store/products

# Format 3: Alternative header name
curl -H "x-publishable-key: apk_your-publishable-key" http://localhost:9000/store/products

# Format 4: Medusa-specific header
curl -H "x-medusa-publishable-key: apk_your-publishable-key" http://localhost:9000/store/products
```

## Step 4: Check Medusa Configuration
```bash
# Read Medusa config file
cat apps/medusa/medusa-config.ts | grep -A 10 -B 10 "publishable"
```

## Step 5: Check Database API Key
```bash
# Connect to PostgreSQL
psql postgresql://postgres:password@localhost:5432/medusa_db -c "
SELECT pak.token, pak.created_at, sc.name as sales_channel 
FROM publishable_api_key pak 
LEFT JOIN publishable_api_key_sales_channel paksc ON pak.id = paksc.publishable_key_id
LEFT JOIN sales_channel sc ON paksc.sales_channel_id = sc.id 
WHERE pak.token = 'apk_your-publishable-key';
"
```

## Step 6: Create Admin User (for admin access)
```bash
cd apps/medusa
node src/scripts/create-admin-user.ts
```

## Step 7: Restart Services and Test
```bash
# Kill and restart Medusa
pkill -f "medusa develop"
cd apps/medusa && npm run dev &

# Wait 10 seconds then test
sleep 10
curl -H "x-publishable-api-key: apk_your-publishable-key" http://localhost:9000/store/products
```

## Step 8: Run Full Test Suite
```bash
cd /home/g/dev/fitfoot
node scripts/comprehensive-test.js
# Target: 21/21 tests passing (currently 18/21)
```

## Expected Success Output

### Store Products API (should return):
```json
[
  {
    "id": "prod_01...",
    "title": "Alpine Trek Pro",
    "description": "Premium hiking boots...",
    "variants": [...],
    "images": [...]
  },
  ... (4 more Swiss footwear products)
]
```

### Store Regions API (should return):
```json
[
  {
    "id": "reg_01...",
    "name": "Switzerland", 
    "currency_code": "CHF",
    "countries": [...]
  }
]
```

### Admin Access (should return):
```json
{
  "user": {...},
  "access_token": "...",
  "refresh_token": "..."
}
```

## Quick Reference

### Key Information
- **API Key:** `apk_your-publishable-key`
- **Sales Channel:** `sc_01JXZRNAQ9KZWJ3D87F48ECJZR`
- **Backend URL:** `http://localhost:9000`
- **Database:** `postgresql://postgres:password@localhost:5432/medusa_db`

### Important Files
- `apps/medusa/medusa-config.ts` - Main configuration
- `apps/medusa/.env` - Environment variables
- `apps/medusa/src/scripts/seed-api-key.ts` - API key creation
- `scripts/comprehensive-test.js` - Test suite

### Success Criteria
- All API endpoints return data (no authentication errors)
- 21/21 comprehensive tests pass
- Frontend shop page loads products from backend
- Admin interface accessible

---

**If all else fails:** The API key generation script works, so the issue is likely in Medusa configuration or header format. Focus on `medusa-config.ts` middleware setup.
