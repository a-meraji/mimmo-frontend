"use client";

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { getLessonById } from '@/utils/lessonData';
import ContentRenderer from '@/components/lesson/ContentRenderer';
import WordModal from '@/components/lesson/WordModal';

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
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-8" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <Link href={`/learn/${lesson.courseId}`} className="hover:text-primary transition-colors">
            دوره
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">{lesson.title}</span>
        </nav>

        {/* Lesson Header */}
        <header className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Lesson Image */}
            <div className="lg:col-span-2 relative min-h-[200px] lg:min-h-[300px] bg-neutral-indigo/10">
              <Image
                src={lesson.image}
                alt={lesson.title}
                fill
                className="object-contain p-6"
                priority
              />
            </div>

            {/* Lesson Info */}
            <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-text-gray">محتوای درس</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-text-charcoal mb-2">
                {lesson.title}
              </h1>
              <p className="text-sm text-text-gray mb-6">
                مدت زمان: {lesson.duration}
              </p>

              {/* Vocabulary Count */}
              {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {lesson.vocabulary.length} واژه کلیدی در این درس
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide">
          <Link
            href={`/lesson/${lessonId}/content`}
            className="flex-shrink-0 px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-md"
          >
            محتوا
          </Link>
          <Link
            href={`/lesson/${lessonId}/practice`}
            className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
          >
            تمرین
          </Link>
          <Link
            href={`/lesson/${lessonId}/test`}
            className="flex-shrink-0 px-6 py-3 bg-white text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
          >
            آزمون
          </Link>
        </div>

        {/* Content Section */}
        <section className="bg-white border border-neutral-extralight rounded-2xl p-6 lg:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text-charcoal mb-2">محتوای درس</h2>
            {lesson.vocabulary && lesson.vocabulary.length > 0 && (
              <p className="text-sm text-text-gray">
                کلمات <span className="font-bold text-primary">پررنگ</span> را کلیک کنید تا تعریف آن‌ها را مشاهده کنید.
              </p>
            )}
          </div>

          {/* Rendered Content */}
          <ContentRenderer
            content={lesson.content}
            vocabulary={lesson.vocabulary}
            onWordClick={handleWordClick}
          />
        </section>

        {/* Vocabulary List */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <section className="mt-8 bg-white border border-neutral-extralight rounded-2xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-text-charcoal mb-6">واژگان کلیدی</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {lesson.vocabulary.map((word) => (
                <button
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  className="flex items-center gap-3 p-4 bg-neutral-indigo/20 rounded-xl hover:bg-primary/10 hover:border-primary/20 border border-transparent transition-all duration-200 text-right"
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

