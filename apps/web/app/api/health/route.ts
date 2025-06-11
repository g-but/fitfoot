import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check basic server health
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      node_version: process.version,
    }

    // Basic dependency checks
    const checks = {
      database: await checkSanity(),
      ecommerce: await checkMedusa(),
    }

    return NextResponse.json({
      ...health,
      dependencies: checks,
      overall_status: Object.values(checks).every(check => check.status === 'healthy') ? 'healthy' : 'degraded'
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Check Sanity CMS connectivity
async function checkSanity() {
  try {
    const response = await fetch(`https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v${process.env.NEXT_PUBLIC_SANITY_API_VERSION}/data/query/${process.env.NEXT_PUBLIC_SANITY_DATASET}?query=*[_type == "siteSettings"][0]{_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      return { status: 'healthy', latency: Date.now() }
    } else {
      return { status: 'unhealthy', error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Connection failed' 
    }
  }
}

// Check Medusa e-commerce connectivity
async function checkMedusa() {
  try {
    // If Medusa is not configured, mark as not applicable
    if (!process.env.MEDUSA_BACKEND_URL) {
      return { status: 'not_configured', message: 'Medusa not configured' }
    }

    const response = await fetch(`${process.env.MEDUSA_BACKEND_URL}/store/products?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      return { status: 'healthy', latency: Date.now() }
    } else {
      return { status: 'unhealthy', error: `HTTP ${response.status}` }
    }
  } catch (error) {
    return { 
      status: 'degraded', 
      error: error instanceof Error ? error.message : 'Connection failed',
      message: 'Fallback to mock data available'
    }
  }
} 