'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initPerformanceMonitoring, trackPageLoad } from '@/lib/performance'

export function PerformanceMonitor() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize performance monitoring once
    initPerformanceMonitoring()
  }, [])

  useEffect(() => {
    // Track page load for each route change
    const endPageLoad = trackPageLoad(pathname)
    
    // Return cleanup function to mark page load complete
    return endPageLoad
  }, [pathname])

  // This component doesn't render anything
  return null
} 