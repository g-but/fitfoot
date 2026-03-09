# Engineering Principles

## Core Principles (Always Enforce)

### 1. DRY - Don't Repeat Yourself

**Rule**: Extract shared logic into reusable utilities, hooks, or components.

```typescript
// BAD - Duplicated price formatting
function ProductCard() {
  const price = new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}
function CartItem() {
  const price = new Intl.NumberFormat('en-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

// GOOD - Single utility
// lib/formatters.ts
export const formatPrice = (amount: number, currency = 'CHF') =>
  new Intl.NumberFormat('en-CH', { style: 'currency', currency }).format(amount)

// Usage everywhere
import { formatPrice } from '@/lib/formatters'
const price = formatPrice(amount)
```

**Apply DRY to**:
- API call patterns → create utility functions
- Form validation → use Zod schemas
- Price/date formatting → centralize in `lib/formatters.ts`
- Error handling → use consistent patterns
- Component styles → use Tailwind utilities or component variants

### 2. SSOT - Single Source of Truth

**Rule**: Define data types, configurations, and constants in ONE place.

**Sources of Truth in FitFoot**:

| Data | SSOT Location |
|------|---------------|
| Sanity Types | `apps/web/src/lib/types.ts` |
| Environment Config | `.env.local` + `env.template` |
| API URLs | Environment variables |
| Product Types | Medusa database schema |
| UI Components | `src/components/ui/` |

```typescript
// BAD - Magic strings scattered everywhere
fetch('http://localhost:9000/store/products')
const type = 'sneaker'

// GOOD - Centralized constants
// lib/constants.ts
export const PRODUCT_TYPES = ['sneaker', 'bag', 'cap'] as const
export type ProductType = typeof PRODUCT_TYPES[number]

// lib/config.ts
export const API_BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
```

### 3. Separation of Concerns

**Rule**: Each module has ONE responsibility.

```
src/
├── components/        # UI rendering ONLY
│   ├── ui/           # Primitive components (Button, Badge)
│   ├── layout/       # Page structure (Header, Footer)
│   └── features/     # Feature-specific UI
├── contexts/          # State management ONLY
├── lib/              # Utilities & business logic
│   ├── api/          # API client functions
│   ├── hooks/        # Custom React hooks
│   └── utils/        # Pure utility functions
├── app/
│   ├── api/          # HTTP layer ONLY
│   └── (pages)/      # Route components
```

**Separation Rules**:
- Components: Render UI, handle user events
- Contexts: Manage and share state
- API Routes: Handle HTTP, validate input, call services
- Lib: Business logic, data transformation

```typescript
// BAD - Component does everything
function ProductPage() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(data.products))
  }, [])
  // ... 500 lines of rendering
}

// GOOD - Separated concerns
// hooks/useProducts.ts
export function useProducts() {
  return useQuery(['products'], fetchProducts)
}

// components/ProductGrid.tsx
export function ProductGrid({ products }: Props) {
  return <div>{products.map(p => <ProductCard key={p.id} {...p} />)}</div>
}

// app/shop/page.tsx
export default function ShopPage() {
  const { products, isLoading } = useProducts()
  if (isLoading) return <Skeleton />
  return <ProductGrid products={products} />
}
```

### 4. Type Safety

**Rule**: TypeScript + Zod validation everywhere.

```typescript
// API Route with validation
import { z } from 'zod'

const CreateProductSchema = z.object({
  title: z.string().min(1),
  price: z.number().positive(),
  type: z.enum(['sneaker', 'bag', 'cap'])
})

export async function POST(request: Request) {
  const body = await request.json()
  const result = CreateProductSchema.safeParse(body)

  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 })
  }

  // result.data is fully typed
}
```

### 5. Modularity

**Rule**: Configuration over code. Small, focused files.

```typescript
// BAD - 800 line component
function MegaForm() { /* everything */ }

// GOOD - Composed from modules
function ProductForm() {
  return (
    <Form schema={productSchema}>
      <BasicInfoSection />
      <PricingSection />
      <ImagesSection />
      <FormActions />
    </Form>
  )
}
```

**File Size Limits**:
- Components: < 200 lines
- Utilities: < 100 lines
- API routes: < 150 lines

If exceeding, split into smaller modules.

## Anti-Patterns to Avoid

### 1. Prop Drilling
```typescript
// BAD
<App user={user}>
  <Layout user={user}>
    <Page user={user}>
      <Component user={user} />

// GOOD - Use context
<UserProvider>
  <Component /> // Uses useUser() hook
```

### 2. God Components
```typescript
// BAD - Does everything
function Dashboard() {
  // 50 useState calls
  // 20 useEffect calls
  // 1000 lines of JSX
}

// GOOD - Composed
function Dashboard() {
  return (
    <DashboardLayout>
      <StatsSection />
      <RecentOrders />
      <QuickActions />
    </DashboardLayout>
  )
}
```

### 3. Implicit Dependencies
```typescript
// BAD - Relies on global state
function calculateTotal() {
  return cart.items.reduce((sum, item) => sum + item.price, 0)
}

// GOOD - Explicit dependencies
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

### 4. Magic Numbers/Strings
```typescript
// BAD
if (status === 'delivered') { }
const timeout = 5000

// GOOD
const ORDER_STATUS = { DELIVERED: 'delivered' } as const
const TIMEOUT_MS = 5000
```
