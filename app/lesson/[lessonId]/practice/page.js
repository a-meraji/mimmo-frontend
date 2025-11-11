"use client";

import { use, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, BookOpen, ArrowUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, getQuestionsForLesson } from '@/utils/lessonData';
import { getQuestionStats } from '@/utils/lessonStorage';
import QuestionCard from '@/components/lesson/QuestionCard';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';

export default function LessonPracticePage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Get lesson and questions data
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);
  const questions = useMemo(() => getQuestionsForLesson(lessonId), [lessonId]);

  // Get stats for all questions
  const questionsWithStats = useMemo(() => {
    return questions.map(question => ({
      ...question,
      stats: getQuestionStats(question.id, user)
    }));
  }, [questions, user]);

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
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow pb-20">
      {/* Sticky Navigation Tabs */}
      <LessonNavTabs lessonId={lessonId} activeTab="practice" />

      {/* Sticky Page Header (Mobile) */}
      <div className="lg:hidden sticky top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-extralight">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-text-charcoal">{lesson.title}</h1>
              <p className="text-xs text-text-gray">تمرین سوالات</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-text-gray">پیشرفت</p>
              <p className="text-sm font-bold text-primary">{progressPercent}%</p>
            </div>
          </div>
          {/* Compact Progress Bar */}
          <div className="h-1 bg-neutral-indigo/30 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-4 lg:py-8">
        {/* Back Button (Mobile) / Breadcrumb (Desktop) */}
        <div className="mb-4 lg:mb-6">
          <button
            onClick={() => router.back()}
            className="lg:hidden inline-flex items-center gap-2 text-text-gray hover:text-primary transition-colors p-2 -ml-2"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">بازگشت</span>
          </button>

          <nav className="hidden lg:flex items-center gap-1.5 text-xs text-text-gray" aria-label="مسیر صفحه">
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
        </div>

        {/* Page Header (Desktop) */}
        <div className="hidden lg:block mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-black text-text-charcoal">{lesson.title}</h1>
              <p className="text-sm text-text-gray">تمرین سوالات</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-text-gray mb-1">پیشرفت کلی</p>
              <p className="text-3xl font-bold text-primary">{progressPercent}%</p>
              <p className="text-xs text-text-gray">{answeredQuestions} از {totalQuestions} سوال</p>
            </div>
          </div>
          <div className="h-2 bg-neutral-indigo/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* All Questions - Scrollable */}
        <div className="space-y-6 lg:space-y-8">
          {questionsWithStats.map((question, index) => (
            <div key={question.id} className="scroll-mt-32">
              {/* Question Number Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{index + 1}</span>
                </div>
                <h2 className="text-sm font-semibold text-text-gray">
                  سوال {index + 1} از {totalQuestions}
                </h2>
              </div>

              {/* Question Card */}
              <QuestionCard
                question={question}
                stats={question.stats}
                showStats={true}
              />
            </div>
          ))}
        </div>

        {/* Completion Message */}
        <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-text-gray mb-2">
            تمام {totalQuestions} سوال را مرور کردید
          </p>
          <p className="text-lg font-bold text-primary">
            {answeredQuestions} سوال پاسخ داده شده ({progressPercent}%)
          </p>
        </div>
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
    </main>
  );
}
