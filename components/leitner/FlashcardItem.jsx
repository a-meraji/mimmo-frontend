"use client";

import { useState } from 'react';
import { Edit2, Trash2, RotateCw } from 'lucide-react';
import { BOX_COLORS } from '@/utils/leitnerStorage';

export default function FlashcardItem({ flashcard, onEdit, onDelete }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const boxColors = BOX_COLORS[flashcard.box] || BOX_COLORS[1];

  const handleDelete = async () => {
    if (!window.confirm('آیا از حذف این کارت مطمئن هستید?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(flashcard.id);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'هنوز مرور نشده';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'امروز';
    if (diffDays === 1) return 'دیروز';
    if (diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
    return `${Math.floor(diffDays / 30)} ماه پیش`;
  };

  return (
    <div 
      className={`group relative bg-white border-2 border-neutral-extralight rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isDeleting ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Box Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${boxColors.bg}`} />

      {/* Card Content */}
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${boxColors.badge}`}>
                جعبه {flashcard.box}
              </span>
              {flashcard.courseId && (
                <span className="text-xs text-text-gray">
                  {flashcard.courseId}
                </span>
              )}
            </div>
            
            <div className="relative min-h-[60px]">
              {/* Front */}
              <div 
                className={`transition-opacity duration-300 ${
                  isFlipped ? 'opacity-0 absolute inset-0' : 'opacity-100'
                }`}
              >
                <p className="text-sm font-semibold text-text-charcoal leading-relaxed">
                  {flashcard.front}
                </p>
              </div>

              {/* Back */}
              <div 
                className={`transition-opacity duration-300 ${
                  isFlipped ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              >
                <p className="text-sm text-text-gray leading-relaxed">
                  {flashcard.back}
                </p>
              </div>
            </div>
          </div>

          {/* Flip Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-indigo/30 flex items-center justify-center hover:bg-primary/10 transition-colors"
            aria-label="چرخش کارت"
          >
            <RotateCw className={`w-4 h-4 text-text-gray transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-text-gray border-t border-neutral-extralight pt-3">
          <div className="flex items-center gap-3">
            <span>آخرین مرور: {formatDate(flashcard.lastReviewDate)}</span>
            {flashcard.reviewCount > 0 && (
              <span>مرورها: {flashcard.reviewCount}</span>
            )}
          </div>
          {flashcard.reviewCount > 0 && (
            <span className="text-emerald-600 font-medium">
              صحیح: {Math.round((flashcard.correctCount / flashcard.reviewCount) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-neutral-extralight">
        <button
          type="button"
          onClick={() => onEdit(flashcard)}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          <Edit2 className="w-4 h-4" aria-hidden="true" />
          ویرایش
        </button>
        <div className="w-px bg-neutral-extralight" />
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          حذف
        </button>
      </div>
    </div>
  );
}

