'use client'

import { Button } from '@/components/ui/button'
import { ProtectedRoute, useAuth } from '@/contexts/AuthContext'
import {
    CreditCard,
    Heart,
    Package,
    Settings,
    ShoppingBag,
    Star,
    TrendingUp,
    User,
    Zap
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface UserStats {
  totalOrders: number
  totalSpent: number
  sustainabilityScore: number
  carbonSaved: number
  wishlistItems: number
  memberSince: string
}

interface RecentActivity {
  id: string
  type: 'order' | 'wishlist' | 'review'
  title: string
  description: string
  date: string
  amount?: number
}

export default function Dashboard() {
  const { user, getAuthToken } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    sustainabilityScore: 0,
    carbonSaved: 0,
    wishlistItems: 0,
    memberSince: ''
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Use mock data for demo since API endpoints don't exist yet
      setStats({
        totalOrders: 12,
        totalSpent: 2847.50,
        sustainabilityScore: 92,
        carbonSaved: 78.4,
        wishlistItems: 5,
        memberSince: (user as any)?.created_at || new Date().toISOString()
      })
      setRecentActivity([
        {
          id: '1',
          type: 'order',
          title: 'Alpine Runner Pro - Refurbished',
          description: 'Order completed successfully',
          date: '2 days ago',
          amount: 209.30
        },
        {
          id: '2',
          type: 'wishlist',
          title: 'Urban Walker Elite',
          description: 'Added to wishlist',
          date: '1 week ago'
        },
        {
          id: '3',
          type: 'review',
          title: 'Swiss Hiking Boot',
          description: 'Left a 5-star review',
          date: '2 weeks ago'
        }
      ])
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CH', {
      style: 'currency',
      currency: 'CHF'
    }).format(amount)
  }

  const getSustainabilityBadge = (score: number) => {
    if (score >= 90) return { label: 'Eco Champion', color: 'bg-green-100 text-green-800', icon: '🌟' }
    if (score >= 75) return { label: 'Eco Warrior', color: 'bg-blue-100 text-blue-800', icon: '♻️' }
    if (score >= 50) return { label: 'Eco Conscious', color: 'bg-yellow-100 text-yellow-800', icon: '🌱' }
    return { label: 'Getting Started', color: 'bg-gray-100 text-gray-800', icon: '🌿' }
  }

  const badge = getSustainabilityBadge(stats.sustainabilityScore)

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.first_name}!</h1>
            <p className="mt-1 text-gray-600">Here's what's happening with your sustainable footwear journey</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">CO₂ Saved</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.carbonSaved}kg</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <Heart className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Wishlist</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sustainability Score */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Your Sustainability Impact</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                    {badge.icon} {badge.label}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Sustainability Score</span>
                    <span>{stats.sustainabilityScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.sustainabilityScore}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Refurbished purchases: 8</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Sustainable brands: 4</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'order' ? 'bg-green-100' :
                            activity.type === 'wishlist' ? 'bg-red-100' :
                            'bg-yellow-100'
                          }`}>
                            {activity.type === 'order' && <Package className="h-4 w-4 text-green-600" />}
                            {activity.type === 'wishlist' && <Heart className="h-4 w-4 text-red-600" />}
                            {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {activity.amount && (
                            <p className="font-medium text-gray-900">{formatCurrency(activity.amount)}</p>
                          )}
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* User Profile Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                <div className="text-center">
                  <div className="h-20 w-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-700">
                      {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h4>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  {user?.confirmed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      ✅ Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                      ⚠️ Unverified
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Member since {new Date(stats.memberSince).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Link href="/shop" className="flex items-center w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <ShoppingBag className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-blue-700 font-medium">Browse Shop</span>
                  </Link>
                  <Link href="/orders" className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Package className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">My Orders</span>
                  </Link>
                  <Link href="/wishlist" className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Heart className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Wishlist</span>
                  </Link>
                  <Link href="/profile" className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <User className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Profile</span>
                  </Link>
                  <Link href="/settings" className="flex items-center w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">Settings</span>
                  </Link>
                </div>
              </div>

              {/* Sustainability Tips */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Sustainability Tip
                </h4>
                <p className="text-sm text-green-800 mb-4">
                  Your next refurbished purchase could save an additional 6.8kg of CO₂! Keep up the great work towards a more sustainable future.
                </p>
                <Link href="/shop?filter=refurbished">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Shop Refurbished
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
