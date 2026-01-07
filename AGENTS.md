# AGENTS.md - FitFoot

> Universal guide for AI coding agents (Claude, Codex, Gemini, Cursor)

## Project Overview

**FitFoot** is a Swiss sustainable footwear e-commerce platform built as a Turborepo monorepo.

| Aspect | Details |
|--------|---------|
| Type | E-commerce monorepo |
| Storefront | Next.js, TypeScript, Tailwind |
| CMS | Sanity Studio |
| Commerce | Medusa.js |
| Build System | Turborepo |
| Database | Supabase (PostgreSQL) |

## Quick Commands

```bash
# Development
npm run dev              # All services
npm run dev-web          # Storefront only (port 3005)
npm run dev-sanity       # CMS only (port 3334)
npm run dev-medusa       # Backend only (port 9000)
npm run open             # Open all in browser

# Testing
npm run test             # All tests
npm run test-all         # Integration tests
npm run test-e2e         # E2E shopping flow
npm run health           # Health check

# Database
npm run migrate          # Run Medusa migrations
npm run seed             # Seed products

# Deployment
./scripts/deploy.sh      # Deploy (alias: npm run w)
./scripts/monitor-status.sh  # Check deployment monitor
```

## Project Structure

```
fitfoot/
├── apps/
│   ├── web/                # Next.js storefront
│   │   ├── src/
│   │   │   ├── app/       # App Router pages
│   │   │   ├── components/# UI components
│   │   │   └── lib/       # Utilities, API clients
│   │   └── package.json
│   ├── sanity/             # Sanity CMS Studio
│   │   ├── schemas/       # Content schemas
│   │   └── package.json
│   └── medusa/             # Medusa commerce
│       ├── src/
│       │   ├── api/       # API routes
│       │   └── services/  # Business logic
│       └── package.json
├── packages/               # Shared packages
├── scripts/                # Deploy, monitor
└── turbo.json              # Turborepo config
```

## Code Style Guidelines

### Next.js Storefront
```typescript
// apps/web/src/components/ProductCard.tsx
interface ProductCardProps {
  product: MedusaProduct;
  sanityContent?: SanityProductContent;
}

export function ProductCard({ product, sanityContent }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{product.title}</h3>
      {sanityContent?.description && (
        <p>{sanityContent.description}</p>
      )}
    </div>
  );
}
```

### Sanity Schema
```typescript
// apps/sanity/schemas/product.ts
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'description', type: 'text' },
    { name: 'medusaId', type: 'string' },
  ],
};
```

## Key Patterns

### 1. Data Combination
Storefront combines Medusa (commerce) + Sanity (content):
```typescript
// apps/web/src/lib/products.ts
export async function getProductWithContent(handle: string) {
  const [medusaProduct, sanityContent] = await Promise.all([
    fetchMedusaProduct(handle),
    fetchSanityContent(handle),
  ]);
  return { ...medusaProduct, content: sanityContent };
}
```

### 2. Workspace Dependencies
Use Turborepo for cross-workspace imports:
```json
// apps/web/package.json
{
  "dependencies": {
    "@fitfoot/types": "workspace:*"
  }
}
```

### 3. Deployment Monitoring
Automated deployment system - keep it running:
```bash
./scripts/start-monitor.sh
tail -f logs/deployment-monitor.log
```

## Don't

- Import directly between apps (use packages/)
- Run apps directly without Turborepo
- Skip the deployment monitor
- Mix Sanity and Medusa responsibilities
- Commit .env files

## Pre-Commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm run health` all services healthy
- [ ] Deployment monitor running

---

**Last Updated**: 2026-01-08
