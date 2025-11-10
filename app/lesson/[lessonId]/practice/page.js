"use client";

import { use, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, getQuestionsForLesson } from '@/utils/lessonData';
import { getQuestionStats } from '@/utils/lessonStorage';
import QuestionCard from '@/components/lesson/QuestionCard';

export default function LessonPracticePage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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

  const currentQuestion = questionsWithStats[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

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
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-text-gray mb-8" aria-label="مسیر صفحه">
            <Link href="/learn" className="hover:text-primary transition-colors">
              یادگیری
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
            <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
              دوره
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
            <span className="text-text-charcoal font-medium">{lesson.title}</span>
          </nav>

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
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-8" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
            دوره
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">{lesson.title}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-text-charcoal mb-2">{lesson.title}</h1>
          <p className="text-text-gray">تمرین سوالات</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide">
          <Link
            href={`/lesson/${lessonId}/content`}
            className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
          >
            محتوا
          </Link>
          <Link
            href={`/lesson/${lessonId}/practice`}
            className="flex-shrink-0 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-md"
          >
            تمرین
          </Link>
          <Link
            href={`/lesson/${lessonId}/test`}
            className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
          >
            آزمون
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-gray">
              سوال {currentQuestionIndex + 1} از {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-neutral-indigo/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="mb-6">
          <QuestionCard
            question={currentQuestion}
            stats={currentQuestion.stats}
            showStats={true}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-neutral-extralight rounded-xl font-semibold hover:bg-neutral-indigo transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
            سوال قبل
          </button>

          <button
            onClick={goToNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            سوال بعد
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
}

