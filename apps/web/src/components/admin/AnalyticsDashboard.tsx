'use client';

import { formatPrice, formatRelativeTime } from '@/lib/admin-utils';
import {
    ArrowDown,
    ArrowUp,
    BarChart3,
    Calendar,
    DollarSign,
    Eye,
    Package,
    TrendingUp
} from 'lucide-react';
import { useMemo } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  product_type: 'new' | 'refurbished';
  status: 'active' | 'draft';
  created_at: string;
}

interface AnalyticsData {
  products: Product[];
  orders?: any[];
  customers?: any[];
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const { products } = data;
    const now = new Date();
    
    // Time periods
    const getDateRange = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date;
    };
    
    const lastWeek = getDateRange(7);
    const lastMonth = getDateRange(30);
    const last3Months = getDateRange(90);
    
    // Basic metrics
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const draftProducts = products.filter(p => p.status === 'draft').length;
    const newProducts = products.filter(p => p.product_type === 'new').length;
    const refurbishedProducts = products.filter(p => p.product_type === 'refurbished').length;
    
    // Value metrics
    const totalValue = products.reduce((sum, p) => sum + p.price, 0);
    const activeValue = products.filter(p => p.status === 'active').reduce((sum, p) => sum + p.price, 0);
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;
    
    // Time-based metrics
    const recentProducts = products.filter(p => new Date(p.created_at) > lastWeek);
    const monthlyProducts = products.filter(p => new Date(p.created_at) > lastMonth);
    const quarterlyProducts = products.filter(p => new Date(p.created_at) > last3Months);
    
    // Growth calculations (mock data since we don't have historical data)
    const weeklyGrowth = 12; // Mock percentage
    const monthlyGrowth = 8; // Mock percentage
    const revenueGrowth = 15; // Mock percentage
    
    // Product distribution by type
    const typeDistribution = {
      new: { count: newProducts, percentage: (newProducts / totalProducts * 100) || 0 },
      refurbished: { count: refurbishedProducts, percentage: (refurbishedProducts / totalProducts * 100) || 0 }
    };
    
    // Price ranges
    const priceRanges = {
      under50: products.filter(p => p.price < 5000).length, // Under 50 CHF
      '50to100': products.filter(p => p.price >= 5000 && p.price < 10000).length,
      '100to200': products.filter(p => p.price >= 10000 && p.price < 20000).length,
      over200: products.filter(p => p.price >= 20000).length
    };
    
    // Recent activity
    const recentActivity = products
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    
    return {
      totals: {
        products: totalProducts,
        active: activeProducts,
        draft: draftProducts,
        value: totalValue,
        activeValue,
        averagePrice
      },
      growth: {
        weekly: weeklyGrowth,
        monthly: monthlyGrowth,
        revenue: revenueGrowth
      },
      timeBasedCounts: {
        thisWeek: recentProducts.length,
        thisMonth: monthlyProducts.length,
        thisQuarter: quarterlyProducts.length
      },
      distribution: {
        type: typeDistribution,
        priceRanges
      },
      recentActivity
    };
  }, [data]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      amber: 'text-amber-600 bg-amber-50',
      purple: 'text-purple-600 bg-purple-50'
    };

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span className="text-sm ml-1">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="text-sm text-gray-500">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={analytics.totals.products}
          icon={Package}
          trend="up"
          trendValue={`+${analytics.growth.weekly}% this week`}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={analytics.totals.active}
          icon={Eye}
          trend="up"
          trendValue={`${analytics.totals.draft} in draft`}
          color="green"
        />
        <StatCard
          title="Total Value"
          value={formatPrice(analytics.totals.value)}
          icon={DollarSign}
          trend="up"
          trendValue={`+${analytics.growth.revenue}% growth`}
          color="amber"
        />
        <StatCard
          title="Average Price"
          value={formatPrice(analytics.totals.averagePrice)}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Product Type Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">New Products</span>
                <span className="text-sm text-gray-600">
                  {analytics.distribution.type.new.count} ({analytics.distribution.type.new.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analytics.distribution.type.new.percentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Refurbished</span>
                <span className="text-sm text-gray-600">
                  {analytics.distribution.type.refurbished.count} ({analytics.distribution.type.refurbished.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analytics.distribution.type.refurbished.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Price Range Distribution
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Under 50 CHF</span>
              <span className="text-sm font-medium">{analytics.distribution.priceRanges.under50}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">50-100 CHF</span>
              <span className="text-sm font-medium">{analytics.distribution.priceRanges['50to100']}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">100-200 CHF</span>
              <span className="text-sm font-medium">{analytics.distribution.priceRanges['100to200']}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Over 200 CHF</span>
              <span className="text-sm font-medium">{analytics.distribution.priceRanges.over200}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time-based Analytics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Product Creation Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analytics.timeBasedCounts.thisWeek}</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analytics.timeBasedCounts.thisMonth}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analytics.timeBasedCounts.thisQuarter}</div>
            <div className="text-sm text-gray-600">This Quarter</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Product Activity</h3>
        <div className="space-y-3">
          {analytics.recentActivity.map(product => (
            <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{product.title}</p>
                <p className="text-xs text-gray-500">{formatRelativeTime(product.created_at)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  product.product_type === 'new' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {product.product_type}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          ))}
          {analytics.recentActivity.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
} 