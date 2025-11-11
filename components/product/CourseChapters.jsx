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
    <div className="bg-white rounded-2xl border border-neutral-extralight p-4 sm:p-6 space-y-6 overflow-hidden">
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
          className="flex gap-2 overflow-x-auto scrollbar-hide px-8 sm:px-10 py-1"
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
                    : 'bg-white border border-neutral-extralight text-text-gray hover:border-primary/30 hover:bg-neutral-indigo/30'
                }`}
                type="button"
              >
                <span className={`${isActive ? 'text-white' : 'text-text-charcoal'}`}>
                  {season.title}
                </span>
                {showProgress && (
                  <StatusIcon className={`w-4 h-4 ${isActive ? 'text-white' : statusStyles.iconColor}`} aria-hidden="true" />
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

          const chapterCompletionPercent = showProgress && chapter.lessons?.length
            ? Math.round(((chapter.completedLessons || 0) / chapter.lessons.length) * 100)
            : 0;

          return (
            <div key={chapterIndex} className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              statusKey === 'completed' 
                ? 'border-emerald-500/30 bg-emerald-50/30' 
                : statusKey === 'in-progress'
                ? 'border-amber-500/30 bg-amber-50/30'
                : 'border-neutral-extralight bg-white'
            }`}>
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapterIndex)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-all duration-200 text-right group"
                type="button"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    statusKey === 'completed'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md'
                      : statusKey === 'in-progress'
                      ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md'
                      : 'bg-neutral-indigo text-text-gray group-hover:bg-neutral-indigo/70'
                  }`}>
                    {statusKey === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <span className="text-xs font-bold">{chapterIndex + 1}</span>
                    )}
                  </div>
                  <div className="text-right flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-charcoal mb-1 truncate">{chapter.title}</h4>
                    <div className="flex items-center gap-2">
                      {showProgress && (
                        <>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles.badge}`}>
                            <StatusIcon className="w-3 h-3" aria-hidden="true" />
                            {statusStyles.label}
                          </span>
                          <span className="text-[11px] text-text-light">
                            {chapter.completedLessons || 0}/{chapter.lessons?.length} درس
                          </span>
                        </>
                      )}
                      {!showProgress && (
                        <p className="text-xs text-text-light">{chapter.lessons?.length} درس</p>
                      )}
                    </div>
                    {showProgress && chapter.lessons?.length > 0 && (
                      <div className="mt-2 w-full max-w-[200px]">
                        <div className="w-full h-1 rounded-full bg-neutral-indigo overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              statusKey === 'completed' 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                                : statusKey === 'in-progress'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                                : 'bg-neutral-gray'
                            }`}
                            style={{ width: `${chapterCompletionPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {showProgress && (
                    <span className={`text-sm font-bold ${
                      statusKey === 'completed' 
                        ? 'text-emerald-600' 
                        : statusKey === 'in-progress'
                        ? 'text-amber-600'
                        : 'text-text-light'
                    }`}>
                      {chapterCompletionPercent}%
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-text-gray group-hover:text-primary transition-colors flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-gray group-hover:text-primary transition-colors flex-shrink-0" aria-hidden="true" />
                  )}
                </div>
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className={`border-t transition-all duration-300 ${
                  statusKey === 'completed' 
                    ? 'border-emerald-500/20 bg-gradient-to-b from-emerald-50/30 to-white' 
                    : statusKey === 'in-progress'
                    ? 'border-amber-500/20 bg-gradient-to-b from-amber-50/30 to-white'
                    : 'border-neutral-extralight bg-gradient-to-b from-neutral-indigo/10 to-white'
                }`}>
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
                        className={`group flex items-center justify-between px-4 py-3 transition-all duration-200 border-b border-neutral-extralight/50 last:border-0 relative ${
                          lessonLink ? 'hover:bg-white cursor-pointer hover:shadow-sm' : 'hover:bg-white/50'
                        } ${
                          lessonStatusKey === 'completed' ? 'bg-emerald-50/20' : 
                          lessonStatusKey === 'in-progress' ? 'bg-amber-50/20' : 
                          'bg-transparent'
                        }`}
                      >
                        {/* Status indicator bar on right */}
                        {showProgress && (
                          <div className={`absolute right-0 top-0 bottom-0 w-1 transition-all duration-200 ${
                            lessonStatusKey === 'completed' ? 'bg-emerald-500' :
                            lessonStatusKey === 'in-progress' ? 'bg-amber-500' :
                            'bg-transparent'
                          }`} />
                        )}
                        
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {showProgress ? (
                            <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              lessonStatusKey === 'completed'
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm'
                                : lessonStatusKey === 'in-progress'
                                ? 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm'
                                : lessonStyles.iconWrap
                            }`}>
                              <LessonStatusIcon className={`w-4 h-4 ${
                                lessonStatusKey === 'completed' || lessonStatusKey === 'in-progress' 
                                  ? 'text-white' 
                                  : lessonStyles.iconColor
                              }`} aria-hidden="true" />
                              {lessonStatusKey === 'completed' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              lesson.isFree 
                                ? 'bg-primary/10 group-hover:bg-primary/20' 
                                : 'bg-neutral-indigo/30 group-hover:bg-neutral-indigo/50'
                            }`}>
                              {lesson.isFree ? (
                                <NotebookText className="w-4 h-4 text-primary" aria-hidden="true" />
                              ) : (
                                <Lock className="w-4 h-4 text-text-light" aria-hidden="true" />
                              )}
                            </div>
                          )}
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <span className={`text-xs truncate ${
                              lessonLink ? 'text-text-charcoal font-medium group-hover:text-primary' : 'text-text-charcoal'
                            } ${lessonStatusKey === 'locked' ? 'opacity-60' : ''}`}>
                              {lesson.title}
                            </span>
                            {showProgress && (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md w-fit ${
                                lessonStatusKey === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                                lessonStatusKey === 'in-progress' ? 'bg-amber-500/10 text-amber-600' :
                                'bg-neutral-indigo/30 text-text-light'
                              }`}>
                                <LessonStatusIcon className="w-3 h-3" aria-hidden="true" />
                                {lessonStyles.label}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-text-light font-medium">{lesson.duration}</span>
                          {lessonLink && (
                            <ChevronLeft className="w-4 h-4 text-text-light group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" aria-hidden="true" />
                          )}
                        </div>
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

