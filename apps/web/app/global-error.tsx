'use client'

import { Button } from '@/components/ui/button'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Capture the error with Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'GlobalError',
        errorBoundary: true,
      },
      extra: {
        digest: error.digest,
        componentStack: error.stack,
      },
      contexts: {
        errorBoundary: {
          name: 'Global Error Boundary',
          componentStack: error.stack,
        },
      },
    })
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Something went wrong
              </h1>
              <p className="text-gray-600">
                We apologize for the inconvenience. Our team has been notified and is working on a fix.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={reset}
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                  {error.message}
                  {error.stack && `\n\nStack:\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
} 