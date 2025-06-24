'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface SessionContextType {
  sessionExpiring: boolean;
  refreshToken: () => Promise<boolean>;
  checkTokenExpiration: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionExpiring, setSessionExpiring] = useState(false);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000';

  const getToken = useCallback(() => {
    return localStorage.getItem('admin_token') || localStorage.getItem('customer_token');
  }, []);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) return false;

      const isAdminToken = localStorage.getItem('admin_token') !== null;
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
        } else {
          localStorage.setItem('customer_token', data.token);
          localStorage.setItem('customer_user', JSON.stringify(data.customer));
        }
        
        setSessionExpiring(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, [API_BASE, getToken]);

  const checkTokenExpiration = useCallback(() => {
    const token = getToken();
    if (!token) return;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return;

      const payloadBase64 = tokenParts[1];
      const paddedPayload = payloadBase64 + '='.repeat((4 - payloadBase64.length % 4) % 4);
      const payload = JSON.parse(atob(paddedPayload));
      
      if (!payload.exp) return;
      
      const exp = payload.exp * 1000;
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
      
      // Handle expired tokens
      if (timeLeft <= 0) {
        // Token expired - parent context should handle logout
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('token-expired'));
        }
      }
    } catch (error) {
      console.error('Token expiration check failed:', error);
    }
  }, [getToken, refreshToken]);

  // Session monitoring
  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const value = {
    sessionExpiring,
    refreshToken,
    checkTokenExpiration
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 