"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, Clock, CheckCircle2, XCircle, HelpCircle, Trophy, RefreshCw, Settings } from 'lucide-react';
import { createExam, startExam, getCurrentQuestion, answerQuestion, completeExam, getExamResult } from '@/utils/examApi';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getImageUrl } from '@/utils/imageUrl';

const EXAM_PHASES = {
  CONFIG: 'config',
  IN_PROGRESS: 'in_progress',
  RESULTS: 'results'
};

export default function LessonTestPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { isAuthenticated, isLoading, authenticatedFetch } = useAuth();
  const { toast } = useToast();
  
  // Exam state
  const [phase, setPhase] = useState(EXAM_PHASES.CONFIG);
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Config state
  const [config, setConfig] = useState({
    totalQuestions: 10,
    timeLimitMinutes: null,
    showAnswersAfterEachQuestion: false
  });
  
  // UI state
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Timer effect
  useEffect(() => {
    if (phase === EXAM_PHASES.IN_PROGRESS && currentQuestion?.timeRemaining) {
      setTimeRemaining(currentQuestion.timeRemaining);
      
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [phase, currentQuestion]);

  // Handle exam creation
  const handleCreateExam = async () => {
    if (!isAuthenticated) {
      toast.error('برای شرکت در آزمون باید وارد شوید');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createExam(
      [lessonId],
      config.totalQuestions,
      config.timeLimitMinutes,
      config.showAnswersAfterEachQuestion,
      authenticatedFetch
    );

    if (result.success) {
      setExam(result.data);
      await handleStartExam(result.data.id);
    } else {
      setError(result.error);
      if (result.alreadyInProgress) {
        toast.error('شما یک آزمون در حال انجام دارید');
      } else {
        toast.error(result.error || 'خطا در ایجاد آزمون');
      }
    }

    setLoading(false);
  };

  // Handle exam start
  const handleStartExam = async (examId) => {
    const result = await startExam(examId, authenticatedFetch);
    
    if (result.success) {
      await loadCurrentQuestion(examId, 1);
      setPhase(EXAM_PHASES.IN_PROGRESS);
    } else {
      setError(result.error);
      toast.error(result.error || 'خطا در شروع آزمون');
    }
  };

  // Load current question
  const loadCurrentQuestion = async (examId, questionNumber = null) => {
    setQuestionLoading(true);
    
    const result = await getCurrentQuestion(examId, questionNumber, authenticatedFetch);
    
    if (result.success) {
      setCurrentQuestion(result.data);
      setSelectedAnswer(null);
    } else if (result.noMoreQuestions) {
      // Exam completed, go to results
      await handleCompleteExam(examId);
    } else {
      setError(result.error);
      toast.error(result.error || 'خطا در بارگذاری سوال');
    }
    
    setQuestionLoading(false);
  };

  // Handle answer submission
  const handleAnswerSubmit = async (answer, isUnsure = 'sure') => {
    if (!currentQuestion || !exam) return;

    setQuestionLoading(true);

    const result = await answerQuestion(
      exam.id,
      currentQuestion.id,
      answer,
      isUnsure,
      authenticatedFetch
    );

    if (result.success) {
      setSelectedAnswer(answer);
      
      // If showing answers after each question, display feedback
      if (config.showAnswersAfterEachQuestion && result.data) {
        toast.success(result.data.isCorrect ? 'پاسخ صحیح!' : 'پاسخ نادرست');
      }
      
      // Move to next question after delay
      setTimeout(() => {
        loadCurrentQuestion(exam.id, currentQuestion.questionNumber + 1);
      }, config.showAnswersAfterEachQuestion ? 1500 : 500);
    } else {
      toast.error(result.error || 'خطا در ثبت پاسخ');
    }
    
    setQuestionLoading(false);
  };

  // Handle exam completion
  const handleCompleteExam = async (examId) => {
    const result = await completeExam(examId, lessonId, authenticatedFetch);
    
    if (result.success || result.alreadyCompleted) {
      await loadExamResult(examId);
    } else {
      setError(result.error);
      toast.error(result.error || 'خطا در اتمام آزمون');
    }
  };

  // Load exam result
  const loadExamResult = async (examId) => {
    setLoading(true);
    
    const result = await getExamResult(examId, authenticatedFetch);
    
    if (result.success) {
      setExamResult(result.data);
      setPhase(EXAM_PHASES.RESULTS);
    } else {
      setError(result.error);
      toast.error(result.error || 'خطا در بارگذاری نتایج');
    }
    
    setLoading(false);
  };

  // Loading state during auth check
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black text-text-charcoal mb-4">نیاز به ورود</h1>
          <p className="text-text-gray mb-6">برای شرکت در آزمون باید وارد حساب کاربری خود شوید</p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            ورود به حساب کاربری
          </Link>
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
          <span className="text-text-charcoal font-medium">آزمون</span>
        </nav>

        {/* Lesson Navigation Tabs */}
        <LessonNavTabs lessonId={lessonId} />

        {/* Config Phase */}
        {phase === EXAM_PHASES.CONFIG && (
          <div className="bg-white border border-neutral-light rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-8 h-8 text-primary" aria-hidden="true" />
              <h1 className="text-2xl lg:text-3xl font-black text-text-charcoal">
                تنظیمات آزمون
              </h1>
            </div>

            <div className="space-y-6">
              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-semibold text-text-charcoal mb-2">
                  تعداد سوالات
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={config.totalQuestions}
                  onChange={(e) => setConfig({ ...config, totalQuestions: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border-2 border-neutral-extralight rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              {/* Time Limit */}
              <div>
                <label className="block text-sm font-semibold text-text-charcoal mb-2">
                  محدودیت زمانی (دقیقه) - اختیاری
                </label>
                <input
                  type="number"
                  min="0"
                  value={config.timeLimitMinutes || ''}
                  onChange={(e) => setConfig({ ...config, timeLimitMinutes: e.target.value ? parseInt(e.target.value) : null })}
                  placeholder="بدون محدودیت"
                  className="w-full px-4 py-3 border-2 border-neutral-extralight rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              {/* Show Answers */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showAnswers"
                  checked={config.showAnswersAfterEachQuestion}
                  onChange={(e) => setConfig({ ...config, showAnswersAfterEachQuestion: e.target.checked })}
                  className="w-5 h-5 text-primary rounded border-neutral-gray focus:ring-primary"
                />
                <label htmlFor="showAnswers" className="text-sm text-text-charcoal">
                  نمایش پاسخ صحیح بعد از هر سوال
                </label>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700">
                  {error}
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={handleCreateExam}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                    در حال آماده‌سازی...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" aria-hidden="true" />
                    شروع آزمون
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* In Progress Phase */}
        {phase === EXAM_PHASES.IN_PROGRESS && currentQuestion && (
          <div className="space-y-6">
            {/* Progress Header */}
            <div className="bg-white border border-neutral-light rounded-2xl p-4 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-text-gray">
                  سوال {currentQuestion.questionNumber} از {exam.totalQuestions}
                </span>
                {timeRemaining !== null && (
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    <span className="font-mono font-bold">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
              <div className="h-2 flex-1 mx-6 bg-neutral-indigo/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${(currentQuestion.questionNumber / exam.totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white border border-neutral-light rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-neutral-extralight">
                <span className="text-sm font-bold text-primary">سوال {currentQuestion.questionNumber}</span>
              </div>

              <div className="p-6">
                {/* Question Text */}
                <p className="text-lg font-semibold text-text-charcoal mb-4">
                  {currentQuestion.practice.question}
                </p>

                {/* Question Image */}
                {currentQuestion.practice.imageUrl && (
                  <div className="relative w-full h-48 bg-neutral-indigo/10 rounded-xl overflow-hidden mb-4">
                    <Image
                      src={getImageUrl(currentQuestion.practice.imageUrl)}
                      alt="تصویر سوال"
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                )}

                {/* Answer Options */}
                <div className="space-y-2">
                  {Object.entries(currentQuestion.practice.options || {}).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswerSubmit(key)}
                      disabled={questionLoading}
                      className="w-full text-right p-4 rounded-xl border-2 border-neutral-extralight hover:border-primary/30 hover:bg-neutral-indigo/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-neutral-gray text-neutral-gray flex items-center justify-center font-bold">
                          {key.toUpperCase()}
                        </span>
                        <span className="text-sm text-text-charcoal flex-1">
                          {value}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Mark as Unsure Button */}
                <button
                  onClick={() => handleAnswerSubmit(null, 'unsure')}
                  disabled={questionLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 border-2 border-amber-300 text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HelpCircle className="w-5 h-5" aria-hidden="true" />
                  مطمئن نیستم
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === EXAM_PHASES.RESULTS && examResult && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-2xl p-8 shadow-xl text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" aria-hidden="true" />
              <h1 className="text-3xl font-black mb-2">آزمون تمام شد!</h1>
              <p className="text-white/90">نتیجه شما</p>
              <div className="text-6xl font-black mt-4">
                {examResult.score}%
              </div>
            </div>

            {/* Statistics */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white border border-neutral-light rounded-xl p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-black text-emerald-600">{examResult.totalCorrect}</p>
                <p className="text-sm text-text-gray">پاسخ صحیح</p>
              </div>
              <div className="bg-white border border-neutral-light rounded-xl p-6 text-center">
                <XCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-black text-rose-600">
                  {examResult.totalAnswered - examResult.totalCorrect - (examResult.totalUnsure || 0)}
                </p>
                <p className="text-sm text-text-gray">پاسخ نادرست</p>
              </div>
              <div className="bg-white border border-neutral-light rounded-xl p-6 text-center">
                <HelpCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-black text-amber-600">{examResult.totalUnsure || 0}</p>
                <p className="text-sm text-text-gray">نامشخص</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href={`/lesson/${lessonId}/content`}
                className="inline-flex items-center gap-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
              >
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                بازگشت به درس
              </Link>
              <button
                onClick={() => {
                  setPhase(EXAM_PHASES.CONFIG);
                  setExam(null);
                  setCurrentQuestion(null);
                  setExamResult(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                آزمون جدید
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
