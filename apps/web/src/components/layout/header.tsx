'use client'

import { NavigationLinks, defaultNavigationLinks, type NavigationLink } from '@/components/navigation/navigation-links'
import { Button } from '@/components/ui/button'
import { HeaderLogo } from '@/components/ui/logo'
import { useScrollHeader } from '@/hooks/use-scroll-header'
import { getSiteSettings } from '@/lib/sanity.queries'
import { SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Menu, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out',
        'glass-light border-b border-border/50 shadow-premium',
        // Dynamic positioning based on scroll
        isVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className="container mx-auto px-6">
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          // Dynamic height based on scroll position
          isAtTop ? 'h-20' : 'h-16'
        )}>
          {/* Logo */}
          <div onClick={closeMobileMenu} className="flex items-center">
            <HeaderLogo 
              showText={true}
              text={siteSettings?.logo?.text || 'Fitfoot'}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavigationLinks 
              links={navigationLinks}
              variant="header"
            />
          </nav>

          {/* CTA Button & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart Icon */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:inline-flex text-foreground hover:text-primary hover:bg-primary/10 p-2 transition-colors duration-300"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            
            {/* Primary CTA */}
            <Link href={siteSettings?.headerCta?.href || '/shop'}>
              <Button 
                size="sm" 
                className={cn(
                  'hidden sm:inline-flex btn-gold font-medium transition-all duration-300',
                  isAtTop ? 'text-base px-6 py-2.5' : 'text-sm px-5 py-2'
                )}
              >
                {siteSettings?.headerCta?.text || 'Shop Now'}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden text-foreground hover:text-primary hover:bg-primary/10 p-2 transition-colors duration-300"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="lg:hidden absolute left-0 right-0 top-full glass-light border-b border-border/50 shadow-luxury"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-8 space-y-6">
              {/* Mobile Navigation Links */}
              <nav className="space-y-4">
                <NavigationLinks 
                  links={navigationLinks}
                  variant="mobile"
                  onLinkClick={closeMobileMenu}
                />
              </nav>
              
              {/* Mobile Actions */}
              <div className="pt-6 border-t border-border/30 space-y-4">
                {/* Shopping Cart for Mobile */}
                <Button 
                  variant="outline" 
                  className="w-full btn-outline-gold justify-center"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shopping Cart
                </Button>
                
                {/* Primary CTA for Mobile */}
                <Link href={siteSettings?.headerCta?.href || '/shop'}>
                  <Button 
                    size="lg"
                    className="w-full btn-gold font-medium"
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