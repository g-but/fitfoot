import * as Sentry from '@sentry/nextjs'

// Client-side Sentry initialization
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Development vs Production settings
  debug: process.env.NODE_ENV === 'development',
  
  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
  
  // Filter out some common, non-actionable errors
  beforeSend(event) {
    // Filter out browser extension errors
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.stacktrace?.frames) {
        const lastFrame = error.stacktrace.frames[error.stacktrace.frames.length - 1]
        if (lastFrame?.filename?.includes('extension://')) {
          return null
        }
      }
    }
    
    // Filter out ResizeObserver errors (common browser quirk)
    if (event.message?.includes('ResizeObserver loop limit exceeded')) {
      return null
    }
    
    return event
  },
});

// Required for Next.js App Router navigation tracking
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;