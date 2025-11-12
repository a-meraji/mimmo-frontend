"use client";

import { Package } from 'lucide-react';
import FlashcardItem from './FlashcardItem';

export default function FlashcardList({ flashcards, onEdit, onDelete, emptyMessage = 'هیچ کارتی وجود ندارد' }) {
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-neutral-indigo/20 flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-neutral-gray" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-text-charcoal mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-text-gray text-center max-w-sm">
          کارت‌های لایتنر خود را از صفحات درس اضافه کنید یا به صورت دستی ایجاد کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

