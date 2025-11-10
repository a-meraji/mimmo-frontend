"use client";

import { Trophy, CheckCircle2, XCircle, HelpCircle, RotateCcw, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function TestResults({ 
  questions, 
  answers, 
  onRetry, 
  onBackToLesson 
}) {
  // Calculate statistics
  const totalQuestions = questions.length;
  const correct = answers.filter(a => a.isCorrect === true).length;
  const wrong = answers.filter(a => a.isCorrect === false && !a.isDoubt).length;
  const doubt = answers.filter(a => a.isDoubt).length;
  const skipped = answers.filter(a => a.selectedAnswer === null).length;
  const scorePercent = Math.round((correct / totalQuestions) * 100);

  // Determine performance level
  let performanceLevel = 'نیاز به تمرین بیشتر';
  let performanceColor = 'text-rose-600';
  let performanceBg = 'bg-rose-50';

  if (scorePercent >= 80) {
    performanceLevel = 'عالی!';
    performanceColor = 'text-emerald-600';
    performanceBg = 'bg-emerald-50';
  } else if (scorePercent >= 60) {
    performanceLevel = 'خوب';
    performanceColor = 'text-amber-600';
    performanceBg = 'bg-amber-50';
  }

  return (
    <div className="space-y-6">
      {/* Score Card */}
      <div className={`${performanceBg} border-2 ${performanceColor.replace('text-', 'border-')} rounded-2xl p-8 text-center`}>
        <Trophy className={`w-16 h-16 ${performanceColor} mx-auto mb-4`} aria-hidden="true" />
        <h2 className="text-3xl font-black text-text-charcoal mb-2">
          {scorePercent}%
        </h2>
        <p className={`text-lg font-semibold ${performanceColor} mb-4`}>
          {performanceLevel}
        </p>
        <p className="text-sm text-text-gray">
          {correct} پاسخ صحیح از {totalQuestions} سوال
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-emerald-700">{correct}</p>
          <p className="text-xs text-emerald-600">درست</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
          <XCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-rose-700">{wrong}</p>
          <p className="text-xs text-rose-600">غلط</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <HelpCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold text-amber-700">{doubt}</p>
          <p className="text-xs text-amber-600">شک</p>
        </div>

        <div className="bg-neutral-indigo/30 border border-neutral-extralight rounded-xl p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-neutral-gray mx-auto mb-2 flex items-center justify-center">
            <span className="text-white text-sm font-bold">-</span>
          </div>
          <p className="text-2xl font-bold text-text-gray">{skipped}</p>
          <p className="text-xs text-text-gray">بدون پاسخ</p>
        </div>
      </div>

      {/* Review Questions */}
      <div className="bg-white border border-neutral-extralight rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-charcoal mb-4">بررسی سوالات</h3>
        <div className="space-y-4">
          {questions.map((question, index) => {
            const answer = answers[index];
            const isCorrect = answer?.isCorrect === true;
            const isDoubt = answer?.isDoubt;
            const userAnswer = answer?.selectedAnswer !== null ? question.options[answer.selectedAnswer] : null;
            const correctAnswer = question.options[question.correctIndex];

            let statusColor = 'text-neutral-gray';
            let statusBg = 'bg-neutral-indigo/20';
            let statusIcon = null;

            if (answer?.selectedAnswer !== null) {
              if (isDoubt) {
                statusColor = 'text-amber-600';
                statusBg = 'bg-amber-50';
                statusIcon = <HelpCircle className="w-5 h-5" aria-hidden="true" />;
              } else if (isCorrect) {
                statusColor = 'text-emerald-600';
                statusBg = 'bg-emerald-50';
                statusIcon = <CheckCircle2 className="w-5 h-5" aria-hidden="true" />;
              } else {
                statusColor = 'text-rose-600';
                statusBg = 'bg-rose-50';
                statusIcon = <XCircle className="w-5 h-5" aria-hidden="true" />;
              }
            }

            return (
              <div key={index} className={`${statusBg} border border-neutral-extralight rounded-xl p-4`}>
                <div className="flex items-start gap-3">
                  {/* Question Number */}
                  <div className={`w-8 h-8 rounded-full ${statusBg} flex items-center justify-center flex-shrink-0 font-bold text-sm ${statusColor}`}>
                    {index + 1}
                  </div>

                  {/* Question Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-charcoal mb-2">
                      {question.text}
                    </p>
                    
                    {userAnswer && (
                      <div className="space-y-1 text-xs">
                        <p className={statusColor}>
                          <span className="font-semibold">پاسخ شما:</span> {userAnswer}
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-600">
                            <span className="font-semibold">پاسخ صحیح:</span> {correctAnswer}
                          </p>
                        )}
                      </div>
                    )}

                    {!userAnswer && (
                      <p className="text-xs text-text-gray">
                        پاسخ داده نشد
                      </p>
                    )}
                  </div>

                  {/* Status Icon */}
                  {statusIcon && (
                    <div className={statusColor}>
                      {statusIcon}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
          type="button"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          آزمون مجدد
        </button>

        <button
          onClick={onBackToLesson}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-neutral-extralight text-text-charcoal py-4 rounded-xl font-semibold hover:bg-neutral-indigo transition-colors duration-200"
          type="button"
        >
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
          بازگشت به درس
        </button>
      </div>
    </div>
  );
}

