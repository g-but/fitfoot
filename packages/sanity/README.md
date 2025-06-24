# FitFoot Sanity CMS

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** FitFoot-specific Sanity CMS configuration and content management

---

## 📝 **FitFoot Content Management System**

This is the Sanity CMS for FitFoot, configured specifically for Swiss sustainable footwear e-commerce content management.

## 🚀 **Quick Start**

### **For Complete Setup Instructions**
👉 **See [Main Documentation](../../docs/README.md)** for comprehensive setup guide

### **Start CMS Only**
```bash
# From project root
npm run dev-sanity

# Or from this directory
npm run dev
```

### **Access Sanity Studio**
- **URL**: http://localhost:3334
- **Production**: https://fitfoot.sanity.studio

## 🎯 **FitFoot Content Structure**

### **Content Types**
```
schemas/
├── product.ts              # Footwear products
├── homePage.ts            # Homepage content
├── aboutPage.ts           # Company & sustainability info
├── contactPage.ts         # Contact information
├── productsPage.ts        # Product catalog pages
├── siteSettings.ts        # Global site configuration
├── contactInfo.ts         # Contact details
└── blockContent.ts        # Rich text content
```

### **Swiss-Specific Content**
- **Sustainability Stories**: Environmental impact content
- **Swiss Brand Features**: Local manufacturer profiles
- **Multi-language Support**: German, French, Italian (planned)
- **Swiss Contact Information**: Local addresses and phone numbers

## 📋 **Available Scripts**

```bash
# Development
npm run dev              # Start Sanity Studio
npm run build            # Build for production
npm run deploy           # Deploy to Sanity

# Content Management
npm run populate         # Populate with sample content
npm run export           # Export content
npm run import           # Import content

# Schema Management
npm run schema:extract   # Extract schema definitions
npm run schema:deploy    # Deploy schema changes
```

## 🏗️ **Content Architecture**

### **Page Structure**
```typescript
// Homepage
interface HomePage {
  hero: HeroSection
  featuredProducts: Product[]
  sustainabilityHighlight: SustainabilityContent
  testimonials: CustomerTestimonial[]
}

// Product Content
interface Product {
  title: string
  slug: string
  images: SanityImageAsset[]
  description: PortableText
  sustainabilityInfo: SustainabilityData
  swissManufacturer?: SwissManufacturer
}

// Site Settings
interface SiteSettings {
  logo: LogoConfiguration
  navigation: NavigationItem[]
  footer: FooterConfiguration
  contact: ContactInformation
}
```

### **Sustainability Content**
```typescript
interface SustainabilityData {
  carbonFootprint: number
  materials: SustainableMaterial[]
  certifications: Certification[]
  manufacturingLocation: string
  recyclingInfo: string
}
```

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```env
# Sanity Configuration
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Authentication
SANITY_TOKEN=your-auth-token

# Preview (for frontend)
SANITY_PREVIEW_SECRET=your-preview-secret
```

### **Setup Script**
```bash
# Initialize Sanity project
npx sanity init

# Deploy schemas
npm run schema:deploy
```

## 📊 **Content Management Features**

### **Content Types Available**
- **Products**: Footwear catalog with sustainability data
- **Pages**: Homepage, About, Contact, Product listings
- **Site Settings**: Global configuration and navigation
- **Media**: Image and document management
- **SEO**: Meta tags and structured data

### **Swiss E-commerce Features**
- **Multi-currency Support**: CHF pricing
- **Sustainability Tracking**: Environmental impact data
- **Local Brand Profiles**: Swiss manufacturer information
- **Regional Content**: Location-specific information

## 🎨 **Content Creation Workflow**

### **Adding New Products**
1. **Navigate to Products** in Sanity Studio
2. **Create New Product** with required fields
3. **Add Sustainability Data** (carbon footprint, materials)
4. **Upload Images** with proper alt text
5. **Set SEO Information** for search optimization
6. **Publish** to make live on website

