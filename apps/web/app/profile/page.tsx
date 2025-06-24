'use client'

import { Button } from '@/components/ui/button'
import { ProtectedRoute, useAuth } from '@/contexts/AuthContext'
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Edit3,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Shield,
    User,
    X
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  address?: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  confirmed: boolean
  created_at?: string
}

export default function ProfilePage() {
  const { user, getAuthToken } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    address: {
      street: '',
      city: '',
      postal_code: '',
      country: 'Switzerland'
    }
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const token = getAuthToken()
      
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setFormData({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          phone: data.profile.phone || '',
          date_of_birth: data.profile.date_of_birth || '',
          address: {
            street: data.profile.address?.street || '',
            city: data.profile.address?.city || '',
            postal_code: data.profile.address?.postal_code || '',
            country: data.profile.address?.country || 'Switzerland'
          }
        })
      } else {
        setError('Failed to load profile')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      const token = getAuthToken()
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setSuccess('Profile updated successfully!')
        setEditing(false)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          postal_code: profile.address?.postal_code || '',
          country: profile.address?.country || 'Switzerland'
        }
      })
    }
    setEditing(false)
    setError('')
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-600" />
            <p className="mt-2 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="mt-1 text-gray-600">Manage your personal information and preferences</p>
              </div>
              {!editing && (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-gray-600">{profile?.email}</p>
                  
                  {/* Email Confirmation Status */}
                  <div className="mt-4">
                    {profile?.confirmed ? (
                      <div className="flex items-center justify-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Email Verified
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="flex items-center justify-center text-amber-600 text-sm mb-2">
                          <Shield className="h-4 w-4 mr-1" />
                          Email Not Verified
                        </div>
                        <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700">
                          Resend Verification
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Member Since */}
                  {profile?.created_at && (
                    <div className="mt-4 text-sm text-gray-500">
                      Member since {formatDate(profile.created_at)}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Link href="/orders" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    View Orders
                  </Link>
                  <Link href="/wishlist" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    My Wishlist
                  </Link>
                  <Link href="/settings" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                    <User className="h-4 w-4 mr-3" />
                    Account Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  {editing && (
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleCancel}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      First Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.first_name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Last Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.last_name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <p className="text-gray-900">{profile?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+41 79 123 45 67"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Date of Birth
                    </label>
                    {editing ? (
                      <input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{formatDate(profile?.date_of_birth)}</p>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Address Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Street Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => handleInputChange('address.street', e.target.value)}
                          placeholder="Street address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.address?.street || 'Not provided'}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) => handleInputChange('address.city', e.target.value)}
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.address?.city || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          value={formData.address.postal_code}
                          onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
                          placeholder="1234"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.address?.postal_code || 'Not provided'}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      {editing ? (
                        <select
                          value={formData.address.country}
                          onChange={(e) => handleInputChange('address.country', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="Switzerland">Switzerland</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Austria">Austria</option>
                          <option value="Italy">Italy</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile?.address?.country || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 