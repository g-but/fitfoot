import { useAuth } from '@/contexts/AuthContext';
import {
    AlertTriangle,
    BarChart3,
    Bell,
    ChevronDown,
    Clock,
    Home,
    LogOut,
    Menu,
    Package,
    Settings,
    Shield,
    ShoppingCart,
    Users,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
  badge?: number;
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
  const { adminUser, logoutAdmin, sessionExpiring, hasPermission, refreshToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items with permissions
  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Products', href: '/admin/products', icon: Package, permission: 'products.read' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, permission: 'orders.read', badge: 3 },
    { name: 'Customers', href: '/admin/customers', icon: Users, permission: 'customers.read' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, permission: 'analytics.read' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, permission: 'settings.read' },
  ];

  // Filter navigation items based on permissions
  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  // Handle session expiration warning
  useEffect(() => {
    if (sessionExpiring) {
      const handleRefresh = async () => {
        const success = await refreshToken();
        if (!success) {
          router.push('/admin/login');
        }
      };
      
      // Show confirmation dialog
      if (confirm('Your session is about to expire. Would you like to extend it?')) {
        handleRefresh();
      }
    }
  }, [sessionExpiring, refreshToken, router]);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logoutAdmin();
      router.push('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Expiring Warning */}
      {sessionExpiring && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white px-4 py-2 z-50 flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>Your session is about to expire. Click to extend.</span>
          </div>
          <button
            onClick={() => refreshToken()}
            className="text-white underline hover:no-underline"
          >
            Extend Session
          </button>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:static md:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">FitFoot Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-6 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Navigation
            </h3>
          </div>
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User info in sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {adminUser?.first_name?.[0]}{adminUser?.last_name?.[0]}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminUser?.first_name} {adminUser?.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {adminUser?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          {adminUser?.lastActivity && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Last active: {new Date(adminUser.lastActivity).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              </button>

              {/* User dropdown */}
              <div className="ml-3 relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {adminUser?.first_name?.[0]}{adminUser?.last_name?.[0]}
                  </div>
                  <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
                </button>

                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{adminUser?.first_name} {adminUser?.last_name}</div>
                        <div className="text-gray-500">{adminUser?.email}</div>
                      </div>
                      <Link
                        href="/admin/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Click outside to close dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
} 