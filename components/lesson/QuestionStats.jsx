"use client";

import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function QuestionStats({ stats }) {
  const { totalAttempts = 0, correctAttempts = 0, incorrectAttempts = 0, doubtAttempts = 0 } = stats || {};

  // Calculate percentages
  const correctPercent = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  if (totalAttempts === 0) {
    return (
      <div className="bg-neutral-indigo/10 rounded-lg p-2 text-center">
        <p className="text-[10px] lg:text-xs text-text-gray">هنوز تمرین نشده</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-indigo/5 border border-neutral-extralight rounded-lg p-2 lg:p-2.5">
      {/* Compact Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 lg:gap-2 mb-2">
        {/* Correct */}
        <div className="flex flex-col items-center gap-1 p-1.5 lg:p-2 bg-emerald-50 rounded-md">
          <CheckCircle2 className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-600" aria-hidden="true" />
          <p className="text-xs lg:text-sm font-bold text-emerald-700">{correctAttempts}</p>
          <p className="text-[9px] lg:text-[10px] text-emerald-600">درست</p>
        </div>

        {/* Wrong */}
        <div className="flex flex-col items-center gap-1 p-1.5 lg:p-2 bg-rose-50 rounded-md">
          <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-rose-600" aria-hidden="true" />
          <p className="text-xs lg:text-sm font-bold text-rose-700">{incorrectAttempts}</p>
          <p className="text-[9px] lg:text-[10px] text-rose-600">غلط</p>
        </div>

        {/* Doubt */}
        <div className="flex flex-col items-center gap-1 p-1.5 lg:p-2 bg-amber-50 rounded-md">
          <HelpCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-amber-600" aria-hidden="true" />
          <p className="text-xs lg:text-sm font-bold text-amber-700">{doubtAttempts}</p>
          <p className="text-[9px] lg:text-[10px] text-amber-600">شک</p>
        </div>
      </div>

      {/* Compact Progress Bar */}
      <div className="h-1 lg:h-1.5 bg-neutral-indigo/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${correctPercent}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="text-[9px] lg:text-[10px] text-text-gray text-center mt-1">
        {correctPercent}% موفقیت • {totalAttempts} تلاش
      </p>
    </div>
  );
}

