import type { Metadata } from 'next'
import { getSiteSettings } from './sanity.queries'

export async function generateMetadata(): Promise<Metadata> {
  let siteSettings = null
  try {
    siteSettings = await getSiteSettings()
  } catch (error) {
  }
  
  const title = siteSettings?.title || 'Fitfoot - Swiss-designed quality footwear'
  const description = siteSettings?.description || 'Step into quality. Designed in Switzerland. Premium footwear and accessories crafted with genuine materials.'
  const keywords = (siteSettings?.keywords && siteSettings.keywords.length > 0) 
    ? siteSettings.keywords 
    : ['footwear', 'shoes', 'Swiss design', 'quality', 'leather', 'accessories']
  const siteUrl = siteSettings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://fitfoot.ch'
  
  // Ensure we have a valid URL
  let validSiteUrl = siteUrl
  try {
    new URL(siteUrl)
  } catch {
    validSiteUrl = 'https://fitfoot.ch'
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Fitfoot' }],
    creator: 'Fitfoot',
    publisher: 'Fitfoot',
    metadataBase: new URL(validSiteUrl),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: validSiteUrl,
      title,
      description,
      siteName: 'Fitfoot',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
} 