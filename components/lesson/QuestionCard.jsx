"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import QuestionStats from './QuestionStats';

export default function QuestionCard({ question, stats, showStats = true }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = useCallback((index) => {
    if (selectedAnswer !== null) return; // Already answered

    setSelectedAnswer(index);
    setShowExplanation(true);
  }, [selectedAnswer]);

  const isCorrect = selectedAnswer === question.correctIndex;
  const hasAnswered = selectedAnswer !== null;

  return (
    <div className="bg-white border border-neutral-extralight rounded-2xl overflow-hidden shadow-sm">
      {/* Question Image */}
      {question.image && (
        <div className="relative w-full aspect-video bg-neutral-indigo/10">
          <Image
            src={question.image}
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
            {question.text}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
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
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-right ${
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
                {/* Option Number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
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

                {/* Option Text */}
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

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div
            className={`p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 ${
              isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
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
                  className={`text-sm leading-7 ${
                    isCorrect ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question Stats */}
        {showStats && stats && <QuestionStats stats={stats} />}
      </div>
    </div>
  );
}

