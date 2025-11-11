"use client";

import Link from 'next/link';
import { MapPin } from 'lucide-react';

/**
 * LessonNavTabs - Sticky navigation tabs for lesson pages
 * Matches the design with map pin icon, dashed line, and active indicator
 */
export default function LessonNavTabs({ lessonId, activeTab }) {
  const tabs = [
    { id: 'content', label: 'درسنامه', href: `/lesson/${lessonId}/content` },
    { id: 'practice', label: 'تمرین', href: `/lesson/${lessonId}/practice` },
    { id: 'test', label: 'آزمون', href: `/lesson/${lessonId}/test` },
  ];

  return (
    <nav 
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-extralight"
      aria-label="ناوبری درس"
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between py-4">
          {/* Dashed connecting line */}
          <div 
            className="absolute top-[22px] left-0 right-0 h-[2px] border-t-2 border-dashed border-neutral-extralight/60"
            aria-hidden="true"
            style={{ zIndex: 0 }}
          />

          {/* Tabs */}
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="relative flex flex-col items-center gap-2 flex-1 group"
                style={{ zIndex: 1 }}
              >
                {/* Icon/Indicator Circle */}
                <div className="relative">
                  {isActive ? (
                    // Active state: Blue circle with map pin
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md transition-all duration-200">
                      <MapPin className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                  ) : (
                    // Inactive state: Gray circle
                    <div className="w-10 h-10 rounded-full bg-neutral-indigo border-2 border-neutral-extralight group-hover:border-primary/30 transition-all duration-200" />
                  )}
                </div>

                {/* Label */}
                <span 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-text-gray group-hover:text-primary'
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active indicator dot (optional, for extra emphasis) */}
                {isActive && (
                  <div 
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

