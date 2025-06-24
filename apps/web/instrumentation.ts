import * as Sentry from '@sentry/nextjs'

// This function is called when the Next.js server starts
export function register() {
  // Skip Sentry in development to avoid cluttering terminal
  if (process.env.NODE_ENV === 'development') {
    console.log('Sentry: Disabled in development for cleaner terminal output')
    return
  }

  // Check if we're in the server environment
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Error filtering
      beforeSend(event) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          return event
        }
        
        // Filter out known noise
        if (event.exception?.values?.[0]?.value?.includes('ChunkLoadError')) {
          return null
        }
        
        return event
      },
      
      // Environment and tags
      environment: process.env.NODE_ENV,
      initialScope: {
        tags: {
          component: 'nextjs-server',
          service: 'fitfoot-web',
        },
      },
      
      // Basic integrations to reduce noise
      integrations: [
        Sentry.httpIntegration(),
      ],
    })
  }

  // Check if we're in the Edge Runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV,
    })
  }
} 