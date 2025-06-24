'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone?: string;
  confirmed?: boolean;
  permissions?: string[];
  lastActivity?: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface AuthContextType {
  // User state
  user: User | null;
  adminUser: User | null;
  loading: boolean;
  hydrated: boolean;
  sessionExpiring: boolean;
  
  // Authentication methods
  loginAsCustomer: (email: string, password: string) => Promise<boolean>;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  registerCustomer: (userData: RegisterData) => Promise<{ success: boolean; message?: string; confirmationUrl?: string }>;
  logout: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  
  // Email confirmation
  confirmEmail: (token: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  
  // Password reset
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  
  // Utility methods
  isLoggedIn: boolean;
  isAdmin: boolean;
  getAuthToken: () => string | null;
  getAdminToken: () => string | null;
  hasPermission: (permission: string) => boolean;
  
  // Error handling
  lastError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check customer token
        const customerToken = localStorage.getItem('customer_token');
        const customerData = localStorage.getItem('customer_user');
        
        if (customerToken && customerData) {
          setUser(JSON.parse(customerData));
        }

        // Check admin token
        const adminToken = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_user');
        
        if (adminToken && adminData) {
          setAdminUser(JSON.parse(adminData));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('customer_token');
        localStorage.removeItem('customer_user');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally {
        setLoading(false);
        setHydrated(true); // Mark as hydrated to prevent SSR/client mismatches
      }
    };

    initializeAuth();
  }, []);

  // Token refresh logic
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = getAdminToken() || getAuthToken();
      if (!token) return false;

      const isAdminToken = getAdminToken() !== null;
      const endpoint = isAdminToken ? '/auth/admin/refresh' : '/auth/customer/refresh';

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isAdminToken) {
          localStorage.setItem('admin_token', data.token);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          setAdminUser(data.user);
        } else {
          localStorage.setItem('customer_token', data.token);
          localStorage.setItem('customer_user', JSON.stringify(data.customer));
          setUser(data.customer);
        }
        
        setSessionExpiring(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [API_BASE]);

  // Session monitoring and auto-refresh
  useEffect(() => {
    if (!hydrated) return;

    const checkTokenExpiration = () => {
      const token = getAdminToken() || getAuthToken();
      if (!token) return;

      try {
        // Check if token has proper JWT format (3 parts separated by dots)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.warn('Invalid token format - not a proper JWT');
          return;
        }

        // Simple JWT expiration check (decode payload)
        const payloadBase64 = tokenParts[1];
        // Add padding if needed for proper base64 decoding
        const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
        const payload = JSON.parse(atob(paddedPayload));
        
        // Check if token has expiration field
        if (!payload.exp) {
          console.warn('Token does not have expiration field');
          return;
        }
        
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        const timeLeft = exp - now;
        
        // Warn if expiring in 5 minutes
        if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {
          setSessionExpiring(true);
        }
        
        // Auto-refresh if expiring in 2 minutes
        if (timeLeft <= 2 * 60 * 1000 && timeLeft > 0) {
          refreshToken();
        }
        
        // Logout if expired
        if (timeLeft <= 0) {
          if (getAdminToken()) {
            logoutAdmin();
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
        // Clear invalid tokens
        if (getAdminToken()) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdminUser(null);
        } else {
          localStorage.removeItem('customer_token');
          localStorage.removeItem('customer_user');
          setUser(null);
        }
      }
    };

    // Check token every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    // Initial check
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [hydrated, refreshToken]);

  // Permission checking
  const hasPermission = useCallback((permission: string): boolean => {
    if (!adminUser) return false;
    
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true;
    
    // Check specific permissions
    return adminUser.permissions?.includes(permission) || false;
  }, [adminUser]);

  // Activity tracking
  const updateLastActivity = useCallback(() => {
    const now = new Date().toISOString();
    if (adminUser) {
      const updatedUser = { ...adminUser, lastActivity: now };
      setAdminUser(updatedUser);
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
    }
    if (user) {
      const updatedUser = { ...user, lastActivity: now };
      setUser(updatedUser);
      localStorage.setItem('customer_user', JSON.stringify(updatedUser));
    }
  }, [adminUser, user]);

  // Track user activity
  useEffect(() => {
    if (!hydrated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => updateLastActivity();
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [hydrated, updateLastActivity]);

  const loginAsCustomer = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/customer/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('customer_token', data.token);
        localStorage.setItem('customer_user', JSON.stringify(data.customer));
        setUser(data.customer);
        return true;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Customer login error:', error);
      throw error;
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setAdminUser(data.user);
        return true;
      } else {
        throw new Error(data.error || 'Admin login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const registerCustomer = async (userData: RegisterData): Promise<{ success: boolean; message?: string; confirmationUrl?: string }> => {
    try {
      setLastError(null);
      
      // Use our internal API route instead of direct Medusa call
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
          confirmationUrl: data.confirmationUrl // Only in development
        };
      } else {
        const errorMessage = data.error || 'Registration failed';
        setLastError(errorMessage);
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = 'Network error. Please try again.';
      setLastError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      setLastError(null);
      const token = localStorage.getItem('customer_token');
      
      if (token) {
        await fetch(`${API_BASE}/auth/customer/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_user');
      setUser(null);
    }
  };

  const confirmEmail = async (token: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setLastError(null);
      
      const response = await fetch('/api/auth/confirm-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        const errorMessage = data.error || 'Email confirmation failed';
        setLastError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Email confirmation error:', error);
      const errorMessage = 'Network error. Please try again.';
      setLastError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setLastError(null);
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        const errorMessage = data.error || 'Password reset request failed';
        setLastError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = 'Network error. Please try again.';
      setLastError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      setLastError(null);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message
        };
      } else {
        const errorMessage = data.error || 'Password reset failed';
        setLastError(errorMessage);
        return {
          success: false,
          error: errorMessage
        };
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = 'Network error. Please try again.';
      setLastError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const logoutAdmin = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (token) {
        await fetch(`${API_BASE}/auth/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdminUser(null);
      router.push('/admin/login');
    }
  };

  const getAuthToken = (): string | null => {
    return localStorage.getItem('customer_token');
  };

  const getAdminToken = (): string | null => {
    return localStorage.getItem('admin_token');
  };

  const value: AuthContextType = {
    user,
    adminUser,
    loading,
    hydrated,
    sessionExpiring,
    loginAsCustomer,
    loginAsAdmin,
    registerCustomer,
    logout,
    logoutAdmin,
    refreshToken,
    confirmEmail,
    forgotPassword,
    resetPassword,
    isLoggedIn: !!user,
    isAdmin: !!adminUser,
    getAuthToken,
    getAdminToken,
    hasPermission,
    lastError,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper for customers
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

// Protected route wrapper for admin
export function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
} 