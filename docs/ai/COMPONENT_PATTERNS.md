# FitFoot Component Patterns for AI Agents

**Created Date:** 2025-01-23  
**Last Modified Date:** 2025-01-23  
**Last Modified Summary:** Created comprehensive component patterns guide for AI development

## 🎯 Purpose

This document provides reusable patterns and examples for building consistent, high-quality components in the FitFoot codebase.

## 🏗️ Base Component Pattern

### Standard Component Structure
```typescript
'use client' // Only if client interactivity needed

import { ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  children?: React.ReactNode
  className?: string
  // Other specific props
}

export function Component({ 
  children, 
  className,
  ...otherProps 
}: ComponentProps) {
  return (
    <div className={cn('default-classes', className)}>
      {children}
    </div>
  )
}
```

## 🎨 UI Component Patterns

### Button Pattern
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className,
  onClick
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors'
  const variants = {
    primary: 'bg-amber-600 text-white hover:bg-amber-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
```

### Form Input Pattern
```typescript
interface InputProps {
  label?: string
  error?: string
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function Input({ 
  label, 
  error, 
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  className
}: InputProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

## 🛒 E-commerce Component Patterns

### Product Card Pattern
```typescript
interface Product {
  id: string
  title: string
  price: number
  image?: string
  description?: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string) => void
  onViewDetails?: (productId: string) => void
  className?: string
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className 
}: ProductCardProps) {
  return (
    <div className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow',
      className
    )}>
      {product.image && (
        <div className="aspect-square relative">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-amber-600">
            CHF {product.price}
          </span>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(product.id)}
              >
                View
              </Button>
            )}
            <Button 
              size="sm"
              onClick={() => onAddToCart(product.id)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Cart Item Pattern
```typescript
interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  image?: string
}

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  className?: string
}

export function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onRemove,
  className 
}: CartItemProps) {
  return (
    <div className={cn('flex items-center gap-4 p-4 bg-white rounded-lg', className)}>
      {item.image && (
        <div className="w-16 h-16 relative flex-shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.title}</h4>
        <p className="text-amber-600 font-semibold">CHF {item.price}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.id)}
        className="text-red-600 hover:text-red-700"
      >
        Remove
      </Button>
    </div>
  )
}
```

## 📱 Layout Component Patterns

### Modal Pattern
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative bg-white rounded-lg p-6 max-w-md w-full mx-4',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
```

### Loading State Pattern
```typescript
interface LoadingStateProps {
  loading: boolean
  error?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingState({ 
  loading, 
  error, 
  children, 
  fallback 
}: LoadingStateProps) {
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
```

## 🔄 State Management Patterns

### Custom Hook Pattern
```typescript
interface UseCartReturn {
  items: CartItem[]
  addItem: (productId: string, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  getTotal: () => number
  getItemCount: () => number
  clearCart: () => void
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((productId: string, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === productId)
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      // Add new item logic here
      return prev
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [items])

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }, [items])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotal,
    getItemCount,
    clearCart
  }
}
```

## 🎯 Error Handling Patterns

### Error Boundary Pattern
```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, {
      tags: { component: 'ErrorBoundary' },
      extra: { errorInfo }
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We've been notified and are working to fix this.
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## 🚀 Performance Patterns

### Memoized Component Pattern
```typescript
interface ExpensiveComponentProps {
  data: LargeDataSet[]
  filter: string
}

export const ExpensiveComponent = memo(({ 
  data, 
  filter 
}: ExpensiveComponentProps) => {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])

  return (
    <div>
      {filteredData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
})

ExpensiveComponent.displayName = 'ExpensiveComponent'
```

## 📱 Responsive Design Patterns

### Responsive Grid Pattern
```typescript
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className 
}: ResponsiveGridProps) {
  const gridClasses = cn(
    'grid',
    `gap-${gap}`,
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}
```

## 🎯 Quick Reference

### Component Checklist
- [ ] TypeScript interfaces defined
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Responsive design considered
- [ ] Accessibility features added
- [ ] Performance optimized (memo/useMemo if needed)
- [ ] Consistent styling with design system
- [ ] Proper documentation

### Common Props Pattern
```typescript
interface BaseComponentProps {
  children?: React.ReactNode
  className?: string
  id?: string
  'data-testid'?: string
}
```

### Export Pattern
```typescript
// Always use named exports for components
export { Component } from './Component'
export type { ComponentProps } from './Component'
``` 