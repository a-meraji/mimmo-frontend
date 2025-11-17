"use client";

import { AlertTriangle, X } from 'lucide-react';

export default function ExitTestModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center animate-in fade-in p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-neutral-extralight">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />
          </div>
          <h2 id="exit-modal-title" className="flex-1 text-lg font-bold text-text-charcoal">
            خروج از آزمون؟
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-indigo transition-colors"
            aria-label="بستن"
            type="button"
          >
            <X className="w-5 h-5 text-text-gray" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-sm lg:text-base text-text-gray leading-relaxed">
            شما هنوز همه سوالات را پاسخ نداده‌اید. آیا مطمئن هستید که می‌خواهید از آزمون خارج شوید؟
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs lg:text-sm text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                با خروج از آزمون، پیشرفت شما ذخیره نمی‌شود و باید آزمون را از ابتدا شروع کنید.
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-5 border-t border-neutral-extralight">
          <button
            onClick={onClose}
            className="flex-1 px-5 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            type="button"
          >
            ادامه آزمون
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3 bg-neutral-indigo/20 text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo/30 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-indigo/50 focus:ring-offset-2"
            type="button"
          >
            خروج از آزمون
          </button>
        </div>
      </div>
    </div>
  );
}

