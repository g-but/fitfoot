'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { forgotPassword, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setSuccess(true);
        setMessage(result.message || 'Password reset email sent!');
      } else {
        setError(result.error || 'Failed to send password reset email');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
      clearError();
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="block">
              <div className="mx-auto h-12 w-12 flex items-center justify-center bg-black rounded-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
            </Link>
            <div className="mx-auto mt-6 h-16 w-16 flex items-center justify-center bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {message}
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn't receive an email?{' '}
              <button
                onClick={() => {
                  setSuccess(false);
                  setMessage('');
                  setEmail('');
                }}
                className="font-medium text-black hover:text-gray-700 underline"
              >
                Try again
              </button>
            </p>
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-medium text-black hover:text-gray-700 underline">
                Sign in
              </Link>
            </p>
            
            {/* Alternative actions */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href="/shop" className="flex-1">
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                  Continue Shopping
                </button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                  Create New Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
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
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M6.938 4h13.856c1.54 0 2.502 1.667 1.732 2.5L13.732 4c-.77.833-1.964.833-2.732 0L3.732 4c-.77-.833.192-2.5-1.732-2.5z"/>
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-medium">{error}</div>
                  {error.includes('email') && !error.includes('required') && (
                    <div className="text-xs mt-2 space-y-1">
                      <div>Email not found? You can:</div>
                      <div>• Try a different email address</div>
                      <div>• <Link href="/auth/register" className="underline hover:no-underline">Create a new account</Link></div>
                      <div>• <Link href="/contact" className="underline hover:no-underline">Contact support</Link></div>
                    </div>
                  )}
                  {error.includes('Network') && (
                    <div className="text-xs mt-1 opacity-90">
                      Please check your internet connection and try again.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/auth/login" className="font-medium text-black hover:text-gray-700 underline">
                Sign in
              </Link>
            </p>
            
            {/* Guest shopping option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Link href="/shop">
              <button className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
                Continue Shopping as Guest
              </button>
            </Link>
            
            {/* Help text */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Still having trouble? <Link href="/contact" className="text-black hover:underline">Contact support</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 