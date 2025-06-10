# 🛒 Medusa.js E-commerce Setup Guide

**Created:** 2024-12-28  
**Last Modified:** 2024-12-28  
**Last Modified Summary:** Updated with proper documentation metadata and structure

## Overview
Your Fitfoot website now includes a complete shop page with Medusa.js integration. The shop works with mock data by default and will automatically connect to your Medusa backend when configured.

## 🚀 Quick Start (Using Mock Data)

The shop is already functional with demo products! Visit `/shop` to see:
- 6 demo products (sneakers, bags, caps)
- Product filtering by category
- Individual product pages
- Add to cart functionality (UI only)
- Swiss pricing in CHF

## 🔧 Setting Up Medusa Backend

### 1. **Install Medusa CLI**
```bash
npm install -g @medusajs/medusa-cli
```

### 2. **Create Medusa Backend**
```bash
# Create new Medusa project
medusa new fitfoot-backend

# Navigate to backend
cd fitfoot-backend

# Start development server
npm run dev
```

### 3. **Configure Environment Variables**
Add to your `apps/web/.env.local`:
```env
# Medusa Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key_here
```

### 4. **Create Admin User**
```bash
cd fitfoot-backend
medusa user -e admin@fitfoot.com -p password123
```

### 5. **Access Medusa Admin**
- Backend: http://localhost:9000
- Admin Panel: http://localhost:7001
- Login with the credentials you created

## 📦 Adding Products

### Via Medusa Admin Panel:
1. Go to http://localhost:7001
2. Login with your admin credentials
3. Navigate to "Products" → "Add Product"
4. Fill in product details:
   - **Title**: Product name
   - **Handle**: URL slug (auto-generated)
   - **Description**: Product description
   - **Images**: Upload product photos
   - **Variants**: Set prices in CHF
   - **Collections**: Group products (sneakers, bags, caps)

### Via API (Programmatic):
```javascript
// Example: Add product via API
const product = await medusa.admin.products.create({
  title: "Alpine Sneaker",
  handle: "alpine-sneaker",
  description: "Premium leather sneakers designed in Switzerland",
  status: "published",
  variants: [{
    title: "Default",
    prices: [{
      amount: 24900, // CHF 249.00
      currency_code: "CHF"
    }]
  }]
})
```

## 🎨 Current Shop Features

### ✅ **Implemented**
- Product listing with filtering
- Individual product pages
- Shopping cart UI
- Swiss pricing (CHF)
- Responsive design
- Mock data fallback
- Error handling
- Loading states

### 🚧 **Next Steps** (Optional)
- Shopping cart functionality
- Checkout process
- Payment integration (Stripe)
- User authentication
- Order management
- Inventory tracking

## 🔗 Integration Points

### **Automatic Fallback**
The shop automatically detects if Medusa is available:
- ✅ **Medusa Connected**: Shows live products from your backend
- 🎭 **Mock Mode**: Shows demo products when Medusa is unavailable

### **Product Data Flow**
1. Shop page tries to fetch from Medusa
2. If successful: displays live products
3. If failed: displays mock products with notice
4. All UI components work in both modes

## 🛠️ Customization

### **Adding New Product Categories**
Update the collections in `/shop/page.tsx`:
```javascript
const mockCollections = [
  { id: 'all', title: 'All Products', handle: 'all' },
  { id: 'sneakers', title: 'Sneakers', handle: 'sneakers' },
  { id: 'bags', title: 'Bags', handle: 'bags' },
  { id: 'caps', title: 'Caps', handle: 'caps' },
  { id: 'accessories', title: 'Accessories', handle: 'accessories' } // New category
]
```

### **Modifying Product Display**
Edit `/shop/page.tsx` and `/shop/products/[handle]/page.tsx` to customize:
- Product card layout
- Pricing format
- Image display
- Product information

## 📱 Mobile Optimization

The shop is fully responsive and optimized for:
- Mobile phones (1-2 columns)
- Tablets (2-3 columns)
- Desktop (3-4 columns)
- Touch interactions
- Fast loading

## 🌍 Deployment Notes

### **Vercel Deployment**
The shop will work on Vercel with mock data immediately. To connect Medusa:

1. Deploy your Medusa backend (Railway, DigitalOcean, etc.)
2. Update environment variables in Vercel:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
   ```
3. Redeploy your Next.js app

### **Environment Variables for Production**
```env
# Production Medusa Configuration
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_live_your_publishable_key
```

## 🎯 Testing the Shop

1. **Visit the Shop**: Go to `/shop` on your website
2. **Filter Products**: Click category buttons to filter
3. **View Product**: Click "View Details" on any product
4. **Add to Cart**: Click "Add to Cart" (UI feedback only for now)
5. **Navigation**: Use breadcrumbs and navigation links

## 📞 Support

If you need help setting up Medusa or customizing the shop:
1. Check the [Medusa Documentation](https://docs.medusajs.com)
2. Review the code in `/shop/` directory
3. Test with mock data first
4. Gradually add real products

Your shop is production-ready with mock data and will seamlessly upgrade when you connect Medusa! 🚀 