"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getWordNote, saveWordNote } from '@/utils/lessonStorage';

export default function WordModal({ word, isOpen, onClose }) {
  const { user } = useAuth();
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  // Load existing note when modal opens
  useEffect(() => {
    if (isOpen && word) {
      const existingNote = getWordNote(word.id, user);
      setNote(existingNote);
      setSaveSuccess(false);
    }
  }, [isOpen, word, user]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  }, [onClose]);

  // Save note
  const handleSave = useCallback(async () => {
    if (!word) return;

    setIsSaving(true);
    const success = saveWordNote(word.id, note, user);
    
    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  }, [word, note, user]);

  // Auto-save on blur
  const handleBlur = useCallback(() => {
    if (note !== getWordNote(word?.id, user)) {
      handleSave();
    }
  }, [note, word, user, handleSave]);

  if (!isOpen || !word) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-modal-title"
    >
      <div className="bg-white lg:rounded-2xl shadow-2xl max-w-2xl w-full h-full lg:h-auto lg:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-extralight px-3 lg:px-5 py-2 lg:py-3 flex items-center justify-between z-10">
          <h2 id="word-modal-title" className="text-base lg:text-lg font-bold text-text-charcoal">
            {word.title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-indigo transition-colors"
            aria-label="بستن"
            type="button"
          >
            <X className="w-4 h-4 text-text-gray" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
          {/* Word Image */}
          <div className="relative w-full h-32 lg:h-40 rounded-lg overflow-hidden bg-neutral-indigo/20">
            <Image
              src={word.image}
              alt={word.title}
              fill
              className="object-contain p-2 lg:p-3"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Word */}
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xl lg:text-2xl font-bold">
              {word.word}
            </span>
          </div>

          {/* Definition */}
          <div className="bg-neutral-indigo/30 rounded-lg p-2.5 lg:p-3">
            <h3 className="text-xs font-semibold text-text-gray mb-1.5">تعریف</h3>
            <p className="text-sm lg:text-base text-text-charcoal leading-6">
              {word.definition}
            </p>
          </div>

          {/* User Notes */}
          <div>
            <label htmlFor="word-note" className="block text-xs lg:text-sm font-semibold text-text-gray mb-1.5">
              یادداشت شما
            </label>
            <textarea
              ref={textareaRef}
              id="word-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={handleBlur}
              placeholder="یادداشت‌های خود را اینجا بنویسید..."
              className="w-full px-3 py-2 border-2 border-neutral-extralight rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 resize-none text-sm"
              rows={3}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-text-light">
                {note.length} کاراکتر
              </span>
              {saveSuccess && (
                <span className="text-xs text-emerald-600 font-medium animate-in fade-in duration-200">
                  ✓ ذخیره شد
                </span>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            type="button"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {isSaving ? 'در حال ذخیره...' : 'ذخیره یادداشت'}
          </button>
        </div>
      </div>
    </div>
  );
}

