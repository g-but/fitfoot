import * as Sentry from '@sentry/nextjs'

// This function is called when the Next.js server starts
export async function register() {
  // Skip Sentry in development to avoid cluttering terminal
  if (process.env.NODE_ENV === 'development') {
    console.log('Sentry: Disabled in development for cleaner terminal output')
    return
  }

  // Check if we're in the server environment
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Performance Monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0,
      
      // Development vs Production settings
      debug: false,
      
      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      
      // Server-specific configurations
      integrations: [
        // Capture HTTP requests
        Sentry.httpIntegration(),
      ],
      
      // Filter out health check and monitoring requests
      beforeSend(event) {
        // Skip health check endpoints
        if (event.request?.url?.includes('/api/health')) {
          return null
        }
        
        // Skip monitoring/bot requests
        if (event.request?.headers?.['user-agent']?.includes('bot')) {
          return null
        }
        
        return event
      },
      
      // Capture additional context
      beforeSendTransaction(event) {
        // Add additional context for API routes
        if (event.transaction?.includes('/api/')) {
          event.tags = {
            ...event.tags,
            component: 'api',
          }
        }
        
        return event
      },
    })
  }

  // Check if we're in the Edge Runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge-specific Sentry initialization
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      
      // Performance Monitoring (lighter for edge)
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0,
      
      // Development vs Production settings
      debug: false,
      
      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    })
  }
} 