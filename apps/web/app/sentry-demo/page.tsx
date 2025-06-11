'use client'

import * as Sentry from '@sentry/nextjs'
import { useState } from 'react'

export default function SentryDemo() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testError = () => {
    try {
      // Simulate a real error that might happen in your app
      const user = { name: 'John' } as any
      // This will throw because 'email' doesn't exist
      console.log(user.email.toLowerCase())
    } catch (error) {
      // Sentry captures this error automatically
      Sentry.captureException(error)
      addResult('❌ Error sent to Sentry! Check your dashboard.')
    }
  }

  const testSlowFunction = () => {
    // Simulate a slow operation
    const startTime = Date.now()
    
    // Create artificial delay
    let result = 0
    for (let i = 0; i < 10000000; i++) {
      result += Math.random()
    }
    
    const duration = Date.now() - startTime
    Sentry.captureMessage(`Slow operation took ${duration}ms`, 'warning')
    addResult(`⚠️ Performance issue logged: ${duration}ms`)
  }

  const testUserContext = () => {
    // Set user context (who was affected)
    Sentry.setUser({
      id: '123',
      email: 'test@fitfoot.com',
      username: 'demo_user'
    })
    
    // Add extra context
    Sentry.setContext('demo', {
      action: 'testing_sentry',
      feature: 'error_tracking'
    })
    
    Sentry.captureMessage('User action tracked with context', 'info')
    addResult('👤 User context + message sent to Sentry')
  }

  const testBreadcrumbs = () => {
    // Add breadcrumbs (what happened before the error)
    Sentry.addBreadcrumb({
      message: 'User clicked demo button',
      level: 'info',
      timestamp: Date.now() / 1000
    })
    
    Sentry.addBreadcrumb({
      message: 'Processing user action',
      level: 'debug',
      timestamp: Date.now() / 1000
    })
    
    // Now create an error with context
    Sentry.captureException(new Error('Demo error with breadcrumbs'))
    addResult('🍞 Error with breadcrumbs sent (shows user journey)')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 What is Sentry? Live Demo
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              🎯 Sentry = Your App's Security Camera
            </h2>
            <ul className="text-blue-700 space-y-1">
              <li>📹 <strong>Records everything</strong> - errors, performance, user actions</li>
              <li>🚨 <strong>Alerts you instantly</strong> - when things break</li>
              <li>🔍 <strong>Shows exact details</strong> - which line of code, which user, when</li>
              <li>📊 <strong>Tracks performance</strong> - slow pages, memory issues</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                🧪 Test Sentry Features
              </h3>
              
              <button
                onClick={testError}
                className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                🐛 Simulate App Error
              </button>
              
              <button
                onClick={testSlowFunction}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                🐌 Test Performance Issue
              </button>
              
              <button
                onClick={testUserContext}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                👤 Track User Action
              </button>
              
              <button
                onClick={testBreadcrumbs}
                className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                🍞 Error with User Journey
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 Live Results
              </h3>
              <div className="space-y-2 h-64 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Click buttons to see Sentry in action...
                  </p>
                ) : (
                  results.map((result, i) => (
                    <div key={i} className="p-2 bg-white rounded text-sm border-l-2 border-green-400">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 After You Click Buttons Above:
            </h3>
            <ol className="text-green-700 space-y-1 list-decimal list-inside">
              <li>Go to your <a href="https://orangecat-q3.sentry.io/projects/javascript-nextjs/issues/" target="_blank" className="underline font-medium">Sentry Dashboard</a></li>
              <li>See each error with full details</li>
              <li>View performance data</li>
              <li>See user context & journey</li>
            </ol>
          </div>

          <div className="text-center">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 