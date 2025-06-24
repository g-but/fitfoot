/**
 * Shared utility functions for admin interface
 * Created: 2024-01-25
 * Purpose: Eliminate DRY violations and provide consistent functionality
 */

// Format price for display in CHF
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF'
  }).format(price / 100);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return formatDate(dateString);
};

// Product status helpers
export const getProductStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Product type helpers
export const getProductTypeColor = (type: string) => {
  switch (type) {
    case 'new':
      return 'bg-green-100 text-green-800';
    case 'refurbished':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// API helpers
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Error handling
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
}

// Create notification
export const createNotification = (type: NotificationType, message: string): Notification => ({
  id: Date.now().toString(),
  type,
  message,
  timestamp: new Date()
});

// Search and filter helpers
export const searchProducts = (products: any[], searchTerm: string) => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(product =>
    product.title?.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term)
  );
};

export const filterProductsByType = (products: any[], filterType: string) => {
  if (filterType === 'all') return products;
  return products.filter(product => product.product_type === filterType);
}; 