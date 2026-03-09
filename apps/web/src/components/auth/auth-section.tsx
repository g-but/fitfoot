'use client'

import { UserDropdown } from '@/components/auth/user-dropdown'
import { ErrorBoundary } from '@/components/error-boundary'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { Suspense } from 'react'

// Skeleton component for auth loading state
function AuthSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
      <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
    </div>
  )
}

// Internal auth component that accesses auth state
function AuthContent() {
  const { user, isLoggedIn } = useAuth()

  if (isLoggedIn && user) {
    return (
      <ErrorBoundary level="component">
        <UserDropdown />
      </ErrorBoundary>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Link href="/auth/login">
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/register">
        <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

// Main auth section with Suspense boundary
export function AuthSection() {
  return (
    <ErrorBoundary level="component">
      <Suspense fallback={<AuthSkeleton />}>
        <AuthContent />
      </Suspense>
    </ErrorBoundary>
  )
} 