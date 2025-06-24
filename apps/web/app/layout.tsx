import { ErrorBoundary } from '@/components/error-boundary'
import { RootLayoutContent } from '@/components/layout/RootLayoutContent'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import type { Metadata, Viewport } from 'next'
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
    default: 'Fitfoot - Premium Footwear & Accessories',
    template: '%s | Fitfoot'
  },
  description: 'Elevate your everyday with premium footwear and accessories crafted with genuine materials and uncompromising attention to detail. Experience timeless quality.',
  keywords: [
    'premium footwear', 'luxury sneakers', 'quality accessories', 
    'genuine leather', 'Swiss design', 'high-quality shoes', 
    'sustainable fashion', 'artisan crafted', 'premium lifestyle'
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
    title: 'Fitfoot - Premium Footwear & Accessories',
    description: 'Elevate your everyday with premium footwear and accessories crafted with genuine materials and uncompromising attention to detail.',
    siteName: 'Fitfoot',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fitfoot - Premium Footwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitfoot - Premium Swiss Footwear & Accessories',
    description: 'Elevate your everyday with premium footwear and accessories crafted to perfection.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
          <AuthProvider>
            <CartProvider>
              <PerformanceMonitor />
              <RootLayoutContent>
                {children}
              </RootLayoutContent>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 