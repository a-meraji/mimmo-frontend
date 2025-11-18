'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'داشبورد', href: '/admin', icon: LayoutDashboard },
  { name: 'کاربران', href: '/admin/users', icon: Users },
  { name: 'پکیج‌ها', href: '/admin/packages', icon: Package },
  { name: 'پرداخت‌ها', href: '/admin/payments', icon: CreditCard },
  { name: 'نظرات', href: '/admin/comments', icon: MessageSquare },
  { name: 'سوالات', href: '/admin/questions', icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-50
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          lg:sticky lg:top-0 lg:h-screen
          w-64 flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">پنل مدیریت</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                              (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      group
                      ${
                        isActive
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="font-medium flex-1">{item.name}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            نسخه 1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}

