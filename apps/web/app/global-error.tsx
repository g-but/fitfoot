'use client'

import * as Sentry from '@sentry/nextjs'
import Error from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Something went wrong!
              </h2>
              <p className="text-neutral-600 mb-6">
                We've been notified of this error and will fix it as soon as possible.
              </p>
              <div className="space-y-3">
                <button
                  onClick={reset}
                  className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                >
                  Try again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
                >
                  Go home
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 