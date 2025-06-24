# FitFoot Architecture & Development Guide

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Production migration setup completed with Supabase integration scripts

## 🏗️ **System Architecture**

FitFoot is a modern e-commerce platform built with a headless architecture:

**🚨 CURRENT (Mock) - Being Migrated:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │  Mock Medusa    │    │     Sanity      │
│   Frontend      │◄──►│   Backend       │    │     CMS         │
│   :3005         │    │    :9000        │    │    :3334        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**🎯 TARGET (Production-Ready):**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js       │    │   Real Medusa   │    │     Sanity      │
│   Frontend      │◄──►│    Backend      │    │     CMS         │
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

### **Core Services**

1. **Frontend (Next.js)** - Port 3005
   - Customer-facing storefront
   - Marketing pages  
   - Admin interface
   - Sentry integration for error tracking

2. **Backend (Mock Medusa)** - Port 9000
   - E-commerce API endpoints
   - Product management
   - Cart and checkout
   - Simple in-memory data (development)

3. **CMS (Sanity)** - Port 3334
   - Content management
   - Product images and descriptions
   - Marketing content

## 🚀 **Quick Start**

### **Development Environment**
```bash
# Start all services
npm run dev

# Or use the dashboard
npm run dev-dashboard
```

### **Individual Services**
```bash
npm run dev-web      # Frontend only
npm run dev-sanity   # CMS only  
npm run dev-medusa   # Backend only
```

### **Service URLs**
- **Frontend**: http://localhost:3005
- **Shop**: http://localhost:3005/shop
- **Admin**: http://localhost:3005/admin
- **API**: http://localhost:9000
- **Sanity**: http://localhost:3334

## 🛠️ **Development Workflow**

### **Starting Development**
1. Run `npm run dev` to start all services
2. Visit http://localhost:3005 for the main site
3. Use http://localhost:3005/admin for product management
4. Use http://localhost:3334 for content management

### **Working with Products**
- **Add products**: Use the admin interface at `/admin`
- **Content**: Manage in Sanity Studio
- **Data**: Stored in mock backend (resets on restart)

### **Error Tracking**
- Errors are automatically tracked via Sentry
- Check console for development errors
- Production errors appear in Sentry dashboard

## 🔧 **Configuration**

### **Environment Variables**
Copy `env.example` to `.env.local` in the web app:

```bash
# Frontend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### **Port Configuration**
Ports are configured to avoid conflicts:
- Next.js: 3005 (not 3000 to avoid conflicts)
- Mock Medusa: 9000
- Sanity: 3334

## 📁 **Project Structure**

```
fitfoot/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── medusa/              # Real MedusaJS backend
├── packages/
│   └── sanity/              # Sanity CMS configuration
├── docs/                    # Documentation (consolidated)
├── scripts/                 # Development utilities
└── package.json             # Monorepo configuration
```

## 🚀 **Production Upgrade Path**

When ready for production, you can upgrade to real Medusa:

### **Phase 1: Infrastructure**
- Set up PostgreSQL database
- Configure Redis for caching
- Set up proper environment variables

### **Phase 2: Backend Migration**
- Install full Medusa backend
- Migrate mock data to real database
- Update API endpoints if needed

### **Phase 3: Deployment**
- Deploy to production environment
- Configure proper domains
- Set up monitoring and backups

## 🏷️ **Development Commands**

### **Primary Commands**
- `npm run dev` - Start all services
- `npm run dev-dashboard` - Start with interactive dashboard
- `npm run build` - Build all applications

### **Service-Specific Commands**
- `npm run dev-web` - Frontend development server
- `npm run dev-sanity` - Sanity Studio  
- `npm run dev-medusa` - Mock backend only

### **Utility Commands**
- `npm run lint` - Check code quality
- `npm run test` - Run tests
- `npm run clean` - Clean build artifacts

## 🔍 **Troubleshooting**

### **Port Conflicts**
If you get "port already in use" errors:
```bash
# Check what's using the ports
lsof -i :3005 :9000 :3334

# Kill any stale processes
pkill -f "medusa|next|sanity"

# Restart services
npm run dev
```

### **Service Not Starting**
1. Check if all dependencies are installed: `npm install`
2. Verify environment variables are set
3. Check for error messages in the console
4. Try starting services individually

### **Data Not Loading**
1. Verify the mock backend is running on port 9000
2. Check browser network tab for API errors
3. Ensure CORS is properly configured
4. Check Sanity configuration for CMS content

## 📋 **Best Practices**

### **Code Quality**
- Use TypeScript for type safety
- Follow DRY principles
- Write meaningful component names
- Add proper error handling

### **Performance**
- Optimize images through Next.js
- Use proper caching strategies
- Monitor Core Web Vitals
- Implement proper loading states

### **Security**
- Sanitize user inputs
- Use environment variables for secrets
- Implement proper authentication
- Regular dependency updates

---

**Next Steps**: Choose your preferred development approach from the options below.