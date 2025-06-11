import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ErrorBoundary } from '@/components/error-boundary'
import { PerformanceMonitor } from '@/components/performance-monitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fitfoot - Premium Footwear & Accessories',
  description: 'Step into quality. Premium footwear and accessories crafted with genuine materials and precision engineering.',
  keywords: ['footwear', 'Swiss design', 'premium', 'sneakers', 'accessories', 'quality'],
  authors: [{ name: 'Fitfoot' }],
  creator: 'Fitfoot',
  publisher: 'Fitfoot',
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
    title: 'Fitfoot - Premium Footwear & Accessories',
    description: 'Step into quality. Premium footwear and accessories crafted with genuine materials and precision engineering.',
    siteName: 'Fitfoot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitfoot - Premium Footwear & Accessories',
    description: 'Step into quality. Premium footwear and accessories crafted with genuine materials and precision engineering.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <PerformanceMonitor />
          <Header />
          <main className="pt-16">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
} 