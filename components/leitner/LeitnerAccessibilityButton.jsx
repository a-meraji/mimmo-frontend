"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BookMarked, Plus, ArrowRight, X } from 'lucide-react';

export default function LeitnerAccessibilityButton({ onAddFlashcard }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const handleAddFlashcard = () => {
    setIsMenuOpen(false);
    onAddFlashcard();
  };

  const handleGoToLeitner = () => {
    setIsMenuOpen(false);
    router.push('/learn/leitner');
  };

  return (
    <div className="fixed bottom-20 right-6 z-50" ref={menuRef}>
      {/* Menu (appears above button) */}
      {isMenuOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-extralight overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5" aria-hidden="true" />
                <h3 className="font-bold">سیستم لایتنر</h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="بستن"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={handleAddFlashcard}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors text-right"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-charcoal">
                  افزودن کارت دستی
                </p>
                <p className="text-xs text-text-gray">
                  ایجاد کارت جدید
                </p>
              </div>
            </button>

            <button
              onClick={handleGoToLeitner}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors text-right"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-charcoal">
                  رفتن به لایتنر
                </p>
                <p className="text-xs text-text-gray">
                  مشاهده همه کارت‌ها
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center ${
          isMenuOpen ? 'rotate-90' : ''
        }`}
        aria-label="منوی لایتنر"
        title="افزودن به لایتنر یا رفتن به صفحه لایتنر"
      >
        <BookMarked className="w-6 h-6" aria-hidden="true" />
      </button>
    </div>
  );
}