### **Managing Homepage Content**
1. **Go to Pages → Homepage**
2. **Update Hero Section** with seasonal content
3. **Select Featured Products** from product catalog
4. **Add Sustainability Highlights** for brand messaging
5. **Update Customer Testimonials**
6. **Save and Publish**

## 🔍 **Content Preview**

### **Preview Integration**
- **Live Preview**: See changes in real-time on frontend
- **Draft Mode**: Preview unpublished content
- **Mobile Preview**: Test responsive design

### **Preview URLs**
```bash
# Homepage preview
https://fitfoot.ch/api/preview?slug=/

# Product preview
https://fitfoot.ch/api/preview?slug=/products/[slug]

# Page preview
https://fitfoot.ch/api/preview?slug=/[page-slug]
```

## 🚨 **Content Guidelines**

### **Image Requirements**
- **Product Images**: Minimum 1200x1200px, WebP preferred
- **Hero Images**: 1920x1080px for optimal display
- **Alt Text**: Required for all images (accessibility)
- **File Size**: Optimize for web (< 500KB recommended)

### **SEO Best Practices**
- **Title Tags**: 50-60 characters
- **Meta Descriptions**: 150-160 characters
- **Product Descriptions**: Include sustainability keywords
- **URL Slugs**: Use Swiss German terms where appropriate

### **Content Standards**
- **Sustainability Focus**: Highlight environmental benefits
- **Swiss Context**: Include local relevance
- **Accessibility**: Use clear, simple language
- **Brand Voice**: Professional yet approachable

## 📚 **Documentation**

### **Complete Documentation**
- **[Main Documentation](../../docs/README.md)** - Complete setup and usage
- **[Architecture Guide](../../docs/ARCHITECTURE.md)** - System design
- **[Implementation Guide](../../docs/IMPLEMENTATION_GUIDE.md)** - Setup instructions

### **Content Management**
- **[Content Strategy Guide](../../docs/content/CONTENT_STRATEGY.md)** - Content planning (planned)
- **[SEO Guidelines](../../docs/content/SEO_GUIDELINES.md)** - Search optimization (planned)
- **[Brand Guidelines](../../docs/content/BRAND_GUIDELINES.md)** - Brand voice and style (planned)

## 🔗 **Integration with Other Services**

### **Frontend Integration**
- **Location**: `../../apps/web/`
- **Connection**: Real-time content updates
- **Preview**: Live preview functionality

### **Backend Integration**
- **Location**: `../../apps/medusa/`
- **Data Sync**: Product information synchronization
- **API**: Content delivery via Sanity API

## 🎯 **Swiss Content Features**

### **Localization Ready**
- **Languages**: German (primary), French, Italian (planned)
- **Currency**: Swiss Francs (CHF)
- **Contact**: Swiss addresses and phone numbers
- **Legal**: Swiss privacy policy and terms

### **Sustainability Content**
- **Environmental Impact**: Carbon footprint tracking
- **Certifications**: Sustainability certifications
- **Local Manufacturing**: Swiss and European suppliers
- **Circular Economy**: Recycling and repair information

## 🔧 **Content Maintenance**

### **Regular Tasks**
- **Update Featured Products**: Weekly rotation
- **Review SEO Performance**: Monthly analysis
- **Update Sustainability Data**: Quarterly review
- **Backup Content**: Automated daily backups

### **Content Monitoring**
- **Performance Tracking**: Page load times
- **SEO Monitoring**: Search ranking tracking
- **User Engagement**: Content interaction analytics
- **Error Monitoring**: Broken links and missing images

---

## 🚀 **Next Steps**

1. **Access Studio**: Visit http://localhost:3334
2. **Learn Content Types**: Explore the schema structure
3. **Create Content**: Add products and pages
4. **Preview Changes**: Use live preview functionality
5. **Publish Content**: Make content live on website

---

**💡 This CMS is specifically configured for FitFoot's Swiss sustainable footwear content needs. For complete documentation and setup instructions, see the main project documentation.**
