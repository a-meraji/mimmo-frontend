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
      className="sticky top-0 z-50  backdrop-blur-md"
      aria-label="ناوبری درس"
    >
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between py-4 max-w-4xl mx-auto">
          {/* Dashed connecting line */}
          <div 
            className="absolute top-9 left-0 right-0 h-[2px] border-t-2 border-dashed border-neutral-darker"
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
                className={`relative flex flex-col gap-2 flex-1 group ${index==0?"items-start":index==2?"items-end":"items-center"}`}
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

              
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

