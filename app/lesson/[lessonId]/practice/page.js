"use client";

import { use, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, BookOpen, ArrowUp, ClipboardCheck, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, getQuestionsForLesson } from '@/utils/lessonData';
import { getQuestionStats, getQuestionNote, saveQuestionNote } from '@/utils/lessonStorage';
import QuestionCard from '@/components/lesson/QuestionCard';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import AddFlashcardModal from '@/components/leitner/AddFlashcardModal';
import LeitnerAccessibilityButton from '@/components/leitner/LeitnerAccessibilityButton';
import useTextSelection from '@/hooks/useTextSelection';
import { useToast } from '@/contexts/ToastContext';

export default function LessonPracticePage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAddFlashcardModalOpen, setIsAddFlashcardModalOpen] = useState(false);
  const [flashcardInitialText, setFlashcardInitialText] = useState('');
  const [questionNotes, setQuestionNotes] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  
  // Text selection hook
  const { selectedText, isActive, position, clearSelection } = useTextSelection();

  // Set mounted state after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get lesson and questions data
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);
  const questions = useMemo(() => getQuestionsForLesson(lessonId), [lessonId]);

  // Load question notes on mount
  useEffect(() => {
    const notes = {};
    questions.forEach(question => {
      notes[question.id] = getQuestionNote(question.id, user);
    });
    setQuestionNotes(notes);
  }, [questions, user]);

  // Get stats for all questions (only on client)
  const questionsWithStats = useMemo(() => {
    return questions.map(question => ({
      ...question,
      stats: isMounted ? getQuestionStats(question.id, user) : { totalAttempts: 0, correctAttempts: 0, incorrectAttempts: 0, doubtAttempts: 0 }
    }));
  }, [questions, user, isMounted]);

  const totalQuestions = questions.length;

  // Calculate overall progress
  const answeredQuestions = useMemo(() => {
    return questionsWithStats.filter(q => q.stats.totalAttempts > 0).length;
  }, [questionsWithStats]);

  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Handle question note save
  const handleQuestionNoteSave = async (questionId, note) => {
    const success = saveQuestionNote(questionId, note, user);
    if (success) {
      setQuestionNotes(prev => ({
        ...prev,
        [questionId]: note
      }));
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

  // No questions available
  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow">
        <LessonNavTabs lessonId={lessonId} activeTab="practice" />
        
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-4 lg:py-8">
          <button
            onClick={() => router.back()}
            className="lg:hidden inline-flex items-center gap-2 text-text-gray hover:text-primary transition-colors p-2 -ml-2 mb-4"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">بازگشت</span>
          </button>

          <div className="bg-white border border-neutral-extralight rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-neutral-gray mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-text-charcoal mb-2">سوالی برای تمرین وجود ندارد</h2>
            <p className="text-text-gray mb-8">
              در حال حاضر سوالی برای این درس تعریف نشده است.
            </p>
            <Link
              href={`/lesson/${lessonId}/content`}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
              بازگشت به محتوا
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow pb-16 lg:pb-20">
      {/* Sticky Navigation Tabs */}
      <LessonNavTabs lessonId={lessonId} activeTab="practice" />

      <div className="container mx-auto px-3 lg:px-8 max-w-4xl py-2 lg:py-4">
        {/* Compact Header Bar - Mobile and Desktop */}
        <div className="mb-3 lg:mb-4">
          {/* Mobile: Single compact bar */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1 text-text-gray hover:text-primary transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xs font-bold text-text-charcoal truncate">{lesson.title}</h1>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-gray">{answeredQuestions}/{totalQuestions}</span>
              <span className="text-xs font-bold text-primary">{progressPercent}%</span>
            </div>
          </div>
          {/* Mobile: Progress bar */}
          <div className="lg:hidden h-1 bg-neutral-indigo/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>

          {/* Desktop: Breadcrumb with progress */}
          <div className="hidden lg:flex items-center justify-between mb-3">
            <nav className="flex items-center gap-1.5 text-xs text-text-gray" aria-label="مسیر صفحه">
              <Link href="/learn" className="hover:text-primary transition-colors">
                یادگیری
              </Link>
              <ArrowRight className="w-3 h-3 text-text-light" aria-hidden="true" />
              <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
                دوره
              </Link>
              <ArrowRight className="w-3 h-3 text-text-light" aria-hidden="true" />
              <span className="text-text-charcoal font-medium">{lesson.title}</span>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-gray">{answeredQuestions} از {totalQuestions} سوال</span>
              <span className="text-lg font-bold text-primary">{progressPercent}%</span>
            </div>
          </div>
          {/* Desktop: Progress bar */}
          <div className="hidden lg:block h-1.5 bg-neutral-indigo/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* All Questions - Scrollable */}
        <div className="space-y-3 lg:space-y-4">
          {questionsWithStats.map((question, index) => (
            <div key={question.id} className="scroll-mt-20">
              {/* Question Card with inline number */}
              <div className="relative">
                <div className="absolute -right-1 -top-1 w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs lg:text-sm font-bold shadow-lg z-10">
                  {index + 1}
                </div>
              <QuestionCard
                question={question}
                stats={question.stats}
                showStats={true}
                note={questionNotes[question.id] || ''}
                onNoteSave={handleQuestionNoteSave}
              />
              </div>
            </div>
          ))}
        </div>

        {/* Completion Message - Compact banner */}
        <div className="mt-4 lg:mt-5 flex items-center justify-center gap-2 bg-neutral-extralight border border-neutral-indigo/20 rounded-lg py-2 px-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span className="text-xs lg:text-sm text-text-gray">
            مرور کامل: <span className="font-bold text-text-dark">{answeredQuestions}/{totalQuestions} سوال ({progressPercent}%)</span>
          </span>
        </div>

        {/* Navigation to Test - Compact button */}
        <Link
          href={`/lesson/${lessonId}/test`}
          className="mt-3 lg:mt-4 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md"
        >
          <ClipboardCheck className="w-5 h-5" aria-hidden="true" />
          <span>بریم برای آزمون</span>
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center animate-in fade-in slide-in-from-bottom-4"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Floating Add to Leitner Button (on text selection) */}
      {isActive && selectedText && (
        <button
          onClick={handleAddToLeitner}
          className="fixed z-50 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-sm font-semibold flex items-center gap-2 animate-in fade-in zoom-in duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)',
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
        sourcePage="practice"
        onSuccess={handleFlashcardSuccess}
      />
    </main>
  );
}
