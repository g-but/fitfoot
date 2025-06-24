'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    MapPin,
    Package,
    Search,
    Truck
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface OrderItem {
  id: string
  name: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  currency_code: string
  created_at: string
  estimated_delivery_date: string
  items: Array<{
    id: string
    title: string
    variant_title?: string
    quantity: number
    unit_price: number
    total: number
  }>
  payment_status: string
  fulfillment_status: string
  tracking_number?: string
  tracking_url?: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    order_number: 'FF-2024-001',
    status: 'delivered',
    total: 299.99,
    currency_code: 'CHF',
    created_at: '2024-01-15',
    estimated_delivery_date: '2024-01-20',
    items: [
      {
        id: '1',
        title: 'Eco Trail Runner',
        variant_title: 'Forest Green',
        quantity: 1,
        unit_price: 179.99,
        total: 179.99
      },
      {
        id: '2',
        title: 'Sustainable Socks (3-pack)',
        variant_title: 'Mixed',
        quantity: 1,
        unit_price: 29.99,
        total: 29.99
      }
    ],
    payment_status: 'paid',
    fulfillment_status: 'shipped',
    tracking_number: 'CH-POST-123456789',
    tracking_url: 'https://www.post.ch'
  },
  {
    id: '2',
    order_number: 'FF-2024-002',
    status: 'shipped',
    total: 159.99,
    currency_code: 'CHF',
    created_at: '2024-01-20',
    estimated_delivery_date: '2024-01-25',
    items: [
      {
        id: '3',
        title: 'Refurbished Urban Sneaker',
        variant_title: 'Ocean Blue',
        quantity: 1,
        unit_price: 139.99,
        total: 139.99
      }
    ],
    payment_status: 'paid',
    fulfillment_status: 'shipped',
    tracking_number: 'CH-POST-987654321',
    tracking_url: 'https://www.post.ch'
  },
      {
      id: '3',
      order_number: 'FF-2024-003',
      status: 'pending',
      total: 89.99,
      currency_code: 'CHF',
      created_at: '2024-01-25',
      estimated_delivery_date: '2024-01-30',
      items: [
        {
          id: '4',
          title: 'Eco Casual Loafer',
          variant_title: 'Natural Brown',
          quantity: 1,
          unit_price: 89.99,
          total: 89.99
        }
      ],
      payment_status: 'pending',
      fulfillment_status: 'pending',
      tracking_number: undefined,
      tracking_url: undefined
    }
]

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchOrders()
    }
  }, [isLoggedIn, user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?customer_id=${user?.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const ordersData = await response.json()
      setOrders(ordersData)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setError(error instanceof Error ? error.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'confirmed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'Pending Payment'
      case 'confirmed':
        return 'Confirmed'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
      case 'processing':
        return <Package className="h-4 w-4" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your order history.
          </p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg border">
                  <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchOrders}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => setSelectedOrder(null)}
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order {selectedOrder.order_number}</h1>
                <p className="mt-1 text-gray-600">Placed on {formatDate(selectedOrder.created_at)}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(selectedOrder.status)}`}>
                {getStatusIcon(selectedOrder.status)}
                <span className="ml-2 capitalize">{getStatusText(selectedOrder.status)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        {item.variant_title && item.variant_title !== 'Default' && (
                          <p className="text-sm text-gray-600">{item.variant_title}</p>
                        )}
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatPrice(item.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="flex items-center font-semibold text-gray-900 mb-4">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{selectedOrder.tracking_url ? (
                    <Link href={selectedOrder.tracking_url} target="_blank" rel="noopener noreferrer">
                      {selectedOrder.tracking_number}
                    </Link>
                  ) : selectedOrder.tracking_number}</p>
                </div>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Order Status</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">Order Placed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${['confirmed', 'shipped', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-900">Order Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${['shipped', 'delivered'].includes(selectedOrder.status) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-900">Order Shipped</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`h-2 w-2 rounded-full ${selectedOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm text-gray-900">Order Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">
            Track your orders and view your purchase history
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Package className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link href="/shop">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.order_number}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{getStatusText(order.status)}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>Placed on {formatDate(order.created_at)}</span>
                        <span>•</span>
                        <span>{formatPrice(order.total)}</span>
                        <span>•</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {order.tracking_number && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                      )}
                      
                      <Link href={`/orders/${order.id}/confirmation`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          {item.variant_title && item.variant_title !== 'Default' && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.variant_title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity} • {formatPrice(item.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Progress */}
                {order.status !== 'cancelled' && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {order.status === 'pending_payment' ? (
                            <>
                              <Clock className="h-4 w-4 text-yellow-500" />
                              <span className="text-gray-700">Awaiting payment processing</span>
                            </>
                          ) : order.status === 'shipped' ? (
                            <>
                              <Truck className="h-4 w-4 text-purple-500" />
                              <span className="text-gray-700">
                                Estimated delivery: {formatDate(order.estimated_delivery_date)}
                              </span>
                            </>
                          ) : order.status === 'delivered' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-700">Order delivered successfully</span>
                            </>
                          ) : (
                            <>
                              <Package className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-700">Order being processed</span>
                            </>
                          )}
                        </div>
                        
                        {order.status === 'pending_payment' && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                            Payment integration coming soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sustainability Message */}
        {filteredOrders.length > 0 && (
          <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Your Sustainable Impact</h3>
            <p className="text-green-700">
              Thank you for choosing sustainable fashion! You've placed {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} 
              with FitFoot, contributing to a more sustainable future through conscious consumption.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 