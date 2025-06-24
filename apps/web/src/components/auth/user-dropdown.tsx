'use client'

import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { ChevronDown, Heart, LogOut, Settings, Shield, ShoppingBag, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function UserDropdown() {
  const { user, logout, isLoggedIn } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle escape key to close dropdown
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  const handleLogout = async () => {
    try {
      setIsOpen(false)
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!isLoggedIn || !user) {
    return null
  }

  const userInitials = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
          isOpen && "bg-gray-100"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-semibold">
          {userInitials}
        </div>
        
        {/* User Name (hidden on small screens) */}
        <span className="hidden md:block text-gray-700 max-w-32 truncate">
          {user.first_name}
        </span>
        
        {/* Chevron */}
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={cn(
            "absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5",
            "divide-y divide-gray-100 focus:outline-none z-50"
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {/* User Info Section */}
          <div className="px-4 py-3">
            <p className="text-sm text-gray-900 font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.email}
            </p>
            {!user.confirmed && (
              <div className="mt-2 flex items-center text-xs text-amber-600">
                <Shield className="h-3 w-3 mr-1" />
                Email not confirmed
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Dashboard
            </Link>
            
            <Link
              href="/profile"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Profile
            </Link>
            
            <Link
              href="/orders"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              My Orders
            </Link>
            
            <Link
              href="/wishlist"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Wishlist
            </Link>
            
            <Link
              href="/settings"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Settings
            </Link>
          </div>

          {/* Logout Section */}
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              role="menuitem"
            >
              <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 