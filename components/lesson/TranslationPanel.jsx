"use client";

import { useEffect } from 'react';
import { X, Languages, Loader2, AlertCircle } from 'lucide-react';

/**
 * TranslationPanel - Mobile-friendly slide-up panel for word translations
 * @param {boolean} isOpen - Whether the panel is open
 * @param {string} word - The word being translated
 * @param {string} translation - The translation result
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message if any
 * @param {Function} onClose - Close callback
 */
export default function TranslationPanel({ 
  isOpen, 
  word, 
  translation, 
  loading, 
  error, 
  onClose 
}) {
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-up Panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[101] transform transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
        }}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-neutral-gray/30 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 border-b border-neutral-extralight">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Languages className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-text-charcoal">ترجمه</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-extralight transition-colors flex items-center justify-center touch-manipulation"
              aria-label="بستن"
            >
              <X className="w-5 h-5 text-text-gray" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-6 min-h-[200px]">
            {/* Original Word */}
            <div className="mb-6">
              <p className="text-xs text-text-gray mb-1">کلمه ایتالیایی</p>
              <p className="text-2xl font-bold text-primary">
                {word}
              </p>
            </div>

            {/* Translation Result */}
            <div>
              <p className="text-xs text-text-gray mb-2">ترجمه فارسی</p>
              
              {/* Loading State */}
              {loading && (
                <div className="flex items-center gap-3 py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
                  <p className="text-text-gray">در حال ترجمه...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">خطا</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {translation && !loading && !error && (
                <div className="bg-gradient-to-br from-primary/5 to-secondary-accent/5 border border-primary/10 rounded-xl p-5">
                  <p className="text-xl font-bold text-text-charcoal leading-relaxed">
                    {translation}
                  </p>
                </div>
              )}
            </div>

            {/* Info Text */}
            <div className="mt-6 pt-4 border-t border-neutral-extralight">
              <p className="text-xs text-text-gray text-center">
                ترجمه توسط سرویس Google Translate انجام شده است
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

