"use client";

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLessonById, getAllLessonsForCourse, getQuestionsForTest } from '@/utils/lessonData';
import { getTestPreferences, saveTestPreferences, getAllQuestionStats, batchUpdateQuestionStats, saveTestResult } from '@/utils/lessonStorage';
import TestConfigForm from '@/components/lesson/TestConfigForm';
import TestTimer from '@/components/lesson/TestTimer';
import TestProgress from '@/components/lesson/TestProgress';
import TestResults from '@/components/lesson/TestResults';

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

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsDoubt(false);
      setShowFeedback(false);
    } else {
      // Test completed
      handleTestComplete();
    }
  }, [currentQuestionIndex, testQuestions.length]);

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
          <p className="text-text-gray">
            {phase === 'config' && 'تنظیمات آزمون'}
            {phase === 'execution' && 'در حال آزمون'}
            {phase === 'results' && 'نتایج آزمون'}
          </p>
        </div>

        {/* Navigation Tabs (only in config phase) */}
        {phase === 'config' && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide">
            <Link
              href={`/lesson/${lessonId}/content`}
              className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
            >
              محتوا
            </Link>
            <Link
              href={`/lesson/${lessonId}/practice`}
              className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
            >
              تمرین
            </Link>
            <Link
              href={`/lesson/${lessonId}/test`}
              className="flex-shrink-0 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-md"
            >
              آزمون
            </Link>
          </div>
        )}

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
          <div className="space-y-6">
            {/* Timer and Progress */}
            <div className="grid lg:grid-cols-2 gap-4">
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
              />
            </div>

            {/* Question Card */}
            <div className="bg-white border border-neutral-extralight rounded-2xl overflow-hidden shadow-sm">
              {/* Question Image */}
              {currentQuestion.image && (
                <div className="relative w-full aspect-video bg-neutral-indigo/10">
                  <Image
                    src={currentQuestion.image}
                    alt="تصویر سوال"
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}

              {/* Question Content */}
              <div className="p-6 space-y-6">
                {/* Question Text */}
                <div>
                  <h3 className="text-lg font-bold text-text-charcoal mb-4 leading-8">
                    {currentQuestion.text}
                  </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
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
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-right ${
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
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
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
                          className={`flex-1 text-sm font-medium ${
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
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                        )}
                        {showWrongIndicator && (
                          <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (if immediate feedback) */}
                {showFeedback && currentQuestion.explanation && (
                  <div
                    className={`p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
                      isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <p className={`text-sm leading-7 ${isCorrect ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {!hasAnswered && (
                    <button
                      onClick={handleDoubtToggle}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        isDoubt
                          ? 'bg-amber-500 text-white'
                          : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
                      }`}
                      type="button"
                    >
                      <HelpCircle className="w-5 h-5" aria-hidden="true" />
                      {isDoubt ? 'حالت شک فعال' : 'مطمئن نیستم'}
                    </button>
                  )}

                  {hasAnswered && (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      type="button"
                    >
                      {currentQuestionIndex < testQuestions.length - 1 ? 'سوال بعدی' : 'اتمام آزمون'}
                    </button>
                  )}
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
    </main>
  );
}

