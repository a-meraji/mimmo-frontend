"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, CheckCircle2, XCircle, HelpCircle, RefreshCw, TrendingUp } from 'lucide-react';
import { getPracticesByLessonId } from '@/utils/practiceApi';
import { getPracticeHistory } from '@/utils/examApi';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import { useAuth } from '@/contexts/AuthContext';
import { getImageUrl } from '@/utils/imageUrl';

export default function LessonPracticePage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading, authenticatedFetch } = useAuth();
  
  // Practice data state
  const [practices, setPractices] = useState([]);
  const [practiceHistory, setPracticeHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  // Fetch practices from backend
  useEffect(() => {
    const fetchPractices = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPracticesByLessonId(lessonId);
        
        if (result.success) {
          setPractices(result.data);
          
          // Fetch history for each practice if authenticated
          if (isAuthenticated && result.data.length > 0) {
            const historyPromises = result.data.map(practice => 
              getPracticeHistory(practice.id, authenticatedFetch)
            );
            
            const historyResults = await Promise.allSettled(historyPromises);
            
            const historyMap = {};
            historyResults.forEach((result, index) => {
              if (result.status === 'fulfilled' && result.value.success) {
                historyMap[practices[index]?.id || result.data[index].id] = result.value.data;
              }
            });
            
            setPracticeHistory(historyMap);
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Error fetching practices:', err);
        setError('خطا در بارگذاری تمرین‌ها');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchPractices();
    }
  }, [lessonId, isAuthenticated, isLoading, authenticatedFetch]);

  // Handle answer selection
  const handleAnswerSelect = (practiceId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [practiceId]: answer
    }));
    
    // Auto-show explanation after selection
    setTimeout(() => {
      setShowExplanations(prev => ({
        ...prev,
        [practiceId]: true
      }));
    }, 300);
  };

  // Check if answer is correct
  const isCorrectAnswer = (practiceId, answer) => {
    const practice = practices.find(p => p.id === practiceId);
    return practice && practice.correctAnswer === answer;
  };

  // Get answer status
  const getAnswerStatus = (practiceId, answer) => {
    const selected = selectedAnswers[practiceId];
    if (!selected) return 'default';
    
    const isCorrect = isCorrectAnswer(practiceId, answer);
    
    if (selected === answer) {
      return isCorrect ? 'correct' : 'incorrect';
    }
    
    // Show correct answer after wrong selection
    if (selected !== answer && isCorrect) {
      return 'correct-highlight';
    }
    
    return 'default';
  };

  // Calculate completion
  const completionPercentage = practices.length > 0 
    ? Math.round((Object.keys(selectedAnswers).length / practices.length) * 100)
    : 0;

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری تمرین‌ها...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black text-text-charcoal mb-4">خطا</h1>
          <p className="text-text-gray mb-6">{error}</p>
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

  // Empty state
  if (practices.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-8 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <nav className="flex items-center gap-2 text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
            <Link href="/learn" className="hover:text-primary transition-colors">
              بخش یادگیری
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
            <span className="text-text-charcoal font-medium">تمرین‌ها</span>
          </nav>

          <LessonNavTabs lessonId={lessonId} />

          <div className="bg-white border border-neutral-light rounded-2xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-neutral-gray mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-text-charcoal mb-2">
              تمرینی برای این درس موجود نیست
            </h2>
            <p className="text-text-gray mb-6">
              لطفاً بعداً دوباره بررسی کنید یا به درس بعدی بروید.
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
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-8 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">تمرین‌ها</span>
        </nav>

        {/* Lesson Navigation Tabs */}
        <LessonNavTabs lessonId={lessonId} />

        {/* Progress Header */}
        <div className="bg-white border border-neutral-light rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-text-charcoal">پیشرفت شما</h2>
            <span className="text-3xl font-black text-primary">{completionPercentage}%</span>
          </div>
          <div className="h-3 bg-neutral-indigo/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-text-gray mt-2">
            {Object.keys(selectedAnswers).length} از {practices.length} تمرین انجام شده
          </p>
        </div>

        {/* Practice Questions */}
        <div className="space-y-6">
          {practices.map((practice, index) => {
            const selected = selectedAnswers[practice.id];
            const showExplanation = showExplanations[practice.id];
            const history = practiceHistory[practice.id];

            return (
              <div
                key={practice.id}
                className="bg-white border border-neutral-light rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Question Header */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-neutral-extralight">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-primary">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      سوال {index + 1}
                    </span>
                    {history && (
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="w-3 h-3" />
                          {history.correctCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-rose-600">
                          <XCircle className="w-3 h-3" />
                          {history.wrongCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-amber-600">
                          <HelpCircle className="w-3 h-3" />
                          {history.unsureCount || 0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Question Text */}
                  <p className="text-lg font-semibold text-text-charcoal mb-4">
                    {practice.question}
                  </p>

                  {/* Question Image */}
                  {practice.imageUrl && (
                    <div className="relative w-full h-48 bg-neutral-indigo/10 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={getImageUrl(practice.imageUrl)}
                        alt="تصویر سوال"
                        fill
                        className="object-contain p-4"
                      />
                    </div>
                  )}

                  {/* Answer Options */}
                  <div className="space-y-2 mb-4">
                    {Object.entries(practice.options || {}).map(([key, value]) => {
                      const status = getAnswerStatus(practice.id, key);
                      
                      return (
                        <button
                          key={key}
                          onClick={() => handleAnswerSelect(practice.id, key)}
                          disabled={selected !== undefined}
                          className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                            status === 'correct'
                              ? 'border-emerald-500 bg-emerald-50'
                              : status === 'incorrect'
                              ? 'border-rose-500 bg-rose-50'
                              : status === 'correct-highlight'
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-neutral-extralight hover:border-primary/30 hover:bg-neutral-indigo/10'
                          } ${selected !== undefined ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                              status === 'correct'
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : status === 'incorrect'
                                ? 'border-rose-500 bg-rose-500 text-white'
                                : status === 'correct-highlight'
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-neutral-gray text-neutral-gray'
                            }`}>
                              {status === 'correct' || status === 'correct-highlight' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : status === 'incorrect' ? (
                                <XCircle className="w-5 h-5" />
                              ) : (
                                key.toUpperCase()
                              )}
                            </span>
                            <span className="text-sm text-text-charcoal flex-1">
                              {value}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && practice.explanation && (
                    <div className={`p-4 rounded-xl border-2 ${
                      isCorrectAnswer(practice.id, selected)
                        ? 'border-emerald-200 bg-emerald-50'
                        : 'border-amber-200 bg-amber-50'
                    }`}>
                      <div className="flex items-start gap-2">
                        <TrendingUp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isCorrectAnswer(practice.id, selected)
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`} aria-hidden="true" />
                        <div>
                          <p className={`font-semibold mb-1 ${
                            isCorrectAnswer(practice.id, selected)
                              ? 'text-emerald-700'
                              : 'text-amber-700'
                          }`}>
                            {isCorrectAnswer(practice.id, selected) ? 'آفرین! پاسخ صحیح' : 'توضیحات'}
                          </p>
                          <p className="text-sm text-text-charcoal leading-relaxed">
                            {practice.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue to Test Button */}
        {completionPercentage === 100 && (
          <div className="mt-8 flex justify-center">
            <Link
              href={`/lesson/${lessonId}/test`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl"
            >
              آماده آزمون هستید؟
              <ArrowRight className="w-5 h-5 rotate-180" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
