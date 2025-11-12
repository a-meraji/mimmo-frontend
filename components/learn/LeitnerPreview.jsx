"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookMarked, ArrowLeft, Flame, Package, TrendingUp, BookMarkedIcon } from 'lucide-react';
import { getStatistics, BOX_COLORS } from '@/utils/leitnerStorage';

export default function LeitnerPreview() {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const loadStats = () => {
      const stats = getStatistics();
      setStatistics(stats);
    };

    loadStats();

    // Listen for storage updates
    const handleStorageChange = () => {
      loadStats();
    };

    window.addEventListener('leitnerUpdate', handleStorageChange);
    return () => window.removeEventListener('leitnerUpdate', handleStorageChange);
  }, []);

  if (!statistics) {
    return null;
  }

  // Show empty state if no cards
  if (statistics.total === 0) {
    return (
      <section className="mb-12">
        <div className="bg-gradient-to-br from-primary/5 via-white to-secondary-accent/5 border-2 border-primary/20 rounded-3xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookMarked className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold text-text-charcoal mb-3">
            سیستم لایتنر
          </h3>
          <p className="text-text-gray mb-6 max-w-md mx-auto">
            با سیستم لایتنر، کلمات و جملات مهم را به صورت هوشمند مرور کنید
          </p>
          <Link
            href="/learn/leitner"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          >
            شروع با لایتنر
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    );
  }

  // Modern, sleek box colors (softer palette)
  const modernBoxColors = {
    1: { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-50' },
    2: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-50' },
    3: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-50' },
    4: { bg: 'bg-lime-100', border: 'border-lime-200', text: 'text-lime-700', accent: 'bg-lime-50' },
    5: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-50' },
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl lg:text-3xl font-black text-text-charcoal text-center mb-8">
        سیستم لایتنر
      </h2>

      <Link
        href="/learn/leitner"
        className="block group"
      >
        <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Header - Compact */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <BookMarked className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">فلش‌کارت‌های من</h3>
                  <p className="text-xs text-white/90">مرور هوشمند با لایتنر</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 group-hover:translate-x-[-4px] transition-transform" aria-hidden="true" />
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Cards */}
              <div className=" backdrop-blur-sm border border-neutral-extralight rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm text-text-gray">مجموع</span>
                </div>
                <div className="text-xl font-bold text-text-charcoal">
                  {statistics.total}
                </div>
              </div>

              {/* Cards Due */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-300/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-amber-600" aria-hidden="true" />
                  <span className="text-sm text-text-gray">آماده مرور</span>
                </div>
                <div className="text-xl font-bold text-amber-600">
                  {statistics.cardsDue}
                </div>
              </div>

              {/* Success Rate */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-300/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                  <span className="text-sm text-text-gray">نرخ موفقیت</span>
                </div>
                <div className="text-xl font-bold text-emerald-600">
                  {statistics.successRate}%
                </div>
              </div>

              {/* Total Reviews */}
              <div className="bg-gradient-to-bl from-primary/10 to-primary/40 backdrop-blur-sm border border-neutral-extralight rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookMarkedIcon className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm text-text-gray">مجموع مرورها</span>
                </div>
                <div className="text-xl font-bold text-text-charcoal">
                  {statistics.totalReviews}
                </div>
              </div>
            </div>

            {/* Box Distribution - Modern & Sleek */}
            <div>
              <h4 className="text-xs font-semibold text-text-charcoal mb-3">توزیع جعبه‌ها</h4>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((box) => {
                  const colors = modernBoxColors[box];
                  const count = statistics.boxDistribution[box] || 0;
                  
                  return (
                    <div 
                      key={box} 
                      className={`relative border-2 ${colors.border} ${colors.bg} rounded-lg p-2.5 transition-all duration-200 hover:shadow-md ${
                        count > 0 ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${colors.text} mb-1`}>
                          {count}
                        </div>
                        <div className="text-[10px] font-medium text-text-gray">
                          جعبه {box}
                        </div>
                      </div>
                      {/* Subtle accent indicator */}
                      {count > 0 && (
                        <div className={`absolute top-1 left-1 right-1 h-0.5 ${colors.accent} rounded-full`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Call to Action - Compact */}
            {statistics.cardsDue > 0 && (
              <div className="mt-4 bg-gradient-to-r from-primary/5 to-secondary-accent/5 rounded-lg p-3 border border-primary/10">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  <p className="text-xs font-medium text-text-charcoal">
                    {statistics.cardsDue} کارت آماده مرور است
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}

