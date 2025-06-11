'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryTestPage() {
  const [errorSent, setErrorSent] = useState(false)

  const handleTestError = () => {
    // Capture a test exception
    Sentry.captureException(new Error('Test error from Fitfoot app'))
    setErrorSent(true)
  }

  const handleTestMessage = () => {
    // Capture a test message
    Sentry.captureMessage('Test message from Fitfoot app', 'info')
    setErrorSent(true)
  }

  const handleUndefinedFunction = () => {
    // This will throw an error naturally
    try {
      // @ts-ignore - intentionally calling undefined function
      myUndefinedFunction()
    } catch (error) {
      Sentry.captureException(error)
      setErrorSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">
            🛠️ Sentry Integration Test
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Test Sentry Error Tracking
              </h2>
              <p className="text-blue-700 mb-4">
                Click these buttons to test different types of error reporting:
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleTestError}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Send Test Exception
                </button>
                
                <button
                  onClick={handleTestMessage}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Send Test Message
                </button>
                
                <button
                  onClick={handleUndefinedFunction}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                >
                  Trigger Undefined Function Error
                </button>
              </div>
              
              {errorSent && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-md">
                  <p className="text-green-700">
                    ✅ Error sent to Sentry! Check your Sentry dashboard.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Setup Status
              </h3>
              <ul className="text-yellow-700 space-y-1">
                <li>✅ Sentry SDK installed</li>
                <li>✅ Instrumentation file created</li>
                <li>✅ Global error handler added</li>
                <li>✅ DSN configured</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Next Steps
              </h3>
              <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                <li>Add your Sentry DSN to environment variables</li>
                <li>Test error reporting with buttons above</li>
                <li>Check Sentry dashboard for captured events</li>
                <li>Remove this test page before production</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 