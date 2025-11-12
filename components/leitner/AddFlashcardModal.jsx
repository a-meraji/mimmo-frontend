"use client";

import { useState, useEffect } from 'react';
import { X, Plus, BookMarked } from 'lucide-react';
import { addFlashcard } from '@/utils/leitnerStorage';

export default function AddFlashcardModal({ 
  isOpen, 
  onClose, 
  initialFront = '', 
  courseId = null, 
  lessonId = null, 
  sourcePage = null,
  onSuccess 
}) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens with initial data
  useEffect(() => {
    if (isOpen) {
      setFront(initialFront);
      setBack('');
      setErrors({});
    }
  }, [isOpen, initialFront]);

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

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const flashcard = addFlashcard(
        front,
        back,
        courseId,
        lessonId,
        sourcePage
      );

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(flashcard);
      }

      // Reset and close
      setFront('');
      setBack('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding flashcard:', error);
      setErrors({ submit: 'خطا در افزودن کارت. دوباره تلاش کنید.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
                <h2 className="text-xl font-bold">افزودن کارت به لایتنر</h2>
                <p className="text-sm text-white/90">کارت جدید به جعبه ۱ اضافه می‌شود</p>
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
            <label htmlFor="front" className="block text-sm font-semibold text-text-charcoal mb-2">
              روی کارت (سوال / کلمه)
            </label>
            <textarea
              id="front"
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
            <label htmlFor="back" className="block text-sm font-semibold text-text-charcoal mb-2">
              پشت کارت (پاسخ / معنی)
            </label>
            <textarea
              id="back"
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

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-sm text-text-gray">
              💡 این کارت به جعبه ۱ لایتنر اضافه می‌شود و روزانه برای مرور نمایش داده خواهد شد.
            </p>
          </div>
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
                در حال افزودن...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" aria-hidden="true" />
                افزودن کارت
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

