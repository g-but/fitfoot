'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'header' | 'footer' | 'standalone'
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
  href?: string
  className?: string
  priority?: boolean
}

export function Logo({ 
  variant = 'header', 
  size = 'md', 
  showText = false,
  text = 'Fitfoot',
  href = '/',
  className,
  priority = false
}: LogoProps) {
  // Using rectangular dimensions that work better for logos
  const sizeClasses = {
    sm: 'h-8 w-14',      // 32x56px - smaller and wider
    md: 'h-10 w-16',     // 40x64px - wider for logo
    lg: 'h-12 w-20'      // 48x80px - larger and wider for logo
  }

  const textSizeClasses = {
    sm: 'text-lg',        
    md: 'text-xl',       
    lg: 'text-2xl'        
  }

  const LogoImage = () => (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        'logo-container rounded-lg overflow-hidden',
        sizeClasses[size],
        'transition-all duration-300',
        // Better styling for dark header
        variant === 'header' ? 'bg-white/10 backdrop-blur-sm border border-white/20' : 'bg-transparent'
      )}>
        <Image
          src="/logo1.png"
          alt={`${text} logo`}
          fill
          className="logo-image logo-cropped transition-opacity duration-300 hover:opacity-90"
          priority={priority}
        />
      </div>
      {showText && (
        <span className={cn(
          'font-semibold tracking-wide',
          textSizeClasses[size],
          // Fixed text colors with proper hover states
          variant === 'footer' 
            ? 'text-background hover:text-primary' 
            : variant === 'header' 
              ? 'text-white hover:text-primary' 
              : 'text-foreground hover:text-primary',
          'transition-colors duration-300'
        )}>
          {text}
        </span>
      )}
    </div>
  )

  const FallbackLogo = () => (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className={cn(
        'font-semibold tracking-wide',
        textSizeClasses[size],
        // Fixed text colors with proper hover states
        variant === 'footer' 
          ? 'text-background hover:text-primary' 
          : variant === 'header' 
            ? 'text-white hover:text-primary' 
            : 'text-foreground hover:text-primary',
        'transition-colors duration-300'
      )}>
        {text}
      </div>
    </div>
  )

  // Try to render image logo, fallback to text if needed
  const logoContent = (
    <React.Suspense fallback={<FallbackLogo />}>
      <LogoImage />
    </React.Suspense>
  )

  if (href) {
    return (
      <Link 
        href={href} 
        className="logo-link flex items-center transition-all duration-300 hover:opacity-90 group"
        aria-label={`${text} - Go to homepage`}
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

// Specialized logo components for common use cases
export function HeaderLogo({ 
  showText = true,     // Show text alongside logo
  text, 
  className 
}: { 
  showText?: boolean; 
  text?: string; 
  className?: string 
}) {
  return (
    <Logo 
      variant="header" 
      size="sm" 
      showText={showText} 
      text={text}
      className={className}
      priority={true}
    />
  )
}

export function FooterLogo({ 
  showText = true, 
  text, 
  className 
}: { 
  showText?: boolean; 
  text?: string; 
  className?: string 
}) {
  return (
    <Logo 
      variant="footer" 
      size="md" 
      showText={showText} 
      text={text}
      href={undefined}
      className={className}
    />
  )
} 