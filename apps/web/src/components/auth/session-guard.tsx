'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { LogIn, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SessionGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallbackMode?: 'redirect' | 'overlay' | 'inline'
  guestMessage?: string
}

export function SessionGuard({
  children,
  requireAuth = false,
  redirectTo = '/auth/login',
  fallbackMode = 'overlay',
  guestMessage = "You need to sign in to access this feature."
}: SessionGuardProps) {
  const { user, loading, hydrated, isLoggedIn } = useAuth()
  const [showFallback, setShowFallback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!hydrated || loading) return

    if (requireAuth && !isLoggedIn) {
      if (fallbackMode === 'redirect') {
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`)
      } else {
        setShowFallback(true)
      }
    } else {
      setShowFallback(false)
    }
  }, [hydrated, loading, isLoggedIn, requireAuth, fallbackMode, redirectTo, router])

  // Show loading during hydration
  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
      </div>
    )
  }

  // Show content if auth not required or user is logged in
  if (!requireAuth || isLoggedIn) {
    return <>{children}</>
  }

  // Show fallback for auth-required content
  if (showFallback) {
    if (fallbackMode === 'inline') {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">{guestMessage}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/login">
              <Button>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Sign In Required</h2>
            <p className="text-gray-600">{guestMessage}</p>
          </div>
          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href="/auth/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
              <Link href="/shop" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Keep Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Hook for components that need auth but want to handle it themselves
export function useAuthRequired() {
  const { user, loading, hydrated, isLoggedIn } = useAuth()
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    if (hydrated && !loading) {
      setNeedsAuth(!isLoggedIn)
    }
  }, [hydrated, loading, isLoggedIn])

  return {
    needsAuth,
    isAuthenticated: isLoggedIn,
    loading: loading || !hydrated
  }
}

// Higher-order component for auth protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean
    redirectTo?: string
    fallbackMode?: 'redirect' | 'overlay' | 'inline'
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <SessionGuard {...options}>
        <Component {...props} />
      </SessionGuard>
    )
  }
} 