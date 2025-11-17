"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import QuestionStats from './QuestionStats';
import QuestionNote from './QuestionNote';

export default function QuestionCard({ question, stats, showStats = true, note = '', onNoteSave }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const handleAnswerSelect = useCallback((index) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowExplanation(true);
  }, [selectedAnswer]);

  const isCorrect = selectedAnswer === question.correctIndex;
  const hasAnswered = selectedAnswer !== null;

  return (
    <div className="bg-white border border-neutral-extralight rounded-xl lg:rounded-2xl overflow-hidden shadow-sm">
      {/* Mobile: Compact layout with stats and side-by-side image */}
      <div className="lg:hidden">
        <div className="p-2.5 space-y-2.5">
          {/* Stats Component */}
          {showStats && stats && (
            <QuestionStats stats={stats} />
          )}
          
          {/* Image + Text horizontal */}
          <div className="flex gap-3 items-start">
            {question.image && (
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(true)}
                className="relative w-20 h-20 flex-shrink-0 bg-neutral-indigo/10 rounded-lg overflow-hidden hover:bg-neutral-indigo/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="نمایش تصویر بزرگتر"
              >
                <Image
                  src={question.image}
                  alt="تصویر سوال"
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              </button>
            )}
            <h3 className="flex-1 text-sm font-bold text-text-charcoal leading-5">
              {question.text}
            </h3>
          </div>

        {/* Answer Options */}
          <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctIndex;
            const showCorrectIndicator = hasAnswered && isCorrectOption;
            const showWrongIndicator = hasAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all duration-200 text-right ${
                  hasAnswered
                    ? isCorrectOption
                      ? 'bg-emerald-50 border-emerald-500 cursor-default'
                      : isSelected
                      ? 'bg-rose-50 border-rose-500 cursor-default'
                      : 'bg-neutral-indigo/10 border-neutral-extralight cursor-default opacity-60'
                    : 'bg-white border-neutral-extralight hover:border-primary hover:bg-primary/5 cursor-pointer'
                }`}
                type="button"
              >
                <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                    hasAnswered
                      ? isCorrectOption
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-neutral-gray text-white'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {index + 1}
                </div>
                  <span
                    className={`flex-1 text-xs font-medium ${
                      hasAnswered
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
                  {showCorrectIndicator && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                  )}
                  {showWrongIndicator && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation (mobile) */}
          {showExplanation && question.explanation && (
            <div
              className={`p-2.5 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 ${
                isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <Info
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    isCorrect ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      isCorrect ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {isCorrect ? '✓ پاسخ صحیح!' : 'توضیحات'}
                  </p>
                  <p
                    className={`text-xs leading-5 ${
                      isCorrect ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Question Note (mobile) */}
          {onNoteSave && (
            <QuestionNote
              questionId={question.id}
              initialNote={note}
              onSave={onNoteSave}
            />
          )}
        </div>
      </div>

      {/* Desktop: Grid layout with sidebar image */}
      <div className="hidden lg:block">
        <div className={question.image ? 'lg:grid lg:grid-cols-[180px_1fr] lg:gap-4' : ''}>
          {question.image && (
            <button
              type="button"
              onClick={() => setIsImagePreviewOpen(true)}
              className="relative h-36 bg-neutral-indigo/10 rounded-lg overflow-hidden hover:bg-neutral-indigo/20 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="نمایش تصویر بزرگتر"
            >
              <Image
                src={question.image}
                alt="تصویر سوال"
                fill
                className="object-contain p-3"
                sizes="180px"
              />
            </button>
          )}
          
          <div className="p-4 space-y-3">
            {/* Stats Component */}
            {showStats && stats && (
              <QuestionStats stats={stats} />
            )}
            
            {/* Question Text */}
            <h3 className="text-base font-bold text-text-charcoal leading-6">
              {question.text}
            </h3>
            
            {/* Answer Options */}
            <div className="space-y-2">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectOption = index === question.correctIndex;
                const showCorrectIndicator = hasAnswered && isCorrectOption;
                const showWrongIndicator = hasAnswered && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={hasAnswered}
                    className={`w-full flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-200 text-right ${
                      hasAnswered
                        ? isCorrectOption
                          ? 'bg-emerald-50 border-emerald-500 cursor-default'
                          : isSelected
                          ? 'bg-rose-50 border-rose-500 cursor-default'
                          : 'bg-neutral-indigo/10 border-neutral-extralight cursor-default opacity-60'
                        : 'bg-white border-neutral-extralight hover:border-primary hover:bg-primary/5 cursor-pointer'
                    }`}
                    type="button"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                        hasAnswered
                          ? isCorrectOption
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-neutral-gray text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {index + 1}
                    </div>
                <span
                  className={`flex-1 text-sm font-medium ${
                    hasAnswered
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

            {/* Explanation (desktop) */}
        {showExplanation && question.explanation && (
          <div
                className={`p-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
              isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
            }`}
          >
                <div className="flex items-start gap-2.5">
              <Info
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  isCorrect ? 'text-emerald-600' : 'text-amber-600'
                }`}
                aria-hidden="true"
              />
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    isCorrect ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {isCorrect ? '✓ پاسخ صحیح!' : 'توضیحات'}
                </p>
                <p
                      className={`text-sm leading-6 ${
                    isCorrect ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

            {/* Question Note (desktop) */}
            {onNoteSave && (
              <QuestionNote
                questionId={question.id}
                initialNote={note}
                onSave={onNoteSave}
              />
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {question.image && isImagePreviewOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center animate-in fade-in"
          onClick={() => setIsImagePreviewOpen(false)}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="پیش‌نمایش تصویر"
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-[95vw] bg-transparent rounded-xl shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 left-2 z-20 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
              onClick={() => setIsImagePreviewOpen(false)}
              aria-label="بستن"
              tabIndex={0}
            >
              <svg className="w-6 h-6 text-gray-800" viewBox="0 0 20 20" fill="none">
                <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="relative w-full h-[85vh] min-h-[300px] max-h-[85vh]">
              <Image
                src={question.image}
                alt="تصویر سوال - نمایش بزرگ"
                fill
                className="object-contain rounded-xl"
                priority
                sizes="(max-width: 768px) 95vw, 1024px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

