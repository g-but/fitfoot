# FitFoot - Swiss Sustainable Footwear Platform

## Overview

FitFoot is a **Turborepo monorepo** e-commerce platform for Swiss-designed sustainable footwear. It combines Next.js storefront, Sanity CMS, and Medusa commerce backend.

## Architecture

```
fitfoot/
├── apps/
│   ├── web/             # Next.js storefront (port 3005)
│   ├── sanity/          # Sanity Studio CMS (port 3334)
│   └── medusa/          # Medusa backend (port 9000)
├── packages/            # Shared packages
├── scripts/             # Deployment, monitoring
└── turbo.json           # Turborepo config
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Storefront | Next.js, React, TypeScript, Tailwind |
| CMS | Sanity Studio |
| Commerce | Medusa.js |
| Build | Turborepo |
| Database | Supabase (PostgreSQL) |

## Quick Start

```bash
# Start all services
npm run dev
# Web: http://localhost:3005
# Sanity: http://localhost:3334
# Medusa: http://localhost:9000

# Individual services
npm run dev-web
npm run dev-sanity
npm run dev-medusa

# Open all in browser
npm run open
```

## Critical Rules

### 1. Monorepo Workspaces
- Each app is independent: `apps/web`, `apps/sanity`, `apps/medusa`
- Shared code goes in `packages/`
- Use Turborepo for orchestration

### 2. Code Locations

| Concern | Location |
|---------|----------|
| Storefront | `apps/web/src/` |
| CMS Schemas | `apps/sanity/schemas/` |
| Commerce Logic | `apps/medusa/src/` |
| Shared Types | `packages/types/` |
| UI Components | `apps/web/src/components/` |

### 3. Data Flow

```
Sanity CMS (content) → Next.js (render) ← Medusa (products, orders)
```

- **Sanity**: Marketing content, blog posts, brand info
- **Medusa**: Products, inventory, orders, customers
- **Next.js**: Combines both for storefront

### 4. Deployment Monitor

**IMPORTANT**: Keep the deployment monitor running!
```bash
./scripts/monitor-status.sh    # Check status
./scripts/start-monitor.sh     # Start if not running
tail -f logs/deployment-monitor.log  # View logs
```

## Environment Variables

Each app has its own `.env.local`:
- `apps/web/.env.local` - Sanity project ID, Medusa URL
- `apps/medusa/.env` - Database URL, Redis, API keys

## Don't

- Import between apps directly (use packages/)
- Skip Turborepo commands (use `npm run dev`, not `cd apps/web && npm run dev`)
- Commit environment files
- Ignore the deployment monitor

## Testing

```bash
npm run test           # All workspaces
npm run test-all       # Integration tests
npm run test-e2e       # E2E shopping flow
npm run health         # Health check all services
```

---

**See `AGENTS.md` for universal agent guidelines.**
