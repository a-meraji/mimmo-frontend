"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  NotebookText,
  Lock,
  CheckCircle2,
  Clock3,
  Circle,
} from "lucide-react";

const PROGRESS_STYLES = {
  completed: {
    label: "تکمیل شده",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    badge: "bg-emerald-500/10 text-emerald-600",
    iconWrap: "bg-emerald-500/10 border border-emerald-500/20",
    iconColor: "text-emerald-600",
  },
  "in-progress": {
    label: "در حال یادگیری",
    text: "text-amber-600",
    dot: "bg-amber-500",
    icon: Clock3,
    badge: "bg-amber-500/10 text-amber-600",
    iconWrap: "bg-amber-500/10 border border-amber-500/20",
    iconColor: "text-amber-600",
  },
  locked: {
    label: "شروع نشده",
    text: "text-text-light",
    dot: "bg-neutral-300",
    icon: Lock,
    badge: "bg-neutral-indigo text-text-gray",
    iconWrap: "bg-neutral-indigo/40 border border-neutral-extralight",
    iconColor: "text-text-light",
  },
};

const resolveStatus = (status, fallbacks = {}) => {
  if (!status && fallbacks) {
    const { isCompleted, hasProgress } = fallbacks;
    if (isCompleted) return "completed";
    if (hasProgress) return "in-progress";
  }

  if (!status) return "locked";

  const normalized = typeof status === "string" ? status.toLowerCase() : status;

  if (["done", "completed", "finish", "finished", true].includes(normalized)) {
    return "completed";
  }

  if (["progress", "in-progress", "ongoing", "active", "current"].includes(normalized)) {
    return "in-progress";
  }

  if (["not-started", "pending", false].includes(normalized)) {
    return "locked";
  }

  return "locked";
};

const getStatusStyles = (statusKey) => PROGRESS_STYLES[statusKey] || PROGRESS_STYLES.locked;

export default function CourseChapters({ seasons = [], showProgress = false }) {
  const [activeSeason, setActiveSeason] = useState(0);
  const [openChapters, setOpenChapters] = useState([0]); // First chapter open by default
  const scrollRef = useRef(null);

  const seasonsWithMeta = useMemo(
    () =>
      seasons.map((season) => {
        if (!showProgress) return { ...season };

        const statusKey = resolveStatus(season.status, {
          isCompleted: season.isCompleted,
          hasProgress: season.completedLessons > 0,
        });

        return {
          ...season,
          __status: statusKey,
          __styles: getStatusStyles(statusKey),
        };
      }),
    [seasons, showProgress]
  );

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

  const currentSeason = seasonsWithMeta[activeSeason] || { chapters: [] };

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
          {seasonsWithMeta.map((season, index) => {
            const isActive = activeSeason === index;
            const statusStyles = showProgress ? season.__styles : null;
            const StatusIcon = statusStyles?.icon || Circle;

            return (
              <button
                key={index}
                onClick={() => setActiveSeason(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-neutral-indigo text-text-gray hover:bg-neutral-indigo/70'
                }`}
                type="button"
              >
                <span>{season.title}</span>
                {showProgress && (
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${statusStyles.dot}`}
                  >
                    <StatusIcon className={`w-3 h-3 ${statusStyles.iconColor || 'text-white'}`} aria-hidden="true" />
                  </span>
                )}
              </button>
            );
          })}
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
          const statusKey = showProgress
            ? resolveStatus(chapter.status, {
                isCompleted: chapter.isCompleted,
                hasProgress: chapter.completedLessons > 0,
              })
            : null;
          const statusStyles = showProgress ? getStatusStyles(statusKey) : null;
          const StatusIcon = statusStyles?.icon || Circle;

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
                {showProgress && (
                  <span className={`flex items-center gap-2 text-xs font-medium ${statusStyles.text}`}>
                    <StatusIcon className="w-4 h-4" aria-hidden="true" />
                    {statusStyles.label}
                  </span>
                )}
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-text-gray flex-shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-gray flex-shrink-0" aria-hidden="true" />
                )}
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="border-t border-neutral-extralight bg-neutral-indigo/10">
                  {chapter.lessons?.map((lesson, lessonIndex) => {
                    const lessonStatusKey = showProgress
                      ? resolveStatus(lesson.status, {
                          isCompleted: lesson.isCompleted,
                          hasProgress: lesson.progress > 0,
                        })
                      : null;
                    const lessonStyles = showProgress ? getStatusStyles(lessonStatusKey) : null;
                    const LessonStatusIcon = lessonStyles?.icon || NotebookText;

                    const lessonLink = lesson.id ? `/lesson/${lesson.id}/content` : null;
                    const LessonWrapper = lessonLink ? Link : 'div';
                    const wrapperProps = lessonLink ? { href: lessonLink } : {};

                    return (
                      <LessonWrapper
                        key={lessonIndex}
                        {...wrapperProps}
                        className={`flex items-center justify-between px-4 py-3 transition-colors border-b border-neutral-extralight/50 last:border-0 ${
                          lessonLink ? 'hover:bg-primary/5 cursor-pointer' : 'hover:bg-white/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {showProgress ? (
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${lessonStyles.iconWrap}`}>
                              <LessonStatusIcon className={`w-4 h-4 ${lessonStyles.iconColor}`} aria-hidden="true" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-neutral-indigo/30 p-1 flex items-center justify-center flex-shrink-0">
                              {lesson.isFree ? (
                                <NotebookText className="w-4 h-4 text-primary" aria-hidden="true" />
                              ) : (
                                <Lock className="w-4 h-4 text-text-light" aria-hidden="true" />
                              )}
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs ${lessonLink ? 'text-text-charcoal font-medium' : 'text-text-charcoal'}`}>
                              {lesson.title}
                            </span>
                            {showProgress && (
                              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${lessonStyles.text}`}>
                                <LessonStatusIcon className="w-3 h-3" aria-hidden="true" />
                                {lessonStyles.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-text-light flex-shrink-0">{lesson.duration}</span>
                      </LessonWrapper>
                    );
                  })}
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

