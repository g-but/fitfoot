# FitFoot Medusa Backend

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** FitFoot-specific Medusa backend configuration and setup

---

## 🛒 **FitFoot E-commerce Backend**

This is the MedusaJS backend for FitFoot, configured specifically for Swiss sustainable footwear e-commerce.

## 🚀 **Quick Start**

### **For Complete Setup Instructions**
👉 **See [Main Documentation](../../docs/README.md)** for comprehensive setup guide

### **Start Backend Only**
```bash
# From project root
npm run dev-medusa

# Or from this directory
npm run dev
```

## 🎯 **FitFoot-Specific Configuration**

### **Swiss E-commerce Features**
- **Currency**: Swiss Francs (CHF)
- **Tax Configuration**: Swiss VAT rates
- **Shipping**: Swiss Post integration ready
- **Payment**: Configured for Swiss payment methods (Twint, PostFinance)

### **Sustainability Features**
- **Carbon Footprint Tracking**: Custom module for environmental impact
- **Sustainable Brands**: Brand module with sustainability ratings
- **Eco-friendly Shipping**: Green shipping options

### **Database Configuration**
- **Production**: Supabase PostgreSQL
- **Development**: Supabase (same as production)
- **Local Testing**: SQLite fallback (if needed)

## 📋 **Available Scripts**

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed with FitFoot data
npm run db:reset         # Reset database

# Testing
npm run test             # Run test suite
npm run test:integration # Integration tests
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```env
# Database
DATABASE_URL=postgresql://postgres:password@host:port/database

# Application
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
PORT=9000

# Supabase (for auth integration)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### **Setup Script**
```bash
# Automated setup with Supabase
./setup-supabase.sh
```

## 🏗️ **Architecture**

### **Custom Modules**
```
src/
├── modules/
│   ├── sustainability/     # Carbon footprint tracking
│   ├── swiss-payments/     # Swiss payment methods
│   ├── brand-management/   # Sustainable brand features
│   └── shipping-swiss/     # Swiss Post integration
├── workflows/
│   ├── order-processing/   # Swiss-specific order flow
│   └── sustainability/     # Environmental impact calculation
└── subscribers/
    ├── order-events/       # Order lifecycle events
    └── analytics/          # Business intelligence
```

## 📊 **API Endpoints**

### **Core E-commerce**
- `GET /store/products` - Product catalog
- `POST /store/carts` - Shopping cart management
- `POST /store/orders` - Order processing
- `GET /store/customers` - Customer management

### **FitFoot-Specific**
- `GET /store/sustainability` - Product sustainability data
- `GET /store/swiss-shipping` - Swiss shipping options
- `POST /store/carbon-footprint` - Calculate environmental impact

### **Admin Interface**
- `http://localhost:9000/app` - Medusa Admin UI
- Admin credentials configured during setup

## 🔍 **Health Monitoring**

### **Health Check**
```bash
curl http://localhost:9000/health
```

### **Monitoring Endpoints**
- `/health` - Basic health check
- `/metrics` - Prometheus metrics
- `/admin/health` - Detailed system status

## 🚨 **Troubleshooting**

### **Common Issues**

**Database Connection Failed**
```bash
# Check environment variables
cat .env | grep DATABASE_URL

# Test connection
npm run db:test-connection
```

**Port Already in Use**
```bash
# Find process using port 9000
lsof -i :9000

# Kill process if needed
kill -9 <PID>
```

**Migration Errors**
```bash
# Reset and re-run migrations
npm run db:reset
npm run db:migrate
```

## 📚 **Documentation**

### **Complete Documentation**
- **[Main Documentation](../../docs/README.md)** - Complete setup and usage
- **[Architecture Guide](../../docs/ARCHITECTURE.md)** - System design
- **[Production Migration](../../PRODUCTION_MIGRATION_GUIDE.md)** - Production setup
- **[Database Schema](../../SUPABASE_SCHEMA.md)** - Database structure

### **Development**
- **[Scripts Documentation](../../scripts/README.md)** - Development utilities
- **[Testing Guide](../../TESTING_GUIDE.md)** - Testing strategies
- **[AI Development Rules](../../docs/ai/CODEBASE_RULES.md)** - Development standards

## 🔗 **Related Services**

### **Frontend**
- **Location**: `../web/`
- **Port**: 3005
- **Documentation**: [Frontend README](../web/README.md)

### **CMS**
- **Location**: `../../packages/sanity/`
- **Port**: 3334
- **Documentation**: [Sanity README](../../packages/sanity/README.md)

## 🎯 **Swiss Business Features**

### **Compliance**
- **VAT**: Swiss tax calculation
- **Privacy**: GDPR/Swiss data protection compliance
- **Accessibility**: Swiss accessibility standards

### **Localization**
- **Languages**: German, French, Italian (planned)
- **Currency**: Swiss Francs (CHF)
- **Shipping**: Swiss Post integration
- **Payments**: Local payment methods

---

## 🚀 **Next Steps**

1. **Complete Setup**: Follow [Implementation Guide](../../docs/IMPLEMENTATION_GUIDE.md)
2. **Understand Architecture**: Read [Architecture Guide](../../docs/ARCHITECTURE.md)
3. **Start Development**: Use [Development Scripts](../../scripts/README.md)
4. **Deploy to Production**: Follow [Production Migration](../../PRODUCTION_MIGRATION_GUIDE.md)

---

**💡 This backend is specifically configured for FitFoot's Swiss sustainable footwear e-commerce needs. For complete documentation and setup instructions, see the main project documentation.**
