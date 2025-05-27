import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSiteSettings } from '@/lib/sanity.queries'

export async function Header() {
  // Fetch site settings from Sanity
  const siteSettings = await getSiteSettings()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">
              {siteSettings?.logo?.text || 'Fitfoot'}
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteSettings?.navigation && siteSettings.navigation.length > 0 ? (
              siteSettings.navigation.map((item, index: number) => (
                <Link 
                  key={index}
                  href={item.href} 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link 
                  href="/" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  Home
                </Link>
                <Link 
                  href="/products" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  Products
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Button variant="accent" size="sm" className="hidden sm:inline-flex">
              {siteSettings?.headerCta?.text || 'Shop Now'}
            </Button>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 