# Fitfoot - Swiss-designed quality footwear

**Created:** 2024-12-28  
**Last Modified:** 2024-12-28  
**Last Modified Summary:** Updated with comprehensive documentation structure and improvement plan

A modern, fast marketing website for Fitfoot built with Next.js 14 and Sanity CMS.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **CMS**: Sanity Studio v3
- **Build System**: Turborepo (monorepo)
- **Package Manager**: npm workspaces

## 📁 Project Structure

```
fitfoot/
├── apps/
│   └── web/              # Next.js frontend application
├── packages/
│   └── sanity/           # Sanity Studio CMS
├── scripts/              # Utility scripts
├── package.json          # Root workspace configuration
└── turbo.json           # Turborepo configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.17.0 or higher
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitfoot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-05-27
   ```

4. **Start development servers**
   ```bash
   # Start all applications
   npm run dev
   
   # Or start individually:
   # Frontend only
   cd apps/web && npm run dev
   
   # Sanity Studio only
   npm run studio
   ```

## 🎨 Design System

### Brand Colors
- **Primary**: `#0E1216` (Dark charcoal)
- **Accent**: `#C82124` (Swiss red)
- **Neutral Light**: `#F8F8F8` (Light gray)

### Typography
- **Font**: Inter (system fallback: system-ui, sans-serif)

## 📝 Content Management

The project uses Sanity Studio for content management with the following schemas:

- **Product**: Footwear and accessories with images, descriptions, and specifications
- **Home Page**: Hero section, featured products, and call-to-action content
- **About Page**: Company story, team, and values
- **Contact Info**: Business details and contact information

### Accessing Sanity Studio

1. **Local development**: `npm run studio` (opens at http://localhost:3333)
2. **Production**: Deploy to studio.fitfoot.ch using `npm run deploy` in packages/sanity

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Sanity Studio
```bash
cd packages/sanity
npm run deploy
```

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Lint all packages
- `npm run type-check` - TypeScript type checking
- `npm run clean` - Clean all build artifacts
- `npm run studio` - Start Sanity Studio

### Frontend (apps/web)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - ESLint checking
- `npm run type-check` - TypeScript checking

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Prefer functional components with hooks

### Component Structure
- Place reusable UI components in `apps/web/src/components/ui/`
- Use shadcn/ui patterns for consistent styling
- Implement proper TypeScript interfaces

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography scale

## 🎯 Phase 1 Features (Current)

- ✅ Modern, responsive design
- ✅ Product showcase
- ✅ Content management with Sanity
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ **100% Test Coverage** (227/227 tests passing)
- ✅ **Production Monitoring** (Sentry error tracking)
- ✅ **Performance Monitoring** (Core Web Vitals + Lighthouse CI)
- ✅ **Health Monitoring** (/api/health endpoint)
- ✅ **Security Headers** (Production-ready security)

## 🔮 Future Phases

### Phase 2: E-commerce
- Shopping cart functionality
- Stripe payment integration
- Order management
- User accounts

### Phase 3: Internationalization
- Multi-language support (DE, FR, IT)
- Localized content
- Regional pricing

## 📞 Support

For questions or issues, please contact the development team or create an issue in the repository.

---

## 📚 Documentation

For comprehensive documentation, see our [Documentation Hub](./docs/README.md):

- **[🚀 Quick Start](./docs/getting-started/quick-start.md)** - Get up and running quickly
- **[🏛️ System Architecture](./docs/architecture/system-overview.md)** - Understand the system design
- **[🧪 Testing Strategy](./TESTING_PROGRESS.md)** - Complete testing implementation (100% pass rate)
- **[📊 Production Monitoring](./PRODUCTION_MONITORING.md)** - Error tracking and performance monitoring
- **[🚀 Improvement Plan](./IMPROVEMENT_PLAN.md)** - Comprehensive system improvement roadmap

## 🔍 Code Review Status

The system has undergone a comprehensive code review. Key findings:

- **System Design:** B+ (7.5/10) - Strong architectural foundations
- **Software Architecture:** B (7/10) - Clean layered architecture
- **Data Structures & Algorithms:** B- (6.5/10) - Well-defined types
- **Testing:** D (3/10) - **Critical gap requiring immediate attention**

See [IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md) for detailed improvement roadmap.

---

**Fitfoot** - Step into quality. Designed in Switzerland.