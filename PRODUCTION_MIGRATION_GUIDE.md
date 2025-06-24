# FitFoot Production Migration Guide

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Complete step-by-step guide for Supabase migration

## 🚀 **Quick Start: 30 Minutes to Production**

### **Step 1: Create Supabase Project (10 minutes)**

1. **Visit Supabase Dashboard**
   ```bash
   # Open in browser
   https://supabase.com/dashboard
   ```

2. **Create New Project**
   - Click "New Project"
   - Name: `fitfoot-production`
   - Generate a strong password (save it!)
   - Choose region: `EU Central (eu-central-1)` for Swiss users
   - Click "Create new project"

3. **Get Your Credentials**
   ```bash
   # Go to Settings > Database
   # Copy: Connection string (looks like this)
   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
   
   # Go to Settings > API  
   # Copy: Project URL and anon key
   ```

### **Step 2: Configure Medusa Backend (10 minutes)**

1. **Navigate to Medusa Directory**
   ```bash
   cd apps/medusa
   ```

2. **Set Up Environment**
   ```bash
   # Create .env from template
   ./setup-supabase.sh
   ```

3. **Edit .env File**
   ```bash
   # Replace [PASSWORD] and [PROJECT_REF] with your values
   nano .env
   
   # Example:
   DATABASE_URL=postgresql://postgres:your_password@db.abcdefg.supabase.co:5432/postgres
   SUPABASE_URL=https://abcdefg.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Step 3: Initialize Database (10 minutes)**

1. **Run Setup Script**
   ```bash
   # This will install deps, run migrations, create admin user, and seed data
   ./setup-supabase.sh
   ```

2. **Create Admin Account**
   ```bash
   # When prompted, enter:
   Email: admin@fitfoot.ch
   Password: [choose secure password]
   ```

### **Step 4: Configure Frontend**

1. **Navigate to Web Directory**
   ```bash
   cd ../web
   ```

2. **Set Up Frontend Environment**
   ```bash
   # Create .env.local from template
   cp env.template .env.local
   
   # Edit with your Supabase credentials
   nano .env.local
   ```

3. **Update Frontend Environment**
   ```env
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### **Step 5: Start Production Setup**

1. **Start All Services**
   ```bash
   # From root directory
   cd ../../
   npm run dev
   ```

2. **Verify Everything Works**
   ```bash
   # Check these URLs:
   http://localhost:3005        # Storefront
   http://localhost:9000/admin  # Medusa Admin
   http://localhost:3334        # Sanity CMS
   ```

## ✅ **Verification Checklist**

### **Backend (MedusaJS)**
- [ ] Database connected to Supabase PostgreSQL
- [ ] Admin user created and can login
- [ ] API endpoints responding at http://localhost:9000
- [ ] Seed data loaded (products visible in admin)

### **Frontend (Next.js)**
- [ ] Connecting to real Medusa backend (not mock)
- [ ] Products loading from database
- [ ] Cart functionality working
- [ ] Admin interface accessible

### **Data Persistence**
- [ ] Products persist after server restart
- [ ] Cart data maintains state
- [ ] User sessions work properly
- [ ] Orders are stored in database

## 🎯 **What Changes vs Mock Backend**

### **Before (Mock)**
```
├── In-memory data storage
├── Data lost on restart  
├── No real authentication
├── Limited functionality
└── Development only
```

### **After (Production)**
```
├── PostgreSQL database via Supabase
├── Persistent data storage
├── Real authentication system
├── Full e-commerce features
├── Production-ready scalability
├── Real payment processing capability
└── Order management system
```

## 🔧 **Troubleshooting**

### **Database Connection Issues**
```bash
# Test database connection
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Check environment variables
cd apps/medusa && cat .env | grep DATABASE_URL
```

### **Admin Login Issues**
```bash
# Reset admin user
cd apps/medusa
npx medusa user -e admin@fitfoot.ch -p newpassword
```

### **Frontend Not Connecting**
```bash
# Check backend is running
curl http://localhost:9000/health

# Check environment variables
cd apps/web && cat .env.local | grep MEDUSA_BACKEND_URL
```

## 🚀 **Next Steps After Migration**

### **Immediate (This Week)**
1. **Customize for Swiss Market**
   - Add Swiss payment methods (Twint, PostFinance)
   - Configure Swiss shipping (Swiss Post)
   - Set up Swiss tax rates

2. **Add Swiss-Specific Features**
   - Brand module for Swiss manufacturers
   - Sustainability tracking
   - Carbon footprint calculation

### **Short Term (2-4 weeks)**
1. **Production Deployment**
   - Deploy to Vercel/Railway/DigitalOcean
   - Set up custom domain
   - Configure SSL certificates

2. **Enhanced Features**
   - Email notifications
   - Advanced analytics
   - Customer reviews system

### **Medium Term (1-2 months)**
1. **Business Features**
   - Multi-language (German, French, Italian)
   - B2B wholesale pricing
   - Loyalty program

2. **Integrations**
   - Swiss accounting software
   - Local shipping providers
   - Swiss payment gateways

## 📊 **Performance Improvements**

### **Before Migration**
- ❌ No data persistence
- ❌ Memory limitations
- ❌ Single-user development
- ❌ No real commerce features

### **After Migration**
- ✅ Persistent PostgreSQL database
- ✅ Multi-user support
- ✅ Real authentication
- ✅ Full e-commerce functionality
- ✅ Production scalability
- ✅ Advanced query capabilities
- ✅ Real-time data updates

## 🎉 **Success Indicators**

You'll know the migration is successful when:

1. **Data Persists**: Products and orders survive server restarts
2. **Real Authentication**: Admin login with proper session management
3. **Database Queries**: Complex product searches and filtering work
4. **Scalability**: Can handle multiple concurrent users
5. **Production Features**: Payment processing, order management, inventory tracking

---

**🎯 Total Time Investment: 30 minutes**  
**🚀 Result: Production-ready e-commerce platform**  
**💡 Benefit: Real business validation capability**

Ready to start? Run the first command: `cd apps/medusa && ./setup-supabase.sh` 