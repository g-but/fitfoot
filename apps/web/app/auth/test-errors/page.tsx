'use client'

import { SessionGuard } from '@/components/auth/session-guard'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AuthErrorTestPage() {
  const [demoError, setDemoError] = useState<string | null>(null)
  const [demoSuccess, setDemoSuccess] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const simulateError = (errorType: string) => {
    setDemoLoading(true)
    setTimeout(() => {
      setDemoLoading(false)
      setDemoSuccess(false)
      
      switch (errorType) {
        case 'network':
          setDemoError('Network error. Please try again.')
          break
        case 'credentials':
          setDemoError('Login failed')
          break
        case 'email-exists':
          setDemoError('Email already exists')
          break
        case 'password-weak':
          setDemoError('Password must be at least 8 characters long')
          break
        case 'email-invalid':
          setDemoError('Invalid email format')
          break
        case 'server':
          setDemoError('Server error. Please try again later.')
          break
        default:
          setDemoError('An unexpected error occurred.')
      }
    }, 1000)
  }

  const simulateSuccess = () => {
    setDemoLoading(true)
    setTimeout(() => {
      setDemoLoading(false)
      setDemoError(null)
      setDemoSuccess(true)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Error Handling Test Suite
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This page demonstrates all improved authentication error states to ensure users 
            never hit dead ends during their journey.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Error Simulation Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Simulation</h2>
            <div className="space-y-3">
              <button
                onClick={() => simulateError('network')}
                disabled={demoLoading}
                className="w-full text-left px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <div className="font-medium text-red-800">Network Error</div>
                <div className="text-sm text-red-600">Simulate connection failure</div>
              </button>
              
              <button
                onClick={() => simulateError('credentials')}
                disabled={demoLoading}
                className="w-full text-left px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <div className="font-medium text-red-800">Invalid Credentials</div>
                <div className="text-sm text-red-600">Wrong email/password</div>
              </button>
              
              <button
                onClick={() => simulateError('email-exists')}
                disabled={demoLoading}
                className="w-full text-left px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <div className="font-medium text-red-800">Email Already Exists</div>
                <div className="text-sm text-red-600">Registration with existing email</div>
              </button>
              
              <button
                onClick={() => simulateError('password-weak')}
                disabled={demoLoading}
                className="w-full text-left px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
              >
                <div className="font-medium text-red-800">Weak Password</div>
                <div className="text-sm text-red-600">Password validation failure</div>
              </button>
              
              <button
                onClick={simulateSuccess}
                disabled={demoLoading}
                className="w-full text-left px-4 py-2 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
              >
                <div className="font-medium text-green-800">Success State</div>
                <div className="text-sm text-green-600">Simulate successful operation</div>
              </button>
            </div>
          </div>

          {/* Error Display Panel */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Error Display</h2>
            
            {demoLoading && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <div className="text-sm font-medium">Processing...</div>
                </div>
              </div>
            )}

            {demoError && !demoLoading && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{demoError}</div>
                    {demoError.includes('Network') && (
                      <div className="text-xs mt-1 opacity-90">
                        Please check your internet connection and try again.
                      </div>
                    )}
                    {demoError.includes('failed') && !demoError.includes('Network') && (
                      <div className="text-xs mt-2 space-y-1">
                        <div>• Check your email and password</div>
                        <div>• Try <Link href="/auth/forgot-password" className="underline hover:no-underline">resetting your password</Link></div>
                        <div>• Or <Link href="/auth/register" className="underline hover:no-underline">create a new account</Link></div>
                      </div>
                    )}
                    {demoError.includes('email') && demoError.includes('exists') && (
                      <div className="text-xs mt-2 space-y-1">
                        <div>This email is already registered. You can:</div>
                        <div>• <Link href="/auth/login" className="underline hover:no-underline">Sign in instead</Link></div>
                        <div>• <Link href="/auth/forgot-password" className="underline hover:no-underline">Reset your password</Link></div>
                      </div>
                    )}
                    {demoError.includes('Password') && (
                      <div className="text-xs mt-1 opacity-90">
                        Use at least 8 characters with a mix of letters and numbers.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {demoSuccess && !demoLoading && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <div className="text-sm font-medium">Operation completed successfully!</div>
                </div>
              </div>
            )}

            {!demoError && !demoSuccess && !demoLoading && (
              <div className="text-center text-gray-500 py-8">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">Click an error type above to see the enhanced display</div>
              </div>
            )}
          </div>
        </div>

        {/* Auth Guard Demo */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Guard Demo</h2>
          <p className="text-gray-600 mb-6">
            The following content requires authentication. It demonstrates how users are 
            never left stranded - they always have options to continue their journey.
          </p>
          
          <SessionGuard 
            requireAuth={true} 
            fallbackMode="inline"
            guestMessage="This feature requires an account, but you can still browse our products!"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <div className="font-medium">🎉 You're authenticated!</div>
              </div>
              <div className="text-sm text-green-700 mt-1">
                This content is only visible to signed-in users.
              </div>
            </div>
          </SessionGuard>
        </div>

        {/* Navigation Links */}
        <div className="mt-12 text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Real Authentication Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline">Test Login Page</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline">Test Registration Page</Button>
            </Link>
            <Link href="/auth/forgot-password">
              <Button variant="outline">Test Password Reset</Button>
            </Link>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            ✅ Authentication Error Handling Improvements
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <div>• Enhanced error messages with specific recovery actions</div>
            <div>• "Continue as Guest" options on all auth pages</div>
            <div>• Smart error context (network, validation, server, etc.)</div>
            <div>• Session guards with graceful fallbacks</div>
            <div>• Multiple navigation paths from every error state</div>
            <div>• Visual error indicators with helpful suggestions</div>
            <div>• Contact support options for persistent issues</div>
          </div>
        </div>
      </div>
    </div>
  )
} 