"use client";

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Clock } from 'lucide-react';
import { getLessonById } from '@/utils/lessonData';
import ContentRenderer from '@/components/lesson/ContentRenderer';
import WordModal from '@/components/lesson/WordModal';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';

export default function LessonContentPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const [selectedWord, setSelectedWord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get lesson data
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  // Handle word click
  const handleWordClick = (word) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWord(null), 200);
  };

  // Handle 404
  if (!lesson) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-black text-text-charcoal mb-4">درس یافت نشد</h1>
          <p className="text-text-gray mb-8">درس مورد نظر شما وجود ندارد یا حذف شده است.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            بازگشت
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow">
      {/* Sticky Navigation Tabs */}
      <LessonNavTabs lessonId={lessonId} activeTab="content" />

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-4 lg:py-8">
        {/* Back Button (Mobile) / Breadcrumb (Desktop) */}
        <div className="mb-4 lg:mb-6">
          {/* Mobile: Back button only */}
          <button
            onClick={() => router.back()}
            className="lg:hidden inline-flex items-center gap-2 text-text-gray hover:text-primary transition-colors p-2 -ml-2"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            <span className="text-sm font-medium">بازگشت</span>
          </button>

          {/* Desktop: Compact breadcrumb */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs text-text-gray" aria-label="مسیر صفحه">
            <Link href="/learn" className="hover:text-primary transition-colors">
              یادگیری
            </Link>
            <ArrowRight className="w-3 h-3 text-text-light" aria-hidden="true" />
            <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
              دوره
            </Link>
            <ArrowRight className="w-3 h-3 text-text-light" aria-hidden="true" />
            <span className="text-text-charcoal font-medium">{lesson.title}</span>
          </nav>
        </div>

        {/* Lesson Header - Compact */}
        <header className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl shadow-lg overflow-hidden mb-6 lg:mb-8">
          {/* Mobile: Collapsed (no image) */}
          <div className="lg:hidden p-4 space-y-3">
            <h1 className="text-xl font-black text-text-charcoal">
              {lesson.title}
            </h1>
            
            <div className="flex items-center gap-4 flex-wrap">
              {/* Duration Badge */}
              <div className="inline-flex items-center gap-1.5 bg-neutral-indigo/50 px-3 py-1.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-text-gray" aria-hidden="true" />
                <span className="text-xs font-medium text-text-gray">{lesson.duration}</span>
              </div>

              {/* Vocabulary Count */}
              {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="text-xs font-medium">{lesson.vocabulary.length} واژه کلیدی</span>
                </div>
              )}
            </div>
          </div>

          {/* Desktop: Compact with image */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-0">
            {/* Lesson Image */}
            <div className="lg:col-span-2 relative min-h-[200px] bg-neutral-indigo/10">
              <Image
                src={lesson.image}
                alt={lesson.title}
                fill
                className="object-contain p-4"
                priority
              />
            </div>

            {/* Lesson Info */}
            <div className="lg:col-span-3 p-4 lg:p-6 flex flex-col justify-center space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-xs text-text-gray">محتوای درس</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-text-charcoal">
                {lesson.title}
              </h1>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="inline-flex items-center gap-1.5 bg-neutral-indigo/50 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-text-gray" aria-hidden="true" />
                  <span className="text-xs font-medium text-text-gray">{lesson.duration}</span>
                </div>

                {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                  <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="text-xs font-medium">{lesson.vocabulary.length} واژه کلیدی</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Section - Enhanced for readability */}
        <section className="bg-white border border-neutral-extralight rounded-2xl p-4 lg:p-8 shadow-sm">
          <div className="mb-4 lg:mb-6">
            <h2 className="text-lg lg:text-xl font-bold text-text-charcoal mb-2">محتوای درس</h2>
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <p className="text-sm text-text-gray">
                کلمات <span className="font-bold text-primary">پررنگ</span> را کلیک کنید تا تعریف آن‌ها را مشاهده کنید.
              </p>
            )}
          </div>

          {/* Rendered Content - Larger text for better readability */}
          <div className="prose-content">
            <ContentRenderer
              content={lesson.content}
              vocabulary={lesson.vocabulary}
              onWordClick={handleWordClick}
            />
          </div>
        </section>

        {/* Vocabulary List - Optimized touch targets */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <section className="mt-6 lg:mt-8 bg-white border border-neutral-extralight rounded-2xl p-4 lg:p-8 shadow-sm">
            <h2 className="text-lg lg:text-xl font-bold text-text-charcoal mb-4 lg:mb-6">واژگان کلیدی</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {lesson.vocabulary.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  className="flex items-center gap-3 p-4 bg-neutral-indigo/20 rounded-xl hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all duration-200 text-right min-h-[60px]"
                  type="button"
                >
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-lg font-bold text-primary">
                      {word.word.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-charcoal text-sm truncate">
                      {word.word}
                    </p>
                    <p className="text-xs text-text-gray truncate">
                      {word.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Word Modal */}
      <WordModal
        word={selectedWord}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
}

