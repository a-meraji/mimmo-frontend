"use client";

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, getAllLessonsForCourse, getQuestionsForTest } from '@/utils/lessonData';
import { getTestPreferences, saveTestPreferences, getAllQuestionStats, batchUpdateQuestionStats, saveTestResult } from '@/utils/lessonStorage';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import TestConfigForm from '@/components/lesson/TestConfigForm';
import TestTimer from '@/components/lesson/TestTimer';
import TestProgress from '@/components/lesson/TestProgress';
import TestResults from '@/components/lesson/TestResults';
import ExitTestModal from '@/components/lesson/ExitTestModal';

export default function LessonTestPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  // Get lesson data
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);
  
  // Get available lessons for scope selection
  const availableLessons = useMemo(() => {
    if (!lesson) return [];
    const allLessons = getAllLessonsForCourse(lesson.courseId);
    // Get lessons before current lesson
    const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
    return allLessons.slice(0, currentLessonIndex);
  }, [lesson, lessonId]);

  // Test state
  const [phase, setPhase] = useState('config'); // 'config', 'execution', 'results'
  const [testConfig, setTestConfig] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isDoubt, setIsDoubt] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Load saved preferences
  const savedPreferences = useMemo(() => getTestPreferences(user), [user]);

  // Handle test configuration submission
  const handleConfigSubmit = useCallback((config) => {
    // Save preferences
    saveTestPreferences(config, user);

    // Get question stats for filtering
    const stats = getAllQuestionStats(user);

    // Get questions based on config
    const questions = getQuestionsForTest(config, stats);

    if (questions.length === 0) {
      alert('هیچ سوالی با این تنظیمات یافت نشد. لطفاً تنظیمات را تغییر دهید.');
      return;
    }

    // Initialize answers array
    const initialAnswers = questions.map(() => ({
      selectedAnswer: null,
      isCorrect: null,
      isDoubt: false
    }));

    setTestConfig(config);
    setTestQuestions(questions);
    setAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsDoubt(false);
    setShowFeedback(false);
    setPhase('execution');
  }, [user]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex) => {
    if (selectedAnswer !== null) return; // Already answered

    const currentQuestion = testQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctIndex;

    setSelectedAnswer(answerIndex);

    // Update answers array
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        selectedAnswer: answerIndex,
        isCorrect: isDoubt ? null : isCorrect, // If doubt, don't mark as correct/wrong
        isDoubt
      };
      return newAnswers;
    });

    // Show feedback if immediate mode
    if (testConfig.feedbackMode === 'immediate') {
      setShowFeedback(true);
    }
  }, [selectedAnswer, testQuestions, currentQuestionIndex, isDoubt, testConfig]);

  // Handle doubt toggle
  const handleDoubtToggle = useCallback(() => {
    setIsDoubt(prev => !prev);
  }, []);

  // Handle test completion
  const handleTestComplete = useCallback(() => {
    // Calculate results for stats update
    const statsUpdates = testQuestions.map((question, index) => {
      const answer = answers[index];
      let resultType = 'wrong';

      if (answer.selectedAnswer === null) {
        resultType = 'wrong'; // Treat skipped as wrong
      } else if (answer.isDoubt) {
        resultType = 'doubt';
      } else if (answer.isCorrect) {
        resultType = 'correct';
      }

      return {
        questionId: question.id,
        resultType
      };
    });

    // Update question statistics
    batchUpdateQuestionStats(statsUpdates, user);

    // Save test result to history
    const testResult = {
      lessonId,
      config: testConfig,
      questions: testQuestions.map(q => q.id),
      answers,
      score: answers.filter(a => a.isCorrect === true).length,
      totalQuestions: testQuestions.length
    };
    saveTestResult(testResult, user);

    // Show results
    setPhase('results');
  }, [testQuestions, answers, testConfig, lessonId, user]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Load next answer state
      const nextAnswer = answers[currentQuestionIndex + 1];
      setSelectedAnswer(nextAnswer?.selectedAnswer ?? null);
      setIsDoubt(nextAnswer?.isDoubt ?? false);
      setShowFeedback(false);
    } else {
      // Test completed
      handleTestComplete();
    }
  }, [currentQuestionIndex, testQuestions.length, answers, handleTestComplete]);

  // Handle previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Load previous answer state
      const prevAnswer = answers[currentQuestionIndex - 1];
      setSelectedAnswer(prevAnswer?.selectedAnswer ?? null);
      setIsDoubt(prevAnswer?.isDoubt ?? false);
      setShowFeedback(false);
    }
  }, [currentQuestionIndex, answers]);

  // Handle go to specific question
  const handleGoToQuestion = useCallback((index) => {
    if (index >= 0 && index < testQuestions.length && index !== currentQuestionIndex) {
      setCurrentQuestionIndex(index);
      // Load answer state for that question
      const answer = answers[index];
      setSelectedAnswer(answer?.selectedAnswer ?? null);
      setIsDoubt(answer?.isDoubt ?? false);
      setShowFeedback(false);
    }
  }, [testQuestions.length, answers, currentQuestionIndex]);

  // Handle time up (auto-submit)
  const handleTimeUp = useCallback(() => {
    if (selectedAnswer === null) {
      // No answer selected, mark as skipped
      setAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = {
          selectedAnswer: null,
          isCorrect: null,
          isDoubt: false
        };
        return newAnswers;
      });
    }

    // Move to next question
    setTimeout(() => {
      handleNextQuestion();
    }, 500);
  }, [selectedAnswer, currentQuestionIndex, handleNextQuestion]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setPhase('config');
    setTestConfig(null);
    setTestQuestions([]);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsDoubt(false);
    setShowFeedback(false);
  }, []);

  // Handle back to lesson
  const handleBackToLesson = useCallback(() => {
    router.push(`/lesson/${lessonId}/content`);
  }, [router, lessonId]);

  // Handle exit confirmation
  const handleExitConfirm = useCallback(() => {
    setIsExitModalOpen(false);
    router.back();
  }, [router]);

  // Prevent browser navigation during test
  useEffect(() => {
    if (phase === 'execution') {
      const handleBeforeUnload = (e) => {
        const hasUnanswered = answers.some(a => a.selectedAnswer === null);
        if (hasUnanswered) {
          e.preventDefault();
          e.returnValue = '';
        }
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [phase, answers]);

  // Keyboard shortcuts for navigation and answer selection
  useEffect(() => {
    if (phase !== 'execution' || !testQuestions[currentQuestionIndex]) return;

    const currentQuestion = testQuestions[currentQuestionIndex];
    const hasAnswered = selectedAnswer !== null;

    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Arrow Left / Right for Previous/Next navigation
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNextQuestion();
        return;
      }
      if (e.key === 'ArrowRight' && currentQuestionIndex > 0) {
        e.preventDefault();
        handlePreviousQuestion();
        return;
      }

      // Number keys (1-4) for answer selection (only if not answered)
      if (!hasAnswered && currentQuestion) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentQuestion.options.length) {
          e.preventDefault();
          handleAnswerSelect(num - 1);
          return;
        }
      }

      // D key for doubt toggle (only if not answered)
      if ((e.key === 'd' || e.key === 'D') && !hasAnswered) {
        e.preventDefault();
        handleDoubtToggle();
        return;
      }

      // Enter key to proceed to next question
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, testQuestions, currentQuestionIndex, selectedAnswer, handleAnswerSelect, handleDoubtToggle, handleNextQuestion, handlePreviousQuestion]);

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

  const currentQuestion = testQuestions[currentQuestionIndex];
  const hasAnswered = selectedAnswer !== null;
  const isCorrect = hasAnswered && selectedAnswer === currentQuestion?.correctIndex;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow pt-16 lg:pt-24 pb-8 lg:pb-12">
      {/* Sticky Navigation Tabs (only in config phase) */}
      {phase === 'config' && <LessonNavTabs lessonId={lessonId} activeTab="test" />}

      <div className="container mx-auto px-3 lg:px-8 max-w-4xl py-2 lg:py-4">
        {/* Compact Header Bar - Mobile and Desktop */}
        <div className="mb-2 lg:mb-3">
          {/* Mobile: Single compact bar */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => {
                if (phase === 'execution') {
                  const hasUnanswered = answers.some(a => a.selectedAnswer === null);
                  if (hasUnanswered) {
                    setIsExitModalOpen(true);
                    return;
                  }
                }
                router.back();
              }}
              className="inline-flex items-center gap-1 text-text-gray hover:text-primary transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xs font-bold text-text-charcoal truncate">{lesson.title}</h1>
            </div>
            <span className="text-xs font-medium text-primary">
              {phase === 'config' && 'تنظیمات'}
              {phase === 'execution' && 'آزمون'}
              {phase === 'results' && 'نتایج'}
            </span>
          </div>

          {/* Desktop: Breadcrumb with inline title and phase */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            </div>
            <span className="text-sm font-semibold text-primary">
              {phase === 'config' && 'تنظیمات آزمون'}
              {phase === 'execution' && 'در حال آزمون'}
              {phase === 'results' && 'نتایج آزمون'}
            </span>
          </div>
        </div>

        {/* Configuration Phase */}
        {phase === 'config' && (
          <TestConfigForm
            lessonId={lessonId}
            availableLessons={availableLessons}
            defaultConfig={savedPreferences}
            onSubmit={handleConfigSubmit}
          />
        )}

        {/* Execution Phase */}
        {phase === 'execution' && currentQuestion && (
          <div className="space-y-2.5 lg:space-y-3">
            {/* Timer and Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-2.5">
              {testConfig.timeLimit && (
                <TestTimer
                  duration={50}
                  onTimeUp={handleTimeUp}
                  isPaused={hasAnswered && testConfig.feedbackMode === 'immediate'}
                />
              )}
              <TestProgress
                currentIndex={currentQuestionIndex}
                totalQuestions={testQuestions.length}
                answers={answers}
                onQuestionClick={handleGoToQuestion}
              />
            </div>

            {/* Question Card */}
            <div className="bg-white border border-neutral-extralight rounded-xl lg:rounded-2xl overflow-hidden shadow-sm">
              {/* Question Image */}
              {currentQuestion.image && (
                <div className="relative w-full h-32 lg:h-48 bg-neutral-indigo/10">
                  <Image
                    src={currentQuestion.image}
                    alt="تصویر سوال"
                    fill
                    className="object-contain p-2 lg:p-3"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Question Content */}
              <div className="p-2.5 lg:p-4 space-y-2.5 lg:space-y-3">
                {/* Question Text */}
                <div>
                  <h3 className="text-base lg:text-lg font-bold text-text-charcoal mb-2 leading-6">
                    {currentQuestion.text}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectOption = index === currentQuestion.correctIndex;
                    const showCorrectIndicator = hasAnswered && showFeedback && isCorrectOption;
                    const showWrongIndicator = hasAnswered && showFeedback && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={hasAnswered}
                        className={`w-full flex items-center gap-2 p-2.5 rounded-lg lg:rounded-xl border-2 transition-all duration-200 text-right ${
                          hasAnswered && showFeedback
                            ? isCorrectOption
                              ? 'bg-emerald-50 border-emerald-500 cursor-default'
                              : isSelected
                              ? 'bg-rose-50 border-rose-500 cursor-default'
                              : 'bg-neutral-indigo/10 border-neutral-extralight cursor-default opacity-60'
                            : isSelected
                            ? isDoubt
                              ? 'bg-amber-50 border-amber-500'
                              : 'bg-primary/10 border-primary'
                            : 'bg-white border-neutral-extralight hover:border-primary hover:bg-primary/5 cursor-pointer'
                        }`}
                        type="button"
                      >
                        {/* Option Number */}
                        <div
                          className={`w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                            hasAnswered && showFeedback
                              ? isCorrectOption
                                ? 'bg-emerald-500 text-white'
                                : isSelected
                                ? 'bg-rose-500 text-white'
                                : 'bg-neutral-gray text-white'
                              : isSelected
                              ? isDoubt
                                ? 'bg-amber-500 text-white'
                                : 'bg-primary text-white'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {index + 1}
                        </div>

                        {/* Option Text */}
                        <span
                          className={`flex-1 text-xs lg:text-sm font-medium ${
                            hasAnswered && showFeedback
                              ? isCorrectOption
                                ? 'text-emerald-700'
                                : isSelected
                                ? 'text-rose-700'
                                : 'text-text-gray'
                              : 'text-text-charcoal'
                          }`}
                        >
                          {option}
                        </span>

                        {/* Indicator Icons */}
                        {showCorrectIndicator && (
                          <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                        )}
                        {showWrongIndicator && (
                          <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-rose-600 flex-shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (if immediate feedback) */}
                {showFeedback && currentQuestion.explanation && (
                  <div
                    className={`p-2.5 lg:p-3 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
                      isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <p className={`text-xs lg:text-sm leading-5 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {/* Doubt Button (only when not answered) */}
                  {!hasAnswered && (
                    <button
                      onClick={handleDoubtToggle}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg lg:rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isDoubt
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
                      }`}
                      type="button"
                    >
                      <HelpCircle className="w-4 h-4" aria-hidden="true" />
                      {isDoubt ? 'حالت شک فعال' : 'مطمئن نیستم'}
                    </button>
                  )}

                  {/* Navigation Buttons */}
                  <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-indigo/20 text-text-charcoal rounded-lg lg:rounded-xl font-semibold text-sm hover:bg-neutral-indigo/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      type="button"
                      aria-label="سوال قبلی"
                    >
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">قبلی</span>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg lg:rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                      type="button"
                      aria-label={currentQuestionIndex < testQuestions.length - 1 ? 'سوال بعدی' : 'اتمام آزمون'}
                    >
                      <span className="hidden sm:inline">{currentQuestionIndex < testQuestions.length - 1 ? 'بعدی' : 'اتمام'}</span>
                      <span className="sm:hidden">{currentQuestionIndex < testQuestions.length - 1 ? 'بعدی' : 'اتمام آزمون'}</span>
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && (
          <TestResults
            questions={testQuestions}
            answers={answers}
            onRetry={handleRetry}
            onBackToLesson={handleBackToLesson}
          />
        )}
      </div>

      {/* Exit Test Modal */}
      <ExitTestModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleExitConfirm}
      />
    </main>
  );
}

