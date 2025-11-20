"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Clock, RefreshCw, Lock, FileText } from 'lucide-react';
import { getFreeLesson, getPaidLesson, getLessonWords, createPersonalNote } from '@/utils/learningApi';
import WordModal from '@/components/lesson/WordModal';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/utils/imageUrl';

export default function LessonContentPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading, authenticatedFetch } = useAuth();
  
  // Lesson data state
  const [lesson, setLesson] = useState(null);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  
  // UI state
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch lesson data from backend
  useEffect(() => {
    const fetchLessonData = async () => {
      if (isLoading) return;

      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);

        // Try to get as free lesson first
        const freeResult = await getFreeLesson(lessonId);
        
        let lessonData = null;
        
        if (freeResult.success) {
          // It's a free lesson
          lessonData = freeResult.data;
        } else if (freeResult.notFree && isAuthenticated) {
          // Not free, try to get as paid lesson
          // Note: We need packageId from somewhere - ideally from URL params or state
          // For now, show access denied with a message to purchase
          setAccessDenied(true);
          setError('این درس رایگان نیست. برای دسترسی باید دوره را خریداری کنید.');
          setLoading(false);
          return;
        } else {
          setError(freeResult.error || 'خطا در بارگذاری درس');
          setLoading(false);
          return;
        }

        setLesson(lessonData);

        // Fetch words for the lesson
        const wordsResult = await getLessonWords(lessonId);
        if (wordsResult.success) {
          setWords(wordsResult.data);
        }

      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('خطا در بارگذاری درس');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [lessonId, isAuthenticated, isLoading]);

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

  // Handle personal note save
  const handlePersonalNoteSave = async (wordId, content) => {
    if (!isAuthenticated) {
      toast.error('برای ذخیره یادداشت باید وارد شوید');
      return false;
    }

    const result = await createPersonalNote(wordId, content, authenticatedFetch);
    
    if (result.success) {
      toast.success(result.isUpdate ? 'یادداشت به‌روزرسانی شد' : 'یادداشت ذخیره شد');
      
      // Update words array with new note
      setWords(prevWords => 
        prevWords.map(w => 
          w.id === wordId 
            ? { ...w, personalNotes: [{ content, user, word: w }] }
            : w
        )
      );
      
      return true;
    } else {
      toast.error(result.error || 'خطا در ذخیره یادداشت');
      return false;
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  // Access denied state
  if (accessDenied) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Lock className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-3xl font-black text-text-charcoal mb-4">دسترسی محدود</h1>
          <p className="text-text-gray mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-neutral-gray text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-gray/90 transition-colors"
            >
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
              بازگشت
            </button>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              مشاهده فروشگاه
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-text-charcoal mb-4">خطا</h1>
          <p className="text-text-gray mb-8">{error || 'درس یافت نشد'}</p>
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
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-8 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">{lesson.title}</span>
        </nav>

        {/* Lesson Navigation Tabs */}
        <LessonNavTabs lessonId={lessonId} />

        {/* Lesson Content Container */}
        <div className="bg-white border border-neutral-light rounded-2xl overflow-hidden shadow-lg mb-8">
          {/* Lesson Header */}
          <div className="border-b border-neutral-extralight p-6 lg:p-8">
            <div className="flex items-start gap-4">
              {lesson.imageUrl && (
                <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-neutral-indigo/10 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={getImageUrl(lesson.imageUrl)}
                    alt={lesson.title}
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm text-text-gray">محتوای درس</span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-text-charcoal mb-3">
                  {lesson.title}
                </h1>
                {lesson.description && (
                  <p className="text-sm text-text-gray leading-relaxed">
                    {lesson.description}
                  </p>
                )}
                {lesson.isFree && (
                  <span className="inline-flex items-center gap-1 mt-3 bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full">
                    رایگان
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Description/Content */}
          {lesson.description && (
            <div className="p-6 lg:p-8 border-b border-neutral-extralight">
              <div className="prose prose-sm max-w-none">
                <p className="text-text-charcoal leading-relaxed">{lesson.description}</p>
              </div>
            </div>
          )}

          {/* Vocabulary Section */}
          <section className="p-6 lg:p-8">
            <h2 className="flex items-center gap-2 text-xl lg:text-2xl font-bold text-text-charcoal mb-6">
              <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
              لغات کلیدی ({words.length})
            </h2>
            
            {words.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                {words.map((word) => (
                  <button
                    key={word.id}
                    onClick={() => handleWordClick(word)}
                    className="group bg-gradient-to-br from-neutral-indigo/40 to-neutral-indigo/20 hover:from-primary/10 hover:to-primary/5 border border-neutral-light hover:border-primary/30 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md text-right"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-text-charcoal group-hover:text-primary transition-colors">
                        {word.word}
                      </span>
                      <BookOpen className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" aria-hidden="true" />
                    </div>
                    <p className="text-sm text-text-gray group-hover:text-text-charcoal transition-colors">
                      {word.title}
                    </p>
                    {word.personalNotes && word.personalNotes.length > 0 && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                        <FileText className="w-3 h-3" aria-hidden="true" />
                        <span>یادداشت شخصی</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-extralight/50 rounded-xl">
                <BookOpen className="w-12 h-12 text-neutral-gray mx-auto mb-3" aria-hidden="true" />
                <p className="text-text-gray">هنوز لغتی برای این درس اضافه نشده است.</p>
              </div>
            )}
          </section>
        </div>

        {/* Continue to Practice Button */}
        <div className="flex justify-center">
          <Link
            href={`/lesson/${lessonId}/practice`}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
          >
            ادامه به تمرین‌ها
            <ArrowRight className="w-5 h-5 rotate-180" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Word Modal */}
      {selectedWord && (
        <WordModal
          word={selectedWord}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSaveNote={handlePersonalNoteSave}
          userId={user?.id}
        />
      )}
    </main>
  );
}
