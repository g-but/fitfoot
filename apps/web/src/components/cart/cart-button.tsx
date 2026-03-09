'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

// Skeleton component for cart loading state
function CartSkeleton() {
  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 relative"
        aria-label="Shopping cart (loading)"
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 bg-gray-200 animate-pulse text-xs rounded-full h-5 w-5 flex items-center justify-center">
        </span>
      </Button>
    </Link>
  )
}

// Internal cart component that accesses cart state
function CartContent() {
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  return (
    <Link href="/cart">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 relative"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
            suppressHydrationWarning
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

// Main cart button with Suspense and Error boundaries
export function CartButton() {
  return (
    <ErrorBoundary 
      level="component"
      fallback={
        <Link href="/cart">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </Link>
      }
    >
      <Suspense fallback={<CartSkeleton />}>
        <CartContent />
      </Suspense>
    </ErrorBoundary>
  )
} 