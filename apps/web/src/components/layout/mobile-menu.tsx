'use client'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/AuthContext'
import { SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChevronRight, Home, Info, Mail, Menu, Package, Search, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface MobileMenuProps {
  siteSettings?: SiteSettings | null
}

const defaultNavigationLinks = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Shop', href: '/shop', icon: 'shop' },
  { label: 'About', href: '/about', icon: 'info' },
  { label: 'Contact', href: '/contact', icon: 'mail' }
]

export function MobileMenu({ siteSettings }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isLoggedIn } = useAuth()

  const navigationLinks = siteSettings?.navigation && siteSettings.navigation.length > 0
    ? siteSettings.navigation.map((item) => ({
        label: item.label,
        href: item.href,
      }))
    : defaultNavigationLinks

  const getNavIcon = (href: string) => {
    switch (href) {
      case '/':
        return <Home className="h-5 w-5" />
      case '/shop':
        return <Package className="h-5 w-5" />
      case '/about':
        return <Info className="h-5 w-5" />
      case '/contact':
        return <Mail className="h-5 w-5" />
      default:
        return <ChevronRight className="h-4 w-4" />
    }
  }

  // Handle mobile menu body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={cn(
          "md:hidden p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 min-w-[48px] min-h-[48px] flex items-center justify-center",
          isMobileMenuOpen 
            ? "bg-amber-100 text-amber-700 shadow-lg" 
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
        )}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        type="button"
        style={{ touchAction: 'manipulation' }}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
        {/* Debug indicator */}
        {process.env.NODE_ENV === 'development' && (
          <span 
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
            suppressHydrationWarning
          >
            {isMobileMenuOpen ? '1' : '0'}
          </span>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav 
            id="mobile-menu"
            className={cn(
              "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
            aria-label="Mobile navigation"
          >
            {/* Menu Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 bg-amber-50">
              <Logo 
                variant="header" 
                size="sm" 
                showText={true}
                text="Fitfoot"
                href="/"
              />
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm placeholder:text-gray-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-sm"
                  aria-label="Search products"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "flex items-center justify-between rounded-xl p-4 text-gray-900 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 group",
                      "transform hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-700 transition-all duration-200 shadow-sm">
                        {getNavIcon(link.href)}
                      </div>
                      <span className="font-semibold text-lg">{link.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-8 space-y-4">
                {/* Authentication for Mobile */}
                {isLoggedIn && user ? (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span 
                          className="text-sm font-medium text-gray-700"
                          suppressHydrationWarning
                        >
                          {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900" suppressHydrationWarning>
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-gray-600" suppressHydrationWarning>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link href="/orders" onClick={closeMobileMenu}>
                        <Button variant="outline" size="sm" className="w-full">
                          My Orders
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 space-y-2">
                    <Link href="/auth/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start h-14 border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold"
                  onClick={closeMobileMenu}
                  aria-label="View shopping cart"
                >
                  <ShoppingBag className="mr-4 h-6 w-6" aria-hidden="true" />
                  Shopping Cart
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
} 