"use client";

import { useState, useEffect } from 'react';
import { X, Save, BookMarked } from 'lucide-react';
import { updateFlashcard, BOX_COLORS } from '@/utils/leitnerStorage';

export default function EditFlashcardModal({ 
  isOpen, 
  onClose, 
  flashcard,
  onSuccess 
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [box, setBox] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load flashcard data when modal opens
  useEffect(() => {
    if (isOpen && flashcard) {
      setFront(flashcard.front || '');
      setBack(flashcard.back || '');
      setBox(flashcard.box || 1);
      setErrors({});
    }
  }, [isOpen, flashcard]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!front.trim()) {
      newErrors.front = 'جلوی کارت نمی‌تواند خالی باشد';
    } else if (front.trim().length < 2) {
      newErrors.front = 'حداقل ۲ کاراکتر وارد کنید';
    }

    if (!back.trim()) {
      newErrors.back = 'پشت کارت نمی‌تواند خالی باشد';
    } else if (back.trim().length < 2) {
      newErrors.back = 'حداقل ۲ کاراکتر وارد کنید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || !flashcard) return;

    setIsSubmitting(true);

    try {
      const updated = updateFlashcard(flashcard.id, {
        front: front.trim(),
        back: back.trim(),
        box: parseInt(box),
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(updated);
      }

      onClose();
    } catch (error) {
      console.error('Error updating flashcard:', error);
      setErrors({ submit: 'خطا در ویرایش کارت. دوباره تلاش کنید.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !flashcard) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <BookMarked className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-bold">ویرایش کارت</h2>
                <p className="text-sm text-white/90">تغییرات کارت لایتنر</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="بستن"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Front Input */}
          <div>
            <label htmlFor="edit-front" className="block text-sm font-semibold text-text-charcoal mb-2">
              روی کارت (سوال / کلمه)
            </label>
            <textarea
              id="edit-front"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="مثال: Ciao"
              className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.front
                  ? 'border-red-500 bg-red-50'
                  : 'border-neutral-extralight bg-neutral-indigo/10'
              }`}
              rows={3}
              autoFocus
            />
            {errors.front && (
              <p className="mt-1 text-sm text-red-600">{errors.front}</p>
            )}
          </div>

          {/* Back Input */}
          <div>
            <label htmlFor="edit-back" className="block text-sm font-semibold text-text-charcoal mb-2">
              پشت کارت (پاسخ / معنی)
            </label>
            <textarea
              id="edit-back"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="مثال: سلام - برای احوالپرسی غیررسمی"
              className={`w-full px-4 py-3 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.back
                  ? 'border-red-500 bg-red-50'
                  : 'border-neutral-extralight bg-neutral-indigo/10'
              }`}
              rows={4}
            />
            {errors.back && (
              <p className="mt-1 text-sm text-red-600">{errors.back}</p>
            )}
          </div>

          {/* Box Selection */}
          <div>
            <label htmlFor="edit-box" className="block text-sm font-semibold text-text-charcoal mb-3">
              جعبه لایتنر
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((boxNum) => {
                const colors = BOX_COLORS[boxNum];
                const isSelected = box === boxNum;
                
                return (
                  <button
                    key={boxNum}
                    type="button"
                    onClick={() => setBox(boxNum)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${colors.bg} border-transparent text-white shadow-md scale-105`
                        : `${colors.badge} border-transparent hover:scale-105`
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold">{boxNum}</div>
                      <div className="text-[10px] mt-1">
                        {boxNum === 1 && 'روزانه'}
                        {boxNum === 2 && '۲ روزه'}
                        {boxNum === 3 && '۴ روزه'}
                        {boxNum === 4 && '۸ روزه'}
                        {boxNum === 5 && '۱۶ روزه'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-text-gray">
              تغییر دستی جعبه توصیه نمی‌شود. سیستم لایتنر به صورت خودکار کارت‌ها را جابجا می‌کند.
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 bg-neutral-indigo/10 border-t border-neutral-extralight flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-neutral-extralight rounded-xl font-semibold text-text-charcoal hover:bg-white transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" aria-hidden="true" />
                ذخیره تغییرات
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

