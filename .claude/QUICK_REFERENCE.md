# FitFoot Quick Reference

> One-page lookup for common operations. Scan this at session start.

## Critical Files (Memorize)

| File | Purpose |
|------|---------|
| `apps/web/src/lib/types.ts` | Sanity type definitions |
| `apps/web/src/contexts/` | React state management |
| `apps/web/src/lib/medusa.client.ts` | Backend API client |
| `apps/medusa/medusa-config.ts` | Backend configuration |
| `.env.local` | Credentials (never commit) |

## Architecture SSOT

```
apps/web/           → Frontend (Next.js 14, port 3005)
apps/medusa/        → Backend API (MedusaJS, port 9000)
packages/sanity/    → CMS (port 3334)
```

## Common Commands

```bash
npm run dev           # Start all services
npm run dev-web       # Frontend only
npm run dev-medusa    # Backend only
npm run lint          # Check code quality
npm run type-check    # TypeScript validation
npm run test          # Run tests
npm run migrate       # Database migrations
npm run seed          # Seed database
```

## API Base URLs

```typescript
// Frontend (client-side)
const API = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

// API Routes (server-side)
const API = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
```

## Component Patterns

```typescript
// Client Component
'use client'
import { useCallback, useEffect, useState } from 'react'

// Server Component (default)
// No 'use client' directive needed

// Context Usage
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
```

## Path Aliases

```typescript
@/*           → src/*
@/components  → src/components
@/lib         → src/lib
@/contexts    → src/contexts
```

## Error Handling Pattern

```typescript
try {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Request failed')
  return await response.json()
} catch (error) {
  logger.error('Operation failed', error as Error)
  throw error
}
```

## Unused Variable Convention

```typescript
// Prefix intentionally unused vars with underscore
const { data, error: _error } = await fetch()
function handler(_request: Request) { }
interface _InternalType { }
```

## Git Workflow

```bash
# Feature branch
git checkout -b feature/description
git commit -m "feat: description"
git push origin feature/description

# Commit types: feat, fix, refactor, docs, test, chore
```
