'use client'

import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

type ConfirmationState = 'loading' | 'success' | 'error' | 'expired'

function ConfirmEmailContent() {
  const [state, setState] = useState<ConfirmationState>('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setState('error')
      setError('Invalid confirmation link. Please check your email for the correct link.')
      return
    }

    confirmEmail(token)
  }, [searchParams])

  const confirmEmail = async (token: string) => {
    try {
      setState('loading')
      
      const response = await fetch('/api/auth/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setState('success')
        setMessage(data.message || 'Email confirmed successfully!')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=Email confirmed successfully! Please sign in.')
        }, 3000)
      } else {
        setState('error')
        if (response.status === 410) {
          setState('expired')
          setError('This confirmation link has expired. Please request a new one.')
        } else {
          setError(data.error || 'Failed to confirm email. Please try again.')
        }
      }
    } catch (error) {
      console.error('Email confirmation error:', error)
      setState('error')
      setError('Network error. Please check your connection and try again.')
    }
  }

  const handleResendConfirmation = async () => {
    try {
      setState('loading')
      // For now, redirect to registration to allow user to re-register
      // In a real implementation, this would resend the confirmation email
      router.push('/auth/register?message=Please register again to receive a new confirmation email')
    } catch (error) {
      setState('error')
      setError('Failed to resend confirmation email. Please try registering again.')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="block">
            <div className="mx-auto h-12 w-12 flex items-center justify-center bg-black rounded-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Confirmation
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {state === 'loading' && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400" />
              <p className="mt-4 text-gray-600">Confirming your email...</p>
            </div>
          )}

          {state === 'success' && (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Email Confirmed!
              </h3>
              <p className="mt-2 text-gray-600">{message}</p>
              <p className="mt-4 text-sm text-gray-500">
                Redirecting you to login page in a few seconds...
              </p>
              <div className="mt-6">
                <Link href="/auth/login">
                  <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                    Continue to Login
                  </button>
                </Link>
              </div>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Confirmation Failed
              </h3>
              <p className="mt-2 text-red-600">{error}</p>
              <div className="mt-6 space-y-3">
                <Link href="/auth/login">
                  <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                    Try Login Instead
                  </button>
                </Link>
                <div className="flex gap-2">
                  <Link href="/auth/register" className="flex-1">
                    <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                      Back to Registration
                    </button>
                  </Link>
                  <Link href="/shop" className="flex-1">
                    <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                      Continue as Guest
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {state === 'expired' && (
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto text-yellow-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Link Expired
              </h3>
              <p className="mt-2 text-yellow-600">{error}</p>
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleResendConfirmation}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Resend Confirmation Email
                </button>
                <Link href="/auth/register">
                  <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                    Register Again
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🌱 Join our zero-waste mission • 🇨🇭 Swiss quality • ♻️ Sustainable fashion
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
} 