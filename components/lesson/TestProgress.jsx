"use client";

import { CheckCircle2, Circle, HelpCircle, XCircle } from 'lucide-react';

export default function TestProgress({ 
  currentIndex, 
  totalQuestions, 
  answers,
  onQuestionClick
}) {
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // Count answer types
  const answered = answers.filter(a => a.selectedAnswer !== null).length;
  const correct = answers.filter(a => a.isCorrect === true).length;
  const wrong = answers.filter(a => a.isCorrect === false && !a.isDoubt).length;
  const doubt = answers.filter(a => a.isDoubt).length;

  return (
    <div className="bg-white border border-neutral-extralight rounded-xl p-4 space-y-4">
      {/* Current Question */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-gray">
          سوال {currentIndex + 1} از {totalQuestions}
        </span>
        <span className="text-sm font-bold text-primary">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-neutral-indigo/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Answer Statistics */}
      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col items-center gap-1 p-2 bg-neutral-indigo/20 rounded-lg">
          <Circle className="w-4 h-4 text-text-gray" aria-hidden="true" />
          <span className="text-xs font-medium text-text-gray">{answered}</span>
          <span className="text-[10px] text-text-light">پاسخ داده</span>
        </div>

        <div className="flex flex-col items-center gap-1 p-2 bg-emerald-50 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <span className="text-xs font-medium text-emerald-700">{correct}</span>
          <span className="text-[10px] text-emerald-600">درست</span>
        </div>

        <div className="flex flex-col items-center gap-1 p-2 bg-rose-50 rounded-lg">
          <XCircle className="w-4 h-4 text-rose-600" aria-hidden="true" />
          <span className="text-xs font-medium text-rose-700">{wrong}</span>
          <span className="text-[10px] text-rose-600">غلط</span>
        </div>

        <div className="flex flex-col items-center gap-1 p-2 bg-amber-50 rounded-lg">
          <HelpCircle className="w-4 h-4 text-amber-600" aria-hidden="true" />
          <span className="text-xs font-medium text-amber-700">{doubt}</span>
          <span className="text-[10px] text-amber-600">شک</span>
        </div>
      </div>

      {/* Question Indicators */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          const answer = answers[index];
          const isCurrent = index === currentIndex;
          const isAnswered = answer?.selectedAnswer !== null;
          const isCorrect = answer?.isCorrect === true;
          const isDoubt = answer?.isDoubt;

          let bgColor = 'bg-neutral-indigo/30';
          let hoverBgColor = 'hover:bg-neutral-indigo/40';
          let borderColor = 'border-transparent';

          if (isAnswered) {
            if (isDoubt) {
              bgColor = 'bg-amber-500';
              hoverBgColor = 'hover:bg-amber-600';
            } else if (isCorrect) {
              bgColor = 'bg-emerald-500';
              hoverBgColor = 'hover:bg-emerald-600';
            } else {
              bgColor = 'bg-rose-500';
              hoverBgColor = 'hover:bg-rose-600';
            }
          }

          if (isCurrent) {
            borderColor = 'border-primary';
          }

          return (
            <button
              key={index}
              onClick={() => onQuestionClick?.(index)}
              className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg ${bgColor} ${hoverBgColor} border-2 ${borderColor} flex items-center justify-center text-xs lg:text-sm font-bold ${
                isAnswered ? 'text-white' : 'text-text-gray'
              } transition-all duration-200 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2`}
              title={`رفتن به سوال ${index + 1}`}
              aria-label={`رفتن به سوال ${index + 1}`}
              aria-current={isCurrent ? 'true' : 'false'}
              type="button"
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

