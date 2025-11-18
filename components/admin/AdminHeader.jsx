'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="باز کردن منو"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Logo/Title for mobile */}
        <h1 className="lg:hidden text-lg font-bold text-gray-900">پنل مدیریت</h1>

        {/* Spacer for desktop */}
        <div className="hidden lg:block"></div>

        {/* User info and actions */}
        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || user?.email || 'مدیر'}
              </p>
              <p className="text-xs text-gray-500">مدیر سیستم</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-red-50 text-red-600 hover:bg-red-100
                     transition-colors duration-200"
            aria-label="خروج از حساب"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline font-medium">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}

