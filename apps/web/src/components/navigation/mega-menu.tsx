'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MegaMenuProps {
  isOpen: boolean
  onClose: () => void
}

const categories = [
  {
    title: 'Sneakers',
    description: 'Premium footwear collection',
    href: '/shop?type=sneaker',
    items: [
      { name: 'All Sneakers', href: '/shop?type=sneaker' },
      { name: 'Limited Edition', href: '/shop?type=sneaker&collection=limited' },
      { name: 'Classic Collection', href: '/shop?type=sneaker&collection=classic' },
      { name: 'New Arrivals', href: '/shop?type=sneaker&collection=new' }
    ]
  },
  {
    title: 'Bags',
    description: 'Luxury bag collection',
    href: '/shop?type=bag',
    items: [
      { name: 'All Bags', href: '/shop?type=bag' },
      { name: 'Backpacks', href: '/shop?type=bag&style=backpack' },
      { name: 'Messenger Bags', href: '/shop?type=bag&style=messenger' },
      { name: 'Travel Bags', href: '/shop?type=bag&style=travel' }
    ]
  },
  {
    title: 'Caps',
    description: 'Designer cap collection',
    href: '/shop?type=cap',
    items: [
      { name: 'All Caps', href: '/shop?type=cap' },
      { name: 'Baseball Caps', href: '/shop?type=cap&style=baseball' },
      { name: 'Beanies', href: '/shop?type=cap&style=beanie' },
      { name: 'Snapbacks', href: '/shop?type=cap&style=snapback' }
    ]
  }
]

const featured = [
  {
    title: 'Swiss Craftsmanship',
    description: 'Designed in Switzerland with premium materials',
    image: '/images/swiss-design.jpg',
    href: '/about'
  },
  {
    title: 'New Collection',
    description: 'Discover our latest arrivals',
    image: '/images/new-collection.jpg',
    href: '/shop?collection=new'
  }
]

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Mega Menu Content */}
      <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-12 gap-8">
            {/* Categories */}
            <div className="col-span-7 grid grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category.title} className="space-y-4">
                  <div>
                    <Link
                      href={category.href}
                      onClick={onClose}
                      className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors duration-200 group"
                    >
                      {category.title}
                      <span className="block text-sm font-normal text-gray-500 mt-1 group-hover:text-amber-500">
                        {category.description}
                      </span>
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="text-sm text-gray-600 hover:text-amber-600 hover:translate-x-1 transition-all duration-200 inline-block"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured Section */}
            <div className="col-span-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Featured
              </h3>
              <div className="space-y-4">
                {featured.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onClose}
                    className="group block rounded-xl overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="aspect-[16/9] relative bg-gradient-to-br from-amber-100 to-amber-50">
                      {/* Placeholder for image - replace with actual product images */}
                      <div className="absolute inset-0 flex items-center justify-center text-amber-600/20 font-bold text-6xl">
                        {item.title[0]}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Quick Links */}
              <div className="pt-4 border-t border-gray-200 mt-6">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    View All Products →
                  </Link>
                  <Link
                    href="/shop?collection=sale"
                    onClick={onClose}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Sale Items →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface MegaMenuTriggerProps {
  children: React.ReactNode
  className?: string
}

export function MegaMenuTrigger({ children, className }: MegaMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium',
          className
        )}
      >
        <span>{children}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <MegaMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  )
}
