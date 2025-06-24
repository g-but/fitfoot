# FitFoot Testing & Validation Guide

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Complete E2E testing suite for MedusaJS + Supabase integration

## 🧪 **Testing Overview**

This guide provides comprehensive testing tools to ensure your MedusaJS + Supabase + Next.js stack works seamlessly together.

## 🚀 **Quick Test Commands**

### **Essential Tests**
```bash
# 1. Quick health check (30 seconds)
npm run health

# 2. Validate Supabase integration (2 minutes)
npm run validate-supabase

# 3. Test shopping workflow (3 minutes)
npm run test-e2e

# 4. Run all tests together (5 minutes)
npm run test-all
```

### **Development Tests**
```bash
# Comprehensive integration testing
npm run test-integration

# Unit tests
npm run test

# Watch mode for development
npm run test:watch
```

## 🏥 **1. Health Check (`npm run health`)**

**Purpose:** Quick verification that all services are running  
**Duration:** 30 seconds  
**Use case:** Before starting development, after server restart

### **What it checks:**
- ✅ Next.js Frontend (http://localhost:3005)
- ✅ Medusa Backend (http://localhost:9000/health)
- ✅ Sanity CMS (http://localhost:3334)

### **Expected output:**
```
🏥 FitFoot Health Check

✅ Next.js Frontend (Required)
   Status: UP (200)
   URL: http://localhost:3005

✅ Medusa Backend (Required)
   Status: UP (200)
   URL: http://localhost:9000/health

✅ Sanity CMS (Optional)
   Status: UP (200)
   URL: http://localhost:3334

🎉 All required services are healthy!
```

### **If services are down:**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev-web      # Frontend only
npm run dev-medusa   # Backend only
npm run dev-sanity   # CMS only
```

## 🔍 **2. Supabase Validation (`npm run validate-supabase`)**

**Purpose:** Comprehensive validation of Supabase integration  
**Duration:** 2 minutes  
**Use case:** After Supabase setup, before going live

### **What it validates:**

#### **Database Connection**
- ✅ Supabase PostgreSQL connectivity through Medusa
- ✅ API responses and database queries

#### **Data Persistence**
- ✅ Products are stored in Supabase (not in-memory)
- ✅ Swiss FitFoot products are available
- ✅ Data survives server restarts

#### **Medusa-Supabase Integration**
- ✅ `/store/products` endpoint
- ✅ `/store/regions` endpoint
- ✅ `/store/collections` endpoint

#### **Authentication System**
- ✅ Admin endpoints properly protected (401 expected)
- ✅ Store endpoints publicly accessible

#### **Swiss Business Logic**
- ✅ Sustainable product features
- ✅ Swiss-made product identification
- ✅ Proper pricing structure

### **Expected output:**
```
🔍 FitFoot Supabase Validation

--- Database Connection ---
🔗 Testing Supabase database connection...
✅ Database connection: HEALTHY

--- Data Persistence ---
💾 Testing data persistence...
✅ Data persistence: WORKING (5 Swiss products found)
   Products: Alpine Trek Pro, Zurich Urban, Basel Work, Matterhorn Winter, Geneva Formal

--- Medusa Integration ---
🏪 Testing Medusa-Supabase integration...
   ✅ /store/products: WORKING
   ✅ /store/regions: WORKING
   ✅ /store/collections: WORKING
✅ Medusa-Supabase integration: WORKING

--- Authentication ---
🔐 Testing authentication system...
✅ Authentication: WORKING (401 Unauthorized as expected)

--- Swiss Business Logic ---
🇨🇭 Testing Swiss business logic...
✅ Swiss business logic: IMPLEMENTED
   • Sustainable products: 5
   • Swiss-made products: 3
   • Products with pricing: 5

================================================
📊 Validation Results: 5/5 passed
🎉 ALL VALIDATIONS PASSED!
🚀 Your MedusaJS + Supabase integration is working perfectly!
```

## 🛒 **3. E2E Shopping Flow (`npm run test-e2e`)**

**Purpose:** Test complete customer shopping journey  
**Duration:** 3 minutes  
**Use case:** Before deployment, after major changes

### **Shopping workflow tested:**

1. **Browse Products** - Get product catalog
2. **Create Cart** - Initialize shopping session
3. **Add to Cart** - Add Swiss footwear to cart
4. **View Cart** - Verify cart contents
5. **Get Regions** - Fetch available shipping regions
6. **Set Cart Region** - Configure regional pricing
7. **Validate Totals** - Ensure pricing calculations work

### **Expected output:**
```
🛒 FitFoot E2E Shopping Flow Test

--- Browse Products ---
👉 Step 1: Browse Products
✅ Found 5 products, selected: Alpine Trek Pro - Swiss Made Hiking Boots

--- Create Cart ---
👉 Step 2: Create Shopping Cart
✅ Cart created successfully: cart_01HX...

--- Add to Cart ---
👉 Step 3: Add Product to Cart
✅ Product added to cart (1 items total)

--- View Cart ---
👉 Step 4: View Cart Contents
✅ Cart contains 1 items, total: 29900

--- Get Regions ---
👉 Step 5: Get Available Regions
✅ Found 1 regions, selected: Europe

--- Set Cart Region ---
👉 Step 6: Set Cart Region
✅ Cart region set to: Europe

--- Validate Totals ---
👉 Step 7: Validate Cart Totals
✅ Cart totals valid - Subtotal: 29900, Total: 29900

============================================================
🧪 SHOPPING FLOW TEST RESULTS
============================================================
📊 Steps completed: 7/7
✅ Passed: 7
❌ Failed: 0

🎉 COMPLETE SHOPPING FLOW WORKING!
🛒 Your e-commerce platform is ready for customers
```

## 🔬 **4. Full Integration Testing (`npm run test-integration`)**

**Purpose:** Comprehensive end-to-end system validation  
**Duration:** 5 minutes  
**Use case:** Production readiness check, CI/CD validation

### **Complete test suite:**
- **Service Health Checks** - All services responsive
- **API Endpoint Testing** - All Medusa APIs working
- **Database Connectivity** - Supabase integration verified
- **Frontend Integration** - Next.js connecting to backend
- **E2E Workflow** - Complete shopping journey
- **Supabase Validation** - Data persistence and business logic

## 🚨 **Troubleshooting Failed Tests**

### **Services Down**
```bash
# Problem: Health check fails
# Solution: Start services
npm run dev

# Check specific service
curl http://localhost:3005  # Frontend
curl http://localhost:9000/health  # Backend
curl http://localhost:3334  # CMS
```

### **Database Issues**
```bash
# Problem: Supabase validation fails
# Solution: Check database connection

# 1. Verify environment variables
cd apps/medusa && cat .env | grep DATABASE_URL

# 2. Test database connection
npm run migrate

# 3. Seed test data
npm run seed

# 4. Restart Medusa
npm run dev-medusa
```

### **No Products Found**
```bash
# Problem: "No products found" error
# Solution: Seed Swiss footwear products

npm run seed

# Verify products were created
curl http://localhost:9000/store/products
```

### **Authentication Issues**
```bash
# Problem: Admin endpoints not protected
# Solution: Check JWT/Cookie secrets

cd apps/medusa
grep -E "(JWT_SECRET|COOKIE_SECRET)" .env

# Ensure they're set to secure values (not defaults)
```

### **Regional Pricing Issues**
```bash
# Problem: Cart totals not calculating
# Solution: Check regions are configured

curl http://localhost:9000/store/regions

# If no regions, run migrations
npm run migrate
```

## 📊 **Test Results Interpretation**

### **✅ All Tests Pass**
```
🎉 Your FitFoot platform is production-ready!
✅ Database: Connected and persistent
✅ Authentication: Secure and working
✅ E-commerce: Complete shopping flow
✅ Swiss Features: Business logic implemented
🚀 Ready for deployment!
```

### **⚠️ Some Tests Fail**
```
Issues detected - review failed tests:
🔧 Fix database connectivity
🔧 Seed missing products
🔧 Configure authentication
💡 Run specific fixes and retest
```

### **❌ Many Tests Fail**
```
🚨 Major setup issues detected
🔧 Required actions:
   1. npm run setup-production
   2. Verify Supabase credentials
   3. Check all environment variables
   4. Restart all services
```

## 🎯 **Best Practices**

### **Development Workflow**
```bash
# 1. Before starting development
npm run health

# 2. After making backend changes
npm run validate-supabase

# 3. Before committing code
npm run test-e2e

# 4. Before deployment
npm run test-all
```

### **Continuous Integration**
```yaml
# Add to your CI/CD pipeline
- name: Health Check
  run: npm run health

- name: Integration Tests
  run: npm run test-integration

- name: E2E Tests
  run: npm run test-e2e
```

### **Performance Monitoring**
```bash
# Monitor test execution times
time npm run test-all

# Typical execution times:
# Health check: ~10 seconds
# Supabase validation: ~30 seconds
# E2E shopping: ~45 seconds
# Full integration: ~2 minutes
```

## 🔗 **Related Documentation**

- **[Production Migration Guide](PRODUCTION_MIGRATION_GUIDE.md)** - Set up Supabase
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design
- **[Development Status](DEVELOPMENT_STATUS.md)** - Current implementation

## ⚡ **Quick Reference**

| Command | Purpose | Duration | When to Use |
|---------|---------|----------|-------------|
| `npm run health` | Service status | 30s | Daily development |
| `npm run validate-supabase` | Database integrity | 2m | After DB changes |
| `npm run test-e2e` | Shopping workflow | 3m | Before commits |
| `npm run test-all` | Complete validation | 5m | Before deployment |
| `npm run test-integration` | Full system test | 5m | CI/CD pipeline |

---

**🎯 Ready to test your FitFoot platform?**

Start with: `npm run health` 