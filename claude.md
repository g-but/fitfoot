# FitFoot Development Guide for Claude Code

**Last Updated:** 2026-01-07
**Version:** 2.0 - Modular & Agentic

> **Mission**: Build a professional, maintainable e-commerce platform with DRY, modular, type-safe code.

---

## Essential Documents (Read These First)

| Document | Purpose |
|----------|---------|
| **`.claude/QUICK_REFERENCE.md`** | One-page lookup for common operations |
| **`.claude/rules/engineering-principles.md`** | DRY, SSOT, Separation of Concerns |
| **`.claude/rules/code-quality.md`** | Naming, TypeScript, testing standards |

**Pro Tip**: Start every session by scanning QUICK_REFERENCE.md for instant context.

---

## Core Principles (Always Enforce)

### 1. DRY - Don't Repeat Yourself
Extract shared logic into reusable utilities, hooks, or components.
See: `.claude/rules/engineering-principles.md`

### 2. SSOT - Single Source of Truth
Define types, configs, and constants in ONE place.

| Data | SSOT Location |
|------|---------------|
| Sanity Types | `apps/web/src/lib/types.ts` |
| API Client | `apps/web/src/lib/medusa.client.ts` |
| Auth State | `apps/web/src/contexts/AuthContext.tsx` |
| Cart State | `apps/web/src/contexts/CartContext.tsx` |
| Backend Config | `apps/medusa/medusa-config.ts` |

### 3. Separation of Concerns
Each module has ONE responsibility.

```
src/
├── components/     # UI rendering ONLY
├── contexts/       # State management ONLY
├── lib/           # Business logic & utilities
├── app/api/       # HTTP layer ONLY
└── app/(pages)/   # Route components
```

### 4. Type Safety
TypeScript strict mode + explicit types everywhere. No `any`.

### 5. Modularity
Small, focused files. Config over code. < 200 lines per component.

---

## Project Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: MedusaJS 2.8 (headless e-commerce)
- **CMS**: Sanity
- **Database**: PostgreSQL via Supabase
- **Build**: Turborepo
- **Testing**: Vitest, Playwright, Jest

### Monorepo Structure

```
fitfoot/
├── apps/
│   ├── web/              # Next.js frontend (port 3005)
│   │   ├── app/          # App Router pages & API routes
│   │   └── src/          # Source code
│   │       ├── components/
│   │       ├── contexts/
│   │       ├── lib/
│   │       └── hooks/
│   └── medusa/           # MedusaJS backend (port 9000)
│       └── src/
│           ├── api/      # Custom API routes
│           ├── modules/  # Medusa modules
│           └── scripts/  # DB scripts
├── packages/
│   └── sanity/           # Sanity CMS (port 3334)
└── .claude/              # AI assistant guidelines
    ├── QUICK_REFERENCE.md
    └── rules/
```

---

## Agentic Workflow

### The 4-Step Loop

```
1. Receive Task → Parse intent, identify requirements
2. Gather Context → Read files, grep patterns, understand structure
3. Formulate Plan → Think through approach, use Planning mode for complexity
4. Take Action → Execute, verify, self-correct
```

### Tool-First Thinking

**Always inspect before editing**:
```bash
# ✅ Good workflow
1. grep "pattern" to find related code
2. read_file to understand structure
3. Formulate changes
4. Apply edits
5. Run lint/type-check to verify

# ❌ Bad workflow
1. Assume structure
2. Edit directly
3. Hope it works
```

---

## Commands

### Development
```bash
npm run dev           # Start all services
npm run dev-web       # Frontend only
npm run dev-medusa    # Backend only
npm run dev-sanity    # CMS only
```

### Quality Checks
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run test          # All tests
npm run test-e2e      # E2E tests
```

### Database
```bash
npm run migrate       # Run migrations
npm run seed          # Seed database
```

---

## Critical Files

| File | Purpose | Edit With Care |
|------|---------|----------------|
| `.env.local` | Credentials | Never commit |
| `apps/web/src/lib/types.ts` | Type SSOT | Update carefully |
| `apps/web/src/contexts/AuthContext.tsx` | Auth state | Test thoroughly |
| `apps/web/src/contexts/CartContext.tsx` | Cart state | Test thoroughly |
| `apps/medusa/medusa-config.ts` | Backend config | Restart after changes |
| `turbo.json` | Build pipeline | Affects all apps |

---

## Code Patterns

### API Route Pattern
```typescript
const API_BASE = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    if (!body.required) {
      return NextResponse.json({ error: 'Missing field' }, { status: 400 })
    }

    // Process
    const result = await processData(body)
    return NextResponse.json(result)
  } catch (error) {
    logger.error('Request failed', error as Error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### React Hook Pattern
```typescript
const fetchData = useCallback(async () => {
  try {
    setLoading(true)
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed')
    setData(await response.json())
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Unknown error')
  } finally {
    setLoading(false)
  }
}, [url])

useEffect(() => {
  fetchData()
}, [fetchData])
```

### Context Pattern
```typescript
const MyContext = createContext<MyContextType | null>(null)

export function MyProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({
    // Memoize to prevent re-renders
  }), [dependencies])

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>
}

export function useMyContext() {
  const context = useContext(MyContext)
  if (!context) throw new Error('useMyContext must be used within MyProvider')
  return context
}
```

---

## Anti-Patterns (Never Do)

| Don't | Do Instead |
|-------|------------|
| Use `any` type | Use `unknown` and narrow |
| Use `console.log` | Use `logger` from `@/lib/logger` |
| Hardcode URLs | Use environment variables |
| Use `// @ts-ignore` | Fix the type error |
| Skip input validation | Validate with Zod |
| Commit `.env` files | Use `.env.example` as template |
| Create 500+ line files | Split into modules |
| Prop drill 3+ levels | Use Context |
| Duplicate logic | Extract to utility/hook |

---

## Environment Variables

### Required (see `env.template`)
```bash
# API URLs
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_BACKEND_URL=http://localhost:9000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://...

# Security
JWT_SECRET=your-secret
COOKIE_SECRET=your-secret

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
```

---

## Handoff Protocol

### End of Session
Update what was done:
- Files modified
- Patterns established
- Next steps recommended

### Start of Session
1. Read `QUICK_REFERENCE.md`
2. Check recent git commits
3. Review any pending issues

---

## Quality Metrics

### Code Quality
- Type safety: 100% (no `any`)
- Lint errors: 0
- Test coverage: > 80%
- File size: < 200 lines

### Performance
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

---

## Remember

1. **DRY**: If you write it twice, extract it
2. **SSOT**: One place for each truth
3. **Separation**: Each module does ONE thing
4. **Type Safety**: TypeScript is your friend
5. **Inspect First**: Never edit blindly
6. **Test**: Verify changes work
7. **Document**: Keep guidelines updated

---

## Additional Resources

- **Rules**: `.claude/rules/`
- **Quick Reference**: `.claude/QUICK_REFERENCE.md`
- **Development Status**: `DEVELOPMENT_STATUS.md`
- **API Docs**: MedusaJS documentation
