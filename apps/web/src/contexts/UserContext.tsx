'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

interface UserContextType {
  user: User | null;
  adminUser: User | null;
  setUser: (user: User | null) => void;
  setAdminUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  hydrated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Initialize user state from localStorage
  useEffect(() => {
    const initializeUsers = () => {
      try {
        // Check customer data
        const customerData = localStorage.getItem('customer_user');
        if (customerData) {
          setUser(JSON.parse(customerData));
        }

        // Check admin data
        const adminData = localStorage.getItem('admin_user');
        if (adminData) {
          setAdminUser(JSON.parse(adminData));
        }
      } catch (error) {
        console.error('User initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('customer_user');
        localStorage.removeItem('admin_user');
      } finally {
        setHydrated(true);
      }
    };

    initializeUsers();
  }, []);

  const isLoggedIn = Boolean(user);
  const isAdmin = Boolean(adminUser);

  const hasPermission = (permission: string): boolean => {
    if (adminUser?.permissions) {
      return adminUser.permissions.includes(permission);
    }
    return false;
  };

  const value = {
    user,
    adminUser,
    setUser,
    setAdminUser,
    isLoggedIn,
    isAdmin,
    hasPermission,
    hydrated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 