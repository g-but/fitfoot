'use client'

import { ErrorBoundary } from '@/components/error-boundary'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { usePathname } from 'next/navigation'

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages have their own layout with sidebar navigation
    return (
      <div className="relative min-h-screen">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </div>
    );
  }

  // Regular pages with header and footer
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
} 