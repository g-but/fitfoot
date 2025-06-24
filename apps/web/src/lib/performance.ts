import * as Sentry from '@sentry/nextjs'

/**
 * Performance monitoring utilities for tracking key metrics
 */

// Core Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return

  // Track Largest Contentful Paint (LCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        Sentry.addBreadcrumb({
          category: 'performance',
          message: 'LCP measured',
          level: 'info',
          data: {
            value: entry.startTime,
            metric: 'LCP'
          }
        })
        
        // Report to Sentry as custom metric
        Sentry.setMeasurement('lcp', entry.startTime, 'millisecond')
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  } catch (e) {
    // PerformanceObserver not supported
  }
}

// Track page load performance
export const trackPageLoad = (pageName: string) => {
  if (typeof window === 'undefined') return

  const startTime = performance.now()
  
  return () => {
    const loadTime = performance.now() - startTime
    
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Page loaded: ${pageName}`,
      level: 'info',
      data: {
        loadTime,
        page: pageName
      }
    })
    
    // Set custom tag for the page
    Sentry.setTag('page_name', pageName)
    Sentry.setMeasurement(`page_load_${pageName}`, loadTime, 'millisecond')
  }
}

// Track user interactions
export const trackUserInteraction = (action: string, element?: string, value?: number) => {
  Sentry.addBreadcrumb({
    category: 'user',
    message: `User interaction: ${action}`,
    level: 'info',
    data: {
      action,
      element,
      value,
      timestamp: Date.now()
    }
  })
}

// Track API call performance
export const trackApiCall = async <T>(
  endpoint: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now()
  
  try {
    const result = await apiCall()
    const duration = performance.now() - startTime
    
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API call successful: ${endpoint}`,
      level: 'info',
      data: {
        endpoint,
        duration,
        status: 'success'
      }
    })
    
    Sentry.setMeasurement(`api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`, duration, 'millisecond')
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API call failed: ${endpoint}`,
      level: 'error',
      data: {
        endpoint,
        duration,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
    
    // Capture the error with additional context
    Sentry.withScope((scope) => {
      scope.setTag('api_endpoint', endpoint)
      scope.setContext('api_call', {
        endpoint,
        duration,
        timestamp: Date.now()
      })
      Sentry.captureException(error)
    })
    
    throw error
  }
}

// Track e-commerce events
export const trackEcommerceEvent = (
  event: 'product_view' | 'add_to_cart' | 'purchase' | 'search',
  data: {
    productId?: string
    productName?: string
    price?: number
    currency?: string
    searchTerm?: string
  }
) => {
  Sentry.addBreadcrumb({
    category: 'ecommerce',
    message: `E-commerce event: ${event}`,
    level: 'info',
    data: {
      event,
      ...data,
      timestamp: Date.now()
    }
  })
  
  // Set user context for e-commerce tracking
  Sentry.setContext('ecommerce', {
    lastEvent: event,
    lastProduct: data.productId,
    timestamp: Date.now()
  })
}

// Track form interactions
export const trackFormEvent = (
  formName: string,
  event: 'start' | 'submit' | 'error' | 'abandon',
  errorMessage?: string
) => {
  Sentry.addBreadcrumb({
    category: 'form',
    message: `Form event: ${formName} - ${event}`,
    level: event === 'error' ? 'error' : 'info',
    data: {
      formName,
      event,
      errorMessage,
      timestamp: Date.now()
    }
  })
  
  if (event === 'error' && errorMessage) {
    Sentry.captureMessage(`Form error in ${formName}: ${errorMessage}`, 'warning')
  }
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return
  
  // Track Core Web Vitals
  trackWebVitals()
  
  // Track navigation timing
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      // DNS lookup time
      const dnsTime = navigation.domainLookupEnd - navigation.domainLookupStart
      Sentry.setMeasurement('dns_time', dnsTime, 'millisecond')
      
      // TCP connection time
      const connectTime = navigation.connectEnd - navigation.connectStart
      Sentry.setMeasurement('connect_time', connectTime, 'millisecond')
      
      // Time to first byte
      const ttfb = navigation.responseStart - navigation.requestStart
      Sentry.setMeasurement('ttfb', ttfb, 'millisecond')
      
      // DOM loading time
      const domLoadTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      Sentry.setMeasurement('dom_load_time', domLoadTime, 'millisecond')
      
      // Full page load time
      const fullLoadTime = navigation.loadEventEnd - navigation.loadEventStart
      Sentry.setMeasurement('full_load_time', fullLoadTime, 'millisecond')
    }
  })
} 