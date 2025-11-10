"use client";

import { CheckCircle2, XCircle, HelpCircle, Target } from 'lucide-react';

export default function QuestionStats({ stats }) {
  const { totalAttempts = 0, correct = 0, wrong = 0, doubt = 0 } = stats || {};

  // Calculate percentages
  const correctPercent = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0;
  const wrongPercent = totalAttempts > 0 ? Math.round((wrong / totalAttempts) * 100) : 0;
  const doubtPercent = totalAttempts > 0 ? Math.round((doubt / totalAttempts) * 100) : 0;

  if (totalAttempts === 0) {
    return (
      <div className="bg-neutral-indigo/20 rounded-xl p-4 text-center">
        <p className="text-sm text-text-gray">هنوز این سوال را تمرین نکرده‌اید</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-extralight rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-charcoal">آمار عملکرد شما</h3>
        <div className="flex items-center gap-1 text-xs text-text-gray">
          <Target className="w-4 h-4" aria-hidden="true" />
          <span>{totalAttempts} تلاش</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Correct */}
        <div className="flex flex-col items-center gap-2 p-3 bg-emerald-50 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-700">{correct}</p>
            <p className="text-xs text-emerald-600">{correctPercent}% درست</p>
          </div>
        </div>

        {/* Wrong */}
        <div className="flex flex-col items-center gap-2 p-3 bg-rose-50 rounded-lg">
          <XCircle className="w-5 h-5 text-rose-600" aria-hidden="true" />
          <div className="text-center">
            <p className="text-lg font-bold text-rose-700">{wrong}</p>
            <p className="text-xs text-rose-600">{wrongPercent}% غلط</p>
          </div>
        </div>

        {/* Doubt */}
        <div className="flex flex-col items-center gap-2 p-3 bg-amber-50 rounded-lg">
          <HelpCircle className="w-5 h-5 text-amber-600" aria-hidden="true" />
          <div className="text-center">
            <p className="text-lg font-bold text-amber-700">{doubt}</p>
            <p className="text-xs text-amber-600">{doubtPercent}% شک</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-gray">
          <span>نرخ موفقیت</span>
          <span className="font-medium">{correctPercent}%</span>
        </div>
        <div className="h-2 bg-neutral-indigo/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${correctPercent}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

