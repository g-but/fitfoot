import { ErrorBoundary } from '@/components/error-boundary'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { PerformanceMonitor } from '@/components/performance-monitor'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Fitfoot - Premium Swiss Footwear & Accessories',
    template: '%s | Fitfoot'
  },
  description: 'Step into quality. Premium footwear and accessories designed in Switzerland, crafted with genuine materials and precision engineering. Experience Swiss luxury.',
  keywords: [
    'Swiss footwear', 'premium sneakers', 'luxury accessories', 
    'genuine leather', 'Swiss design', 'high-quality shoes', 
    'sustainable fashion', 'artisan crafted', 'Swiss luxury'
  ],
  authors: [{ name: 'Fitfoot Switzerland' }],
  creator: 'Fitfoot',
  publisher: 'Fitfoot',
  category: 'Fashion & Lifestyle',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fitfoot.ch',
    title: 'Fitfoot - Premium Swiss Footwear & Accessories',
    description: 'Step into quality. Premium footwear and accessories designed in Switzerland, crafted with genuine materials and precision engineering.',
    siteName: 'Fitfoot',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fitfoot - Premium Swiss Footwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitfoot - Premium Swiss Footwear & Accessories',
    description: 'Step into quality. Premium footwear and accessories designed in Switzerland.',
    images: ['/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <PerformanceMonitor />
          <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
} 