import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET() {
  try {
    console.log('🔧 Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      useCdn: client.config().useCdn
    })

    console.log('🔍 Testing Sanity connection from API route...')
    
    // Force fresh data by disabling CDN
    const freshClient = client.withConfig({ useCdn: false })
    
    // Test basic connection
    const allHomeDocs = await freshClient.fetch(`count(*[_type == "homePage"])`)
    console.log('📄 All home page docs:', allHomeDocs)
    
    // Get the actual data
    const homePageData = await freshClient.fetch(`
      *[_type == "homePage"][0] {
        _id,
        _updatedAt,
        title,
        heroTitle,
        heroSubtitle,
        heroImage,
        featuredProducts[]-> {
          _id,
          title,
          slug,
          heroImage,
          type
        },
        aboutSection,
        ctaSection
      }
    `)
    
    console.log('🔍 Fresh home page data:', JSON.stringify(homePageData, null, 2))
    
    return NextResponse.json({
      success: true,
      data: homePageData,
      timestamp: new Date().toISOString(),
      clientConfig: {
        projectId: client.config().projectId,
        dataset: client.config().dataset,
        apiVersion: client.config().apiVersion,
        useCdn: client.config().useCdn
      }
    })
  } catch (error) {
    console.error('❌ Error fetching home page data:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 