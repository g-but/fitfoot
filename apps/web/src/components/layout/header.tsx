'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeaderLogo } from '@/components/ui/logo'
import { NavigationLinks, defaultNavigationLinks, type NavigationLink } from '@/components/navigation/navigation-links'
import { getSiteSettings } from '@/lib/sanity.queries'
import { SiteSettings } from '@/lib/types'
import { useScrollHeader } from '@/hooks/use-scroll-header'
import { cn } from '@/lib/utils'

interface HeaderProps {
  siteSettings?: SiteSettings | null
}

export function HeaderClient({ siteSettings }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isVisible, isAtTop } = useScrollHeader()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Use navigation from Sanity or fallback to defaults
  const navigationLinks: NavigationLink[] = siteSettings?.navigation && siteSettings.navigation.length > 0 
    ? siteSettings.navigation.map(item => ({
        label: item.label,
        href: item.href
      }))
    : defaultNavigationLinks

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out',
        'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 luxury-shadow',
        // Dynamic positioning based on scroll
        isVisible ? 'translate-y-0' : '-translate-y-full',
        // Dynamic sizing based on scroll position
        isAtTop ? 'py-0' : 'py-1'
      )}
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          // Dynamic height based on scroll position
          isAtTop ? 'h-16' : 'h-14'
        )}>
          {/* Logo */}
          <div onClick={closeMobileMenu} className="flex items-center">
            <HeaderLogo 
              showText={true}
              text={siteSettings?.logo?.text || 'Fitfoot'}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavigationLinks 
              links={navigationLinks}
              variant="header"
            />
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <Link href={siteSettings?.headerCta?.href || '/shop'}>
              <Button 
                variant="gold" 
                size="sm" 
                className={cn(
                  'hidden sm:inline-flex font-medium transition-all duration-300',
                  isAtTop ? 'text-base px-6 py-2.5' : 'text-sm px-5 py-2'
                )}
              >
                {siteSettings?.headerCta?.text || 'Shop Now'}
              </Button>
            </Link>
            
            {/* Mobile menu button - Fixed hover state */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-gray-300 hover:text-primary hover:bg-gray-800/50 p-2 transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden absolute left-0 right-0 top-full bg-gray-900/98 backdrop-blur-md border-b border-gray-700/50 luxury-shadow"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-6 space-y-3">
              <NavigationLinks 
                links={navigationLinks}
                variant="mobile"
                onLinkClick={closeMobileMenu}
              />
              
              {/* Mobile CTA Button */}
              <div className="pt-4 border-t border-gray-700/30">
                <Link href={siteSettings?.headerCta?.href || '/shop'}>
                  <Button 
                    variant="gold" 
                    size="sm" 
                    className="w-full text-base py-2.5 font-medium"
                    onClick={closeMobileMenu}
                  >
                    {siteSettings?.headerCta?.text || 'Shop Now'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

// Server Component wrapper
export async function Header() {
  const siteSettings = await getSiteSettings()
  return <HeaderClient siteSettings={siteSettings} />
} 