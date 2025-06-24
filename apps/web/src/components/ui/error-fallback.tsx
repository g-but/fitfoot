'use client'

import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './button'

interface ErrorFallbackProps {
  error?: Error | string
  resetError?: () => void
  title?: string
  description?: string
  showHome?: boolean
  showBack?: boolean
  showReload?: boolean
  showTryAgain?: boolean
  customActions?: React.ReactNode
  variant?: 'default' | 'minimal' | 'detailed'
}

export function ErrorFallback({
  error,
  resetError,
  title = "Something went wrong",
  description,
  showHome = true,
  showBack = true,
  showReload = true,
  showTryAgain = true,
  customActions,
  variant = 'default'
}: ErrorFallbackProps) {
  const router = useRouter()
  
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'
  
  const handleReload = () => {
    window.location.reload()
  }
  
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
          <div className="flex gap-2 justify-center">
            {showTryAgain && resetError && (
              <Button onClick={resetError} size="sm" variant="outline">
                Try Again
              </Button>
            )}
            {showReload && (
              <Button onClick={handleReload} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-1" />
                Reload
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-gray-600">
            {description || "We apologize for the inconvenience. The error has been reported and we're working to fix it."}
          </p>
          {variant === 'detailed' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto max-h-32">
                  {errorMessage}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {customActions ? (
            customActions
          ) : (
            <>
              {showTryAgain && resetError && (
                <Button onClick={resetError} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              
              <div className="flex gap-2">
                {showHome && (
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                )}
                
                {showBack && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                )}
              </div>
              
              {showReload && (
                <Button 
                  variant="ghost" 
                  className="w-full text-sm"
                  onClick={handleReload}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              )}
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-gray-500 border-t pt-4">
          <p>Still having trouble? <Link href="/contact" className="text-gold-600 hover:underline">Contact support</Link></p>
        </div>
      </div>
    </div>
  )
}

// Specialized error components for common scenarios
export function NetworkErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      title="Connection Problem"
      description="We're having trouble connecting to our servers. Please check your internet connection and try again."
      error="Network error"
      resetError={resetError}
      showReload={true}
      customActions={
        <div className="space-y-3">
          {resetError && (
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            Check Connection & Reload
          </Button>
        </div>
      }
    />
  )
}

export function ProductLoadErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      title="Products Unavailable"  
      description="We couldn't load our product catalog right now. This might be a temporary issue."
      resetError={resetError}
      customActions={
        <div className="space-y-3">
          {resetError && (
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Loading Products
            </Button>
          )}
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Browse Homepage
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      }
    />
  )
}

export function AuthErrorFallback({ resetError }: { resetError?: () => void }) {
  return (
    <ErrorFallback
      title="Authentication Issue"
      description="There was a problem with your session. Please try logging in again."
      resetError={resetError}
      customActions={
        <div className="space-y-3">
          <Link href="/auth/login">
            <Button className="w-full">
              Sign In Again
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/auth/register" className="flex-1">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      }
    />
  )
} 