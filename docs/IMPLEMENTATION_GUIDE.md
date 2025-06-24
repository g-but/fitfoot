# FitFoot Implementation Guide: NextJS + MedusaJS + Supabase

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-06-17  
**Last Modified Summary:** Switched to Supabase Supavisor (IPv4) pooler connection for DATABASE_URL and updated env instructions

## 🎯 **Objective**

Transform FitFoot from mock backend to production-ready **NextJS + MedusaJS + Supabase** e-commerce platform.

## ⚡ **Quick Start (30 minutes)**

### **Step 1: Create Supabase Project (10 minutes)**

1. **Go to https://supabase.com/dashboard**
2. **Create New Project:**
   - Name: `fitfoot-production`
   - Password: Generate strong password (save it!)
   - Region: Europe West (for Swiss users)

3. **Save These Credentials:**
   ```
   Project URL: https://[project-id].supabase.co
   Anon Key: eyJ... (public key)
   Service Role Key: eyJ... (secret key)
   Database Password: [your-password]
   ```

4. **Enable Extensions:**
   - Go to Database > Extensions
   - Enable: `uuid-ossp`, `pg_stat_statements`

### **Step 2: Configure Environment (5 minutes)**

Create `.env.local` in project root:

```bash
# === NextJS Frontend ===
NEXT_PUBLIC_SITE_URL=http://localhost:3005
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# === Supabase Configuration ===
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# === Database (Supabase PostgreSQL) ===
DATABASE_URL=postgresql://postgres.[project-id]:[your-password]@aws-0-[region].pooler.supabase.com:6543/postgres

# === Authentication ===
JWT_SECRET=[generate-32-char-secret]
COOKIE_SECRET=[generate-32-char-secret]

# === CORS Configuration ===
STORE_CORS=http://localhost:3005
ADMIN_CORS=http://localhost:3005
AUTH_CORS=http://localhost:3005

# === Sanity CMS ===
NEXT_PUBLIC_SANITY_PROJECT_ID=m6r6y2se
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-27
SANITY_AUTH_REDIRECT_URL=http://localhost:3334/api/auth

# === Development ===
NODE_ENV=development
```

### **Step 3: Initialize Database (10 minutes)**

```bash
# Install dependencies
npm install

# Build Medusa backend
cd apps/medusa
npm run build

# Run database migrations
npx medusa migrations run

# Create admin user
npx medusa user create
# Enter: admin@fitfoot.com and secure password

# Go back to project root
cd ../..
```

### **Step 4: Start All Services (5 minutes)**

```bash
npm run dev
```

**Expected Result:**
- ✅ NextJS Frontend: http://localhost:3005
- ✅ Medusa Backend: http://localhost:9000
- ✅ Sanity CMS: http://localhost:3334

### **Step 5: Verify Setup**

1. **Test API:** `curl http://localhost:9000/health`
2. **Test Frontend:** Visit http://localhost:3005
3. **Test Admin:** Visit http://localhost:3005/admin (login with admin user)
4. **Test CMS:** Visit http://localhost:3334

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. "SASL: client password must be a string"**
- Fix: Check DATABASE_URL format in .env.local
- Ensure password doesn't contain special characters that need escaping

**2. "TypeError: path argument undefined"**
- Fix: Missing environment variables
- Solution: Ensure .env.local is in project root with all required variables

**3. "Port already in use"**
- Fix: Kill existing processes
```bash
pkill -f "medusa|next|sanity"
npm run dev
```

**4. "Database connection refused"**
- Fix: Check Supabase project is running
- Verify DATABASE_URL format is correct

### **Debug Commands:**

```bash
# Check environment variables
cat .env.local

# Test database connection
psql "postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"

# Check running processes
ps aux | grep -E "(medusa|next|sanity)"

# Check ports
netstat -tlnp | grep -E ":900[05]|:333[34]"
```

## 🗄️ **Database Management**

### **Reset Database (if needed):**
```bash
cd apps/medusa
npx medusa migrations revert --all
npx medusa migrations run
npx medusa user create
```

### **Seed Sample Data:**
```bash
cd apps/medusa
npx medusa exec ./src/scripts/seed.ts
```

## 🚀 **Production Deployment**

### **Environment Variables for Production:**
- Update all `localhost` URLs to production domains
- Use strong, unique JWT and COOKIE secrets
- Set `NODE_ENV=production`
- Configure proper CORS origins

### **Database:**
- Supabase handles backups automatically
- Consider upgrading to paid plan for production

### **Hosting Options:**
- **Frontend:** Vercel, Netlify
- **Backend:** Railway, Render, DigitalOcean
- **Database:** Supabase (already configured)

## 📊 **Architecture Overview**

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   MedusaJS      │    │     Sanity      │
│   Frontend      │◄──►│   Backend       │    │     CMS         │
│   :3005         │    │    :9000        │    │    :3334        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     Supabase              │
                    │   PostgreSQL DB           │
                    │  + Authentication         │
                    └───────────────────────────┘
```

## ✅ **Success Checklist**

- [ ] Supabase project created and configured
- [ ] Environment variables properly set in `.env.local`
- [ ] Database migrations completed successfully
- [ ] Admin user created and can login
- [ ] All services start with `npm run dev`
- [ ] Frontend loads at http://localhost:3005
- [ ] Backend responds at http://localhost:9000/health
- [ ] Admin interface works at http://localhost:3005/admin
- [ ] Sanity CMS loads at http://localhost:3334
- [ ] Can add/edit products via admin interface
- [ ] No console errors in browser or terminal

## 🎉 **What You Get**

After successful setup:
- ✅ **Production-ready e-commerce platform**
- ✅ **Real PostgreSQL database** (Supabase)
- ✅ **Scalable architecture** (handles thousands of products/customers)
- ✅ **Admin interface** for product management
- ✅ **Customer authentication** and profiles
- ✅ **Order processing** and management
- ✅ **Content management** via Sanity CMS
- ✅ **Swiss-focused** sustainable footwear platform

---

**Next Action:** Create your Supabase project and follow Step 1 above! 🚀