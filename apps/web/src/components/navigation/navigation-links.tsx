import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface NavigationLink {
  label: string
  href: string
}

interface NavigationLinksProps {
  links: NavigationLink[]
  variant?: 'header' | 'footer' | 'mobile'
  className?: string
  onLinkClick?: () => void
}

export function NavigationLinks({ 
  links, 
  variant = 'header', 
  className,
  onLinkClick 
}: NavigationLinksProps) {
  const baseStyles = "font-medium transition-all duration-300 relative group"
  
  const variantStyles = {
    header: "text-base text-gray-300 hover:text-primary",
    footer: "text-base text-gray-300 hover:text-primary",
    mobile: "block text-lg text-gray-300 hover:text-primary py-3"
  }

  const underlineStyles = {
    header: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
    footer: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
    mobile: "" // No underline for mobile
  }

  return (
    <>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={cn(
            baseStyles,
            variantStyles[variant],
            variant !== 'mobile' && 'inline-block',
            className
          )}
          onClick={onLinkClick}
        >
          {link.label}
          {variant !== 'mobile' && (
            <span className={underlineStyles[variant]}></span>
          )}
        </Link>
      ))}
    </>
  )
}

// Default navigation links - can be overridden
export const defaultNavigationLinks: NavigationLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] 