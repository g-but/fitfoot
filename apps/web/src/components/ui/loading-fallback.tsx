'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'

interface LoadingFallbackProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  progress?: number
  timeout?: number
  onTimeout?: () => void
}

export function LoadingFallback({
  message = "Loading...",
  size = 'md',
  showProgress = false,
  progress = 0,
  timeout = 10000, // 10 seconds
  onTimeout
}: LoadingFallbackProps) {
  const [timeoutReached, setTimeoutReached] = React.useState(false)

  React.useEffect(() => {
    if (timeout && onTimeout) {
      const timer = setTimeout(() => {
        setTimeoutReached(true)
        onTimeout()
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [timeout, onTimeout])

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const containerClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  }

  if (timeoutReached) {
    return (
      <div className={`flex items-center justify-center ${containerClasses[size]}`}>
        <div className="text-center max-w-md">
          <div className="text-amber-500 mb-2">⚠️</div>
          <p className="text-sm text-muted-foreground mb-4">
            This is taking longer than expected...
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-gold-600 hover:underline"
          >
            Refresh page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-gold-600 mx-auto mb-4`} />
        <p className="text-muted-foreground">{message}</p>
        
        {showProgress && (
          <div className="w-48 bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gold-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function PageLoadingFallback({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingFallback 
        message={message || "Loading page..."} 
        size="lg"
        timeout={15000}
        onTimeout={() => {
          // Show error fallback after timeout
          window.location.href = '/?error=timeout'
        }}
      />
    </div>
  )
}

export function ProductsLoadingFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <LoadingFallback 
        message="Finding your perfect shoes..." 
        size="md"
        timeout={10000}
        onTimeout={() => {
          // Redirect to error state
          window.location.href = '/shop?error=loading_timeout'
        }}
      />
    </div>
  )
} 