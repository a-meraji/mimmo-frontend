"use client";

import { use, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Clock, ArrowLeft, FilePenLine, Plus } from 'lucide-react';
import { getLessonById } from '@/utils/lessonData';
import { getLessonNote, saveLessonNote } from '@/utils/lessonStorage';
import ContentRenderer from '@/components/lesson/ContentRenderer';
import WordModal from '@/components/lesson/WordModal';
import TranslationPanel from '@/components/lesson/TranslationPanel';
import LessonNote from '@/components/lesson/LessonNote';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import AddFlashcardModal from '@/components/leitner/AddFlashcardModal';
import LeitnerAccessibilityButton from '@/components/leitner/LeitnerAccessibilityButton';
import useTextSelection from '@/hooks/useTextSelection';
import { useToast } from '@/contexts/ToastContext';
import { translateItToPe } from '@/utils/translationService';
import { useAuth } from '@/contexts/AuthContext';

export default function LessonContentPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddFlashcardModalOpen, setIsAddFlashcardModalOpen] = useState(false);
  const [flashcardInitialText, setFlashcardInitialText] = useState('');
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  
  // Translation state
  const [translationWord, setTranslationWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState('');
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  
  // Lesson note state
  const [lessonNote, setLessonNote] = useState('');
  
  // Text selection hook
  const { selectedText, isActive, position, clearSelection } = useTextSelection();

  // Get lesson data
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  // Load lesson note on mount
  useEffect(() => {
    const note = getLessonNote(lessonId, user);
    setLessonNote(note);
  }, [lessonId, user]);

  // Handle word click
  const handleWordClick = (word) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWord(null), 200);
  };

  // Handle regular word click (for translation)
  const handleRegularWordClick = async (word) => {
    // Reset previous state
    setTranslationWord(word);
    setTranslation('');
    setTranslationError('');
    setTranslationLoading(true);
    setIsTranslationPanelOpen(true);

    try {
      // Call translation service
      const result = await translateItToPe(word);
      
      if (result.success) {
        setTranslation(result.translation);
      } else {
        setTranslationError(result.error || 'خطا در ترجمه');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError('خطا در ترجمه');
    } finally {
      setTranslationLoading(false);
    }
  };

  // Close translation panel
  const closeTranslationPanel = () => {
    setIsTranslationPanelOpen(false);
    setTimeout(() => {
      setTranslationWord('');
      setTranslation('');
      setTranslationError('');
    }, 300);
  };

  // Handle adding text selection to Leitner
  const handleAddToLeitner = () => {
    if (selectedText) {
      setFlashcardInitialText(selectedText);
      setIsAddFlashcardModalOpen(true);
      clearSelection();
    } else {
      setFlashcardInitialText('');
      setIsAddFlashcardModalOpen(true);
    }
  };

  const handleFlashcardSuccess = () => {
    toast.success('کارت به لایتنر اضافه شد');
  };

  // Handle lesson note save
  const handleLessonNoteSave = async (lessonId, note) => {
    const success = saveLessonNote(lessonId, note, user);
    if (success) {
      setLessonNote(note);
    }
  };

  // Handle 404
  if (!lesson) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-text-charcoal mb-4">درس یافت نشد</h1>
          <p className="text-text-gray mb-8">درس مورد نظر شما وجود ندارد یا حذف شده است.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            بازگشت
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow pt-16 lg:pt-24 pb-8 lg:pb-12">
      {/* Sticky Navigation Tabs */}
      <LessonNavTabs lessonId={lessonId} activeTab="content" />

      <div className="container mx-auto px-3 lg:px-8 max-w-4xl py-3 lg:py-6">
        {/* Back Button (Mobile) / Breadcrumb (Desktop) */}
        <div className="mb-3 lg:mb-4">
          {/* Mobile: Back button only */}
          <button
            onClick={() => router.back()}
            className="lg:hidden inline-flex items-center gap-1.5 text-text-gray hover:text-primary transition-colors p-1 -ml-1"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-medium">بازگشت</span>
          </button>

          {/* Desktop: Compact breadcrumb */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs text-text-gray" aria-label="مسیر صفحه">
            <Link href="/learn" className="hover:text-primary transition-colors">
              یادگیری
            </Link>
            <ArrowLeft className="w-3 h-3 text-text-light" aria-hidden="true" />
            <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
              دوره
            </Link>
            <ArrowLeft className="w-3 h-3 text-text-light" aria-hidden="true" />
            <span className="text-text-charcoal font-medium">{lesson.title}</span>
          </nav>
        </div>

        {/* Content Section - Merged header and content */}
        <section className="bg-white border border-neutral-extralight rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
          {/* Header with thumbnail - Mobile */}
          <div className="lg:hidden p-3 border-b border-neutral-extralight">
            <div className="flex items-start gap-3">
              {/* Title and badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BookOpen className="w-3 h-3 text-primary" aria-hidden="true" />
                  <span className="text-xs text-text-gray">محتوای درس</span>
                </div>
                <h1 className="text-base font-black text-text-charcoal mb-2">
              {lesson.title}
            </h1>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="inline-flex items-center gap-1 bg-neutral-indigo/50 px-2 py-0.5 rounded-full">
                    <Clock className="w-2.5 h-2.5 text-text-gray" aria-hidden="true" />
                <span className="text-xs font-medium text-text-gray">{lesson.duration}</span>
                  </div>
                  {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                    <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                      <span className="text-xs font-medium">{lesson.vocabulary.length} واژه</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Thumbnail Image */}
              {/* ---------- Image with Modal Preview (MOBILE) ---------- */}
              <div className="relative w-20 h-20 bg-neutral-indigo/10 rounded-lg overflow-hidden flex-shrink-0">
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full focus:outline-none z-10"
                  onClick={() => setIsImagePreviewOpen(true)}
                  aria-label={`نمایش تصویر بزرگتر از ${lesson.title}`}
                />
                <Image
                  src={lesson.image}
                  alt={lesson.title}
                  fill
                  className="object-contain p-2 pointer-events-none"
                  priority
                />
              </div>
              {/* Modal for Preview (shared by desktop and mobile, state defined at top-level component) */}
              {isImagePreviewOpen && (
                <div
                  className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center animate-in fade-in"
                  onClick={() => setIsImagePreviewOpen(false)}
                  tabIndex={-1}
                  role="dialog"
                  aria-modal="true"
                >
                  <div
                    className="relative max-w-xl max-h-[80vh] w-[90vw] bg-transparent rounded-xl shadow-xl"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-2 left-2 z-20 bg-white/80 rounded-full p-2 shadow-md hover:bg-white"
                      onClick={() => setIsImagePreviewOpen(false)}
                      aria-label="بستن"
                      tabIndex={0}
                    >
                      <svg className="w-5 h-5 text-gray-800" viewBox="0 0 20 20">
                        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                    <Image
                      src={lesson.image}
                      alt={lesson.title}
                      width={1000}
                      height={1000}
                      className="object-contain rounded-xl"
                      priority
                    />
                  </div>
                </div>
              )}
              
            </div>
          </div>

          {/* Desktop: Grid layout with sidebar image */}
          <div className="hidden lg:grid lg:grid-cols-[200px_1fr] lg:gap-6 p-6">
            {/* Sidebar Image */}
            <div className="relative w-full h-[200px] bg-neutral-indigo/10 rounded-xl overflow-hidden flex-shrink-0">
              <button
                type="button"
                className="absolute inset-0 w-full h-full focus:outline-none z-10"
                onClick={() => setIsImagePreviewOpen(true)}
                aria-label={`نمایش تصویر بزرگتر از ${lesson.title}`}
              />
              <Image
                src={lesson.image}
                alt={lesson.title}
                fill
                className="object-contain p-4 pointer-events-none"
                priority
              />
            </div>

            {/* Content area */}
            <div className="min-w-0">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs text-text-gray">محتوای درس</span>
              </div>
                <h1 className="text-xl font-black text-text-charcoal mb-2">
                {lesson.title}
              </h1>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <div className="inline-flex items-center gap-1.5 bg-neutral-indigo/50 px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-text-gray" aria-hidden="true" />
                  <span className="text-xs font-medium text-text-gray">{lesson.duration}</span>
                </div>
                {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                    <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" aria-hidden="true" />
                    <span className="text-xs font-medium">{lesson.vocabulary.length} واژه کلیدی</span>
                  </div>
                )}
                </div>
                <p className="text-xs text-text-gray">
                  {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                    <span>💡 کلمات پررنگ: واژگان | </span>
                  )}
                  <span>🔍 کلیک: ترجمه</span>
                </p>
              </div>

              {/* Content Renderer */}
              <div className="prose-content">
                <ContentRenderer
                  content={lesson.content}
                  vocabulary={lesson.vocabulary}
                  onWordClick={handleWordClick}
                  onRegularWordClick={handleRegularWordClick}
                />
              </div>
            </div>
          </div>

          {/* Mobile: Content below header */}
          <div className="lg:hidden p-3">
            <p className="text-xs text-text-gray mb-3">
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                <span>💡 کلمات پررنگ: واژگان | </span>
              )}
              <span>🔍 کلیک: ترجمه</span>
              </p>
          <div className="prose-content">
            <ContentRenderer
              content={lesson.content}
              vocabulary={lesson.vocabulary}
              onWordClick={handleWordClick}
                onRegularWordClick={handleRegularWordClick}
            />
            </div>
          </div>
        </section>

        {/* Lesson Note Section */}
        <div className="mt-3 lg:mt-4">
          <LessonNote
            lessonId={lessonId}
            initialNote={lessonNote}
            onSave={handleLessonNoteSave}
          />
        </div>

        {/* Vocabulary List - Compact chips */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <section className="mt-3 lg:mt-4 bg-white border border-neutral-extralight rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm">
            <h2 className="text-sm lg:text-base font-bold text-text-charcoal mb-2 lg:mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              واژگان کلیدی
            </h2>
            <div className="flex flex-wrap gap-2">
              {lesson.vocabulary.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-primary/20 hover:border-primary/40"
                  type="button"
                >
                  <span className="font-bold">{word.word}</span>
                  <span className="text-xs opacity-75">({word.title})</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Navigation to Practice - Compact button */}
        <Link
          href={`/lesson/${lessonId}/practice`}
          className="mt-4 lg:mt-5 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md"
        >
          <FilePenLine className="w-5 h-5" aria-hidden="true" />
          <span>بریم برای تمرین</span>
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Word Modal */}
      <WordModal
        word={selectedWord}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Translation Panel */}
      <TranslationPanel
        isOpen={isTranslationPanelOpen}
        word={translationWord}
        translation={translation}
        loading={translationLoading}
        error={translationError}
        onClose={closeTranslationPanel}
      />

      {/* Floating Add to Leitner Button (on text selection) */}
      {isActive && selectedText && (
        <button
          onClick={handleAddToLeitner}
          className="fixed z-50 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -200%)',
          }}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          افزودن به لایتنر
        </button>
      )}

      {/* Leitner Accessibility Button */}
      <LeitnerAccessibilityButton onAddFlashcard={handleAddToLeitner} />

      {/* Add Flashcard Modal */}
      <AddFlashcardModal
        isOpen={isAddFlashcardModalOpen}
        onClose={() => {
          setIsAddFlashcardModalOpen(false);
          setFlashcardInitialText('');
        }}
        initialFront={flashcardInitialText}
        courseId={lesson?.courseId}
        lessonId={lessonId}
        sourcePage="content"
        onSuccess={handleFlashcardSuccess}
      />
    </main>
  );
}

