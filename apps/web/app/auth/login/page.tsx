'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:9000/auth/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store customer token and user info
        localStorage.setItem('customer_token', data.token);
        localStorage.setItem('customer_user', JSON.stringify(data.customer));
        
        // Redirect to shop or user's intended destination
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/shop';
        router.push(returnUrl);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your FitFoot account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M6.938 4h13.856c1.54 0 2.502 1.667 1.732 2.5L13.732 4c-.77.833-1.964.833-2.732 0L3.732 4c-.77-.833.192-2.5-1.732-2.5z"/>
                </svg>
                <div className="flex-1">
                  <div className="text-sm font-medium">{error}</div>
                  {error.includes('Network') && (
                    <div className="text-xs mt-1 opacity-90">
                      Please check your internet connection and try again.
                    </div>
                  )}
                  {error.includes('failed') && !error.includes('Network') && (
                    <div className="text-xs mt-2 space-y-1">
                      <div>• Check your email and password</div>
                      <div>• Try <Link href="/auth/forgot-password" className="underline hover:no-underline">resetting your password</Link></div>
                      <div>• Or <Link href="/auth/register" className="underline hover:no-underline">create a new account</Link></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            
            {/* Guest checkout option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Link href="/shop" className="w-full">
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
              >
                Continue as Guest
              </button>
            </Link>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              <Link href="/auth/forgot-password" className="font-medium text-black hover:text-gray-700 underline">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-black hover:text-gray-700 underline">
                Create one here
              </Link>
            </p>
            
            {/* Help text */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Having trouble signing in? <Link href="/contact" className="text-black hover:underline">Contact support</Link>
              </p>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🌱 Join our zero-waste mission • 🇨🇭 Swiss quality • ♻️ Sustainable fashion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 