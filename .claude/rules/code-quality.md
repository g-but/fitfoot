# Code Quality Standards

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Utilities | camelCase | `formatPrice.ts` |
| Hooks | camelCase with `use` prefix | `useProducts.ts` |
| Constants | SCREAMING_SNAKE | `API_ENDPOINTS.ts` |
| Types | PascalCase | `types.ts` |
| Test files | `*.test.ts` or `__tests__/` | `ProductCard.test.tsx` |

### Variables & Functions

```typescript
// Variables: camelCase
const productList = []
const isLoading = true

// Functions: camelCase, verb prefix
function fetchProducts() { }
function handleSubmit() { }
function calculateTotal() { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_ITEMS = 100
const API_TIMEOUT_MS = 5000

// Types/Interfaces: PascalCase
interface ProductData { }
type CartItem = { }

// React Components: PascalCase
function ProductCard() { }
const MemoizedList = memo(List)

// Event handlers: handle + Event
const handleClick = () => { }
const handleInputChange = () => { }

// Boolean variables: is/has/can prefix
const isVisible = true
const hasError = false
const canSubmit = true
```

## TypeScript Best Practices

### Use Explicit Types

```typescript
// BAD - Implicit any
function process(data) { return data.value }

// GOOD - Explicit types
function process(data: ProductData): string {
  return data.value
}
```

### Prefer Interfaces for Objects

```typescript
// Use interface for object shapes
interface User {
  id: string
  email: string
  name: string
}

// Use type for unions, primitives, utilities
type Status = 'pending' | 'active' | 'completed'
type Nullable<T> = T | null
```

### Avoid `any`, Use `unknown`

```typescript
// BAD
function parseData(input: any) {
  return input.value // No safety
}

// GOOD
function parseData(input: unknown): string {
  if (typeof input === 'object' && input !== null && 'value' in input) {
    return String((input as { value: unknown }).value)
  }
  throw new Error('Invalid input')
}
```

### Use `as const` for Literal Types

```typescript
// Creates readonly tuple with literal types
const STATUSES = ['pending', 'active', 'completed'] as const
type Status = typeof STATUSES[number] // 'pending' | 'active' | 'completed'
```

## React Best Practices

### Component Structure

```typescript
'use client' // Only if needed

import { useCallback, useState } from 'react'
// External imports
import { Button } from '@/components/ui/button'
// Internal imports
import { formatPrice } from '@/lib/formatters'
// Types
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (id: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // 1. Hooks first
  const [isLoading, setIsLoading] = useState(false)

  // 2. Callbacks
  const handleAddToCart = useCallback(() => {
    setIsLoading(true)
    onAddToCart(product.id)
  }, [product.id, onAddToCart])

  // 3. Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  )
}
```

### Memoization Guidelines

```typescript
// useMemo: For expensive calculations
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
)

// useCallback: For functions passed as props
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])

// Don't over-memoize simple values
// BAD
const name = useMemo(() => user.name, [user.name])
// GOOD
const name = user.name
```

### Effect Dependencies

```typescript
// Include ALL dependencies
useEffect(() => {
  fetchData(userId)
}, [userId, fetchData]) // Both included

// Or use useCallback for stable references
const fetchData = useCallback(async () => {
  const data = await api.get(`/users/${userId}`)
  setUser(data)
}, [userId])

useEffect(() => {
  fetchData()
}, [fetchData])
```

## Error Handling

### API Routes

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate
    if (!body.email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    // Process
    const result = await processData(body)

    return Response.json(result)
  } catch (error) {
    logger.error('POST /api/endpoint failed', error as Error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Client-Side

```typescript
async function submitForm(data: FormData) {
  try {
    setLoading(true)
    setError(null)

    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const { error } = await response.json()
      throw new Error(error || 'Request failed')
    }

    return await response.json()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    setError(message)
    logger.error('Form submission failed', error as Error)
  } finally {
    setLoading(false)
  }
}
```

## Testing Standards

### Test File Structure

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './ProductCard'

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 100
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })

  it('calls onAddToCart when clicked', () => {
    const onAddToCart = vi.fn()
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))

    expect(onAddToCart).toHaveBeenCalledWith('1')
  })
})
```

### Test Naming

```typescript
// Describe what it does
it('should return error when email is invalid')
it('renders loading state while fetching')
it('navigates to product page on click')

// NOT implementation details
// BAD: it('calls setState with new value')
```

## Performance Standards

### Bundle Size

- Keep page bundles < 200KB (gzipped)
- Lazy load non-critical components
- Use dynamic imports for heavy libraries

```typescript
// Lazy load heavy components
const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### Core Web Vitals Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
