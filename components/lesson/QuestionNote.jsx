"use client";

import { useState, useRef, useEffect } from 'react';
import { FileEdit, Save, X } from 'lucide-react';

export default function QuestionNote({ questionId, initialNote = '', onSave }) {
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
  const maxLength = 500;

  // Truncate note for preview (first 30 characters)
  const notePreview = hasNote ? (note.length > 30 ? note.slice(0, 30) + '...' : note) : '';

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await onSave(questionId, note);
      setSaveSuccess(true);
      
      // Hide success message and collapse after 1.5 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        setIsExpanded(false);
      }, 1500);
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
    <div className="mt-2 bg-neutral-indigo/5 border border-neutral-extralight rounded-lg overflow-hidden">
      {/* Collapsed Button */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center gap-2 p-2 lg:p-2.5 hover:bg-neutral-indigo/10 transition-colors text-right"
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`question-note-${questionId}`}
      >
        <FileEdit className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          {hasNote && !isExpanded ? (
            <span className="text-xs lg:text-sm text-text-gray truncate block">
              {notePreview}
            </span>
          ) : (
            <span className="text-xs lg:text-sm text-text-gray font-medium">
              {isExpanded ? 'یادداشت سوال' : 'افزودن یادداشت'}
            </span>
          )}
        </div>
        {hasNote && !isExpanded && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-label="دارای یادداشت" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={`question-note-${questionId}`}
          className="border-t border-neutral-extralight p-2 lg:p-2.5 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="یادداشت برای این سوال..."
            maxLength={maxLength}
            className="w-full px-2.5 py-2 border border-neutral-extralight rounded-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-200 resize-none text-xs lg:text-sm leading-relaxed"
            rows={3}
          />
          
          {/* Character Count & Success Message */}
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] lg:text-xs text-text-light">
              {note.length}/{maxLength}
            </span>
            {saveSuccess && (
              <span className="text-[10px] lg:text-xs text-emerald-600 font-medium animate-in fade-in duration-200">
                ✓ ذخیره شد
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 mt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-1.5 px-3 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              type="button"
            >
              <Save className="w-3 h-3" aria-hidden="true" />
              {isSaving ? 'ذخیره...' : 'ذخیره'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 bg-neutral-indigo/20 text-text-charcoal py-1.5 px-3 rounded-md font-medium hover:bg-neutral-indigo/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              type="button"
            >
              <X className="w-3 h-3" aria-hidden="true" />
              لغو
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

