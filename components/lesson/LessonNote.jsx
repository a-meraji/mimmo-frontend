"use client";

import { useState, useRef, useEffect } from 'react';
import { StickyNote, ChevronDown, ChevronUp, Save, X } from 'lucide-react';

export default function LessonNote({ lessonId, initialNote = '', onSave }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const textareaRef = useRef(null);

  // Update note when initialNote changes
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  // Focus textarea when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const hasNote = note.trim().length > 0;
  const maxLength = 1000;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave(lessonId, note);
      setSaveSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setNote(initialNote);
    setIsExpanded(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border border-neutral-extralight rounded-xl lg:rounded-2xl overflow-hidden shadow-sm">
      {/* Collapsed Header Button */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 lg:p-4 hover:bg-neutral-indigo/5 transition-colors"
        type="button"
        aria-expanded={isExpanded}
        aria-controls="lesson-note-content"
      >
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          <span className="text-sm lg:text-base font-semibold text-text-charcoal">
            یادداشت درس
          </span>
          {hasNote && !isExpanded && (
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" aria-label="دارای یادداشت" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasNote && !isExpanded && (
            <span className="text-xs text-text-gray hidden lg:inline">
              {note.length} کاراکتر
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-text-gray" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-gray" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id="lesson-note-content"
          className="border-t border-neutral-extralight p-3 lg:p-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="یادداشت‌های خود را برای این درس اینجا بنویسید..."
            maxLength={maxLength}
            className="w-full px-3 py-2 lg:px-4 lg:py-3 border-2 border-neutral-extralight rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 resize-none text-sm lg:text-base leading-relaxed"
            rows={5}
          />
          
          {/* Character Count */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-light">
              {note.length} / {maxLength} کاراکتر
            </span>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-medium animate-in fade-in duration-200">
                ✓ ذخیره شد
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-2 lg:py-2.5 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              type="button"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              {isSaving ? 'در حال ذخیره...' : 'ذخیره یادداشت'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 bg-neutral-indigo/20 text-text-charcoal py-2 lg:py-2.5 px-4 rounded-lg font-semibold hover:bg-neutral-indigo/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              لغو
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

