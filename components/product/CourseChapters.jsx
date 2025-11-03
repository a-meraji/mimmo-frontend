"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, NotebookText, Lock } from "lucide-react";

export default function CourseChapters({ seasons = [] }) {
  const [activeSeason, setActiveSeason] = useState(0);
  const [openChapters, setOpenChapters] = useState([0]); // First chapter open by default
  const scrollRef = useRef(null);

  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  const toggleChapter = useCallback((chapterIndex) => {
    setOpenChapters(prev => 
      prev.includes(chapterIndex)
        ? prev.filter(i => i !== chapterIndex)
        : [...prev, chapterIndex]
    );
  }, []);

  const currentSeason = seasons[activeSeason] || { chapters: [] };

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-charcoal">سرفصل‌های دوره</h2>
        <span className="text-xs text-text-light">
          {seasons.length} فصل
        </span>
      </div>

      {/* Seasons Slider */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-neutral-extralight rounded-lg flex items-center justify-center hover:bg-neutral-indigo transition-colors shadow-md"
          aria-label="اسکرول به راست"
          type="button"
        >
          <ChevronRight className="w-4 h-4 text-text-gray" aria-hidden="true" />
        </button>

        {/* Seasons */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-10 py-1"
        >
          {seasons.map((season, index) => (
            <button
              key={index}
              onClick={() => setActiveSeason(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeSeason === index
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-neutral-indigo text-text-gray hover:bg-neutral-indigo/70'
              }`}
              type="button"
            >
              {season.title}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-neutral-extralight rounded-lg flex items-center justify-center hover:bg-neutral-indigo transition-colors shadow-md"
          aria-label="اسکرول به چپ"
          type="button"
        >
          <ChevronLeft className="w-4 h-4 text-text-gray" aria-hidden="true" />
        </button>
      </div>

      {/* Chapters List */}
      <div className="space-y-2">
        {currentSeason.chapters?.map((chapter, chapterIndex) => {
          const isOpen = openChapters.includes(chapterIndex);
          return (
            <div key={chapterIndex} className="border border-neutral-extralight rounded-xl overflow-hidden">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapterIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-indigo/30 transition-colors text-right"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{chapterIndex + 1}</span>
                  </div>
                  <div className="text-right">
                    <h4 className="text-sm font-semibold text-text-charcoal">{chapter.title}</h4>
                    <p className="text-xs text-text-light">{chapter.lessons?.length} درس</p>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-text-gray flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-gray flex-shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="border-t border-neutral-extralight bg-neutral-indigo/10">
                  {chapter.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lessonIndex}
                      className="flex items-center justify-between px-4 py-3 hover:bg-white/50 transition-colors border-b border-neutral-extralight/50 last:border-0"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-6 h-6 rounded-full bg-neutral-indigo/30 p-1 flex items-center justify-center flex-shrink-0">
                          {lesson.isFree ? (
                            <NotebookText className="w-4 h-4 text-primary" aria-hidden="true" />
                          ) : (
                            <Lock className="w-4 h-4 text-text-light" aria-hidden="true" />
                          )}
                        </div>
                        <span className="text-xs text-text-charcoal">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-text-light flex-shrink-0">{lesson.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-extralight">
        <span className="text-xs text-text-gray">مجموع زمان دوره</span>
        <span className="text-sm font-bold text-primary">
          {currentSeason.totalDuration || '۲۴ ساعت'}
        </span>
      </div>
    </div>
  );
}

