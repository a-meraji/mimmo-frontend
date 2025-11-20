"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, Lock, CheckCircle2, Circle, BookOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getPackageChapters, getChapterParts, getPartLessons } from '@/utils/learningApi';

/**
 * PackageHierarchy Component
 * Displays the full package structure: Package → Chapters → Parts → Lessons
 * with loading states, progress indicators, and access control
 */
export default function PackageHierarchy({ packageId, completedLessonIds = [], onLessonClick }) {
  const [chapters, setChapters] = useState([]);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [expandedParts, setExpandedParts] = useState(new Set());
  const [chapterParts, setChapterParts] = useState({}); // { chapterId: parts[] }
  const [partLessons, setPartLessons] = useState({}); // { partId: lessons[] }
  const [loading, setLoading] = useState(true);
  const [loadingParts, setLoadingParts] = useState(new Set());
  const [loadingLessons, setLoadingLessons] = useState(new Set());
  const [error, setError] = useState(null);

  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      
      const result = await getPackageChapters(packageId);
      
      if (result.success) {
        setChapters(result.data);
        // Auto-expand first chapter
        if (result.data.length > 0) {
          setExpandedChapters(new Set([result.data[0].id]));
          // Fetch parts for first chapter
          fetchPartsForChapter(result.data[0].id);
        }
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    };

    if (packageId) {
      fetchChapters();
    }
  }, [packageId]);

  // Fetch parts for a chapter
  const fetchPartsForChapter = async (chapterId) => {
    if (chapterParts[chapterId]) return; // Already fetched

    setLoadingParts(prev => new Set([...prev, chapterId]));
    
    const result = await getChapterParts(chapterId);
    
    if (result.success) {
      setChapterParts(prev => ({ ...prev, [chapterId]: result.data }));
      // Auto-expand first part
      if (result.data.length > 0) {
        setExpandedParts(prev => new Set([...prev, result.data[0].id]));
        // Fetch lessons for first part
        fetchLessonsForPart(result.data[0].id);
      }
    }
    
    setLoadingParts(prev => {
      const newSet = new Set(prev);
      newSet.delete(chapterId);
      return newSet;
    });
  };

  // Fetch lessons for a part
  const fetchLessonsForPart = async (partId) => {
    if (partLessons[partId]) return; // Already fetched

    setLoadingLessons(prev => new Set([...prev, partId]));
    
    const result = await getPartLessons(partId);
    
    if (result.success) {
      setPartLessons(prev => ({ ...prev, [partId]: result.data }));
    }
    
    setLoadingLessons(prev => {
      const newSet = new Set(prev);
      newSet.delete(partId);
      return newSet;
    });
  };

  // Toggle chapter expansion
  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
      fetchPartsForChapter(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  // Toggle part expansion
  const togglePart = (partId) => {
    const newExpanded = new Set(expandedParts);
    if (newExpanded.has(partId)) {
      newExpanded.delete(partId);
    } else {
      newExpanded.add(partId);
      fetchLessonsForPart(partId);
    }
    setExpandedParts(newExpanded);
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => completedLessonIds.includes(lessonId);

  // Calculate chapter/part progress
  const calculateProgress = (items, isChapter = false) => {
    if (!items || items.length === 0) return 0;
    
    let completedCount = 0;
    let totalCount = 0;

    items.forEach(item => {
      if (isChapter) {
        // For chapters, count lessons in all parts
        const parts = chapterParts[item.id] || [];
        parts.forEach(part => {
          const lessons = partLessons[part.id] || [];
          totalCount += lessons.length;
          completedCount += lessons.filter(l => isLessonCompleted(l.id)).length;
        });
      } else {
        // For parts, count lessons directly
        const lessons = partLessons[item.id] || [];
        totalCount += lessons.length;
        completedCount += lessons.filter(l => isLessonCompleted(l.id)).length;
      }
    });

    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <p className="text-rose-700">خطا در بارگذاری ساختار دوره</p>
        <p className="text-sm text-rose-600 mt-2">{error}</p>
      </div>
    );
  }

  // Empty state
  if (chapters.length === 0) {
    return (
      <div className="bg-neutral-extralight border border-neutral-light rounded-2xl p-8 text-center">
        <BookOpen className="w-12 h-12 text-neutral-gray mx-auto mb-3" aria-hidden="true" />
        <p className="text-text-gray">این دوره هنوز محتوایی ندارد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chapters.map((chapter, chapterIndex) => {
        const isChapterExpanded = expandedChapters.has(chapter.id);
        const parts = chapterParts[chapter.id] || [];
        const isLoadingParts = loadingParts.has(chapter.id);
        const chapterProgress = calculateProgress([chapter], true);

        return (
          <div key={chapter.id} className="bg-white border border-neutral-extralight rounded-xl overflow-hidden">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-neutral-extralight/50 transition-colors"
            >
              {isChapterExpanded ? (
                <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-5 h-5 text-text-gray flex-shrink-0" aria-hidden="true" />
              )}
              
              <div className="flex-1 text-right">
                <h3 className="text-base font-bold text-text-charcoal">
                  فصل {chapter.numericOrder}: {chapter.title}
                </h3>
                {chapterProgress > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-neutral-indigo/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${chapterProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-primary font-medium">{chapterProgress}%</span>
                  </div>
                )}
              </div>
            </button>

            {/* Chapter Content (Parts) */}
            {isChapterExpanded && (
              <div className="border-t border-neutral-extralight bg-neutral-extralight/30">
                {isLoadingParts ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" aria-hidden="true" />
                  </div>
                ) : parts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-text-gray">
                    این فصل هنوز بخشی ندارد
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {parts.map((part, partIndex) => {
                      const isPartExpanded = expandedParts.has(part.id);
                      const lessons = partLessons[part.id] || [];
                      const isLoadingLessons = loadingLessons.has(part.id);
                      const partProgress = calculateProgress([part], false);

                      return (
                        <div key={part.id} className="bg-white rounded-lg overflow-hidden">
                          {/* Part Header */}
                          <button
                            onClick={() => togglePart(part.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-neutral-extralight/50 transition-colors"
                          >
                            {isPartExpanded ? (
                              <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-text-gray flex-shrink-0" aria-hidden="true" />
                            )}
                            
                            <div className="flex-1 text-right">
                              <h4 className="text-sm font-semibold text-text-charcoal">
                                بخش {part.numericOrder}: {part.title}
                              </h4>
                              {partProgress > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex-1 h-1 bg-neutral-indigo/30 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                      style={{ width: `${partProgress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-emerald-600 font-medium">{partProgress}%</span>
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Part Content (Lessons) */}
                          {isPartExpanded && (
                            <div className="border-t border-neutral-extralight">
                              {isLoadingLessons ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="w-5 h-5 text-primary animate-spin" aria-hidden="true" />
                                </div>
                              ) : lessons.length === 0 ? (
                                <div className="p-3 text-center text-xs text-text-gray">
                                  این بخش هنوز درسی ندارد
                                </div>
                              ) : (
                                <div className="p-2 space-y-1">
                                  {lessons.map((lesson, lessonIndex) => {
                                    const completed = isLessonCompleted(lesson.id);

                                    return (
                                      <Link
                                        key={lesson.id}
                                        href={`/lesson/${lesson.id}/content`}
                                        onClick={(e) => {
                                          if (onLessonClick) {
                                            e.preventDefault();
                                            onLessonClick(lesson.id);
                                          }
                                        }}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                                      >
                                        {completed ? (
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" aria-hidden="true" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-neutral-gray flex-shrink-0" aria-hidden="true" />
                                        )}
                                        
                                        <span className={`text-sm flex-1 ${
                                          completed ? 'text-emerald-700 font-medium' : 'text-text-charcoal group-hover:text-primary'
                                        }`}>
                                          {lesson.numericOrder}. {lesson.title}
                                        </span>

                                        <ChevronLeft className="w-4 h-4 text-neutral-gray group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" aria-hidden="true" />
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

