'use client'

import { UserDropdown } from '@/components/auth/user-dropdown'
import { defaultNavigationLinks, type NavigationLink } from '@/components/navigation/navigation-links'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useScrollHeader } from '@/hooks/use-scroll-header'
import { SiteSettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ChevronRight, Home, Info, Mail, Menu, Package, Search, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeaderProps {
  siteSettings?: SiteSettings | null
}

export function HeaderClient({ siteSettings }: HeaderProps) {
  const { isAtTop } = useScrollHeader()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isLoggedIn, hydrated } = useAuth()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()
  const hasItems = itemCount > 0

  const navigationLinks: NavigationLink[] =
    siteSettings?.navigation && siteSettings.navigation.length > 0
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

  // Handle mobile menu
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

  // Render auth buttons/dropdown with hydration safety
  const renderAuthSection = () => {
    // Prevent hydration mismatch by not rendering auth UI until hydrated
    if (!hydrated) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      )
    }

    if (isLoggedIn && user) {
      return <UserDropdown />
    }

    return (
      <div className="flex items-center space-x-2">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            Login
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
          'bg-white border-b border-gray-200 shadow-sm',
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Using DRY principle with Logo component */}
            <Logo 
              variant="header" 
              size="lg" 
              showText={true}
              text={siteSettings?.logo?.text || 'Fitfoot'}
              className="flex-shrink-0"
            />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
              
              {/* About Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-gray-900 flex items-center">
                  About
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      About Us
                    </Link>
                    <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Our Products
                    </Link>
                  </div>
                </div>
              </div>
              
              <Link href="/shop" className="text-gray-700 hover:text-gray-900">
                Shop
              </Link>
              
              {/* Social Media Icons */}
              <div className="flex items-center space-x-3">
                <a 
                  href="https://facebook.com/fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                  aria-label="Follow us on Facebook"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://instagram.com/fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-600 transition-colors duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://linkedin.com/company/fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-700 transition-colors duration-300"
                  aria-label="Follow us on LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://tiktok.com/@fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors duration-300"
                  aria-label="Follow us on TikTok"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-black transition-colors duration-300"
                  aria-label="Follow us on X"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/fitfoot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-red-600 transition-colors duration-300"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/cart" className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 relative"
                  aria-label={`Shopping cart ${hasItems ? `with ${itemCount} items` : '(empty)'}`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {hasItems && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Authentication Section with Hydration Safety */}
              {renderAuthSection()}
              
              <Link href={siteSettings?.headerCta?.href || '/shop'}>
                <Button size="sm" className="bg-amber-600 text-white hover:bg-amber-700">
                  {siteSettings?.headerCta?.text || 'Shop Now'}
                </Button>
              </Link>
            </div>

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
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {isMobileMenuOpen ? '1' : '0'}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Fixed z-index hierarchy */}
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
                {navigationLinks.map((link, index) => (
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
                        <span className="text-sm font-medium text-gray-700">
                          {user.first_name[0]}{user.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
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
                <Link href={siteSettings?.headerCta?.href || '/shop'} onClick={closeMobileMenu}>
                  <Button className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 rounded-xl font-semibold text-lg shadow-lg">
                    {siteSettings?.headerCta?.text || 'Shop Now'}
                  </Button>
                </Link>
                
                {/* Social Media Icons for Mobile */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-4 text-center">Follow Us</p>
                  <div className="flex justify-center space-x-6">
                    <a 
                      href="https://facebook.com/fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-300 p-2"
                      aria-label="Follow us on Facebook"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://instagram.com/fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-pink-600 transition-colors duration-300 p-2"
                      aria-label="Follow us on Instagram"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/company/fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-700 transition-colors duration-300 p-2"
                      aria-label="Follow us on LinkedIn"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://tiktok.com/@fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black transition-colors duration-300 p-2"
                      aria-label="Follow us on TikTok"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://x.com/fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-black transition-colors duration-300 p-2"
                      aria-label="Follow us on X"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://youtube.com/fitfoot" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-red-600 transition-colors duration-300 p-2"
                      aria-label="Subscribe to our YouTube channel"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

// Import for server component only
import { getSiteSettings } from '@/lib/sanity.queries'

// Server Component Wrapper - Single export following DRY principle
export async function Header() {
  const siteSettings = await getSiteSettings()
  return <HeaderClient siteSettings={siteSettings} />
} 