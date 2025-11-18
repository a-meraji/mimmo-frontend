'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';

/**
 * Admin Layout with Route Protection
 * 
 * Authentication Flow:
 * 1. AuthContext automatically tries to refresh token on mount (from HTTP-only cookie)
 * 2. If refresh token exists and valid, it fetches a new access token
 * 3. Access token is decoded to extract user role (from JWT payload)
 * 4. User profile is fetched and merged with token data
 * 5. This layout checks if user.role === 'admin'
 * 
 * Protection Logic:
 * - If not authenticated → redirect to /auth with return URL
 * - If authenticated but not admin → redirect to home with error
 * - If admin → render dashboard
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // Check if user is authenticated and is admin
    if (!user) {
      // Not logged in, redirect to auth
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user.role !== 'admin') {
      // Not an admin, redirect to home with error message
      router.push('/?error=unauthorized');
      return;
    }

    // User is authenticated and is admin - allow access
    setIsChecking(false);
  }, [user, isLoading, router, pathname]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return <LoadingSpinner fullPage message="در حال بررسی دسترسی..." />;
  }

  // If user is not admin or not logged in, don't render anything
  // (redirect will happen in useEffect)
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
          
          <main className="flex-1 p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}

