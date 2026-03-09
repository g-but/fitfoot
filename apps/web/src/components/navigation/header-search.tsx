'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Content */}
          <div className="relative z-10 pt-20 px-4">
            <div className="mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="pl-6 pr-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for sneakers, bags, caps..."
                    className="flex-1 py-5 text-lg outline-none placeholder:text-gray-400"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-5 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Quick Links */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Sneakers', 'Leather Bags', 'Limited Edition', 'New Arrivals', 'Swiss Design'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setQuery(term)
                            router.push(`/shop?search=${encodeURIComponent(term)}`)
                            setIsOpen(false)
                          }}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
