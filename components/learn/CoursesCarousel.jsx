"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Sprout } from "lucide-react";
import CourseCard from "./CourseCard";

export default function CoursesCarousel({ courses = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const scrollContainerRef = useRef(null);

  // Default courses if none provided
  const displayCourses = useMemo(() => {
    if (courses.length > 0) return courses;
    
    // Sample default courses - matching package structure
    return [
      {
        id: "espresso-1",
        learnPath: "espresso-1",
        title: "اسپرسو ۱ (دروس ۱ تا ۵)",
        subtitle: "سطح مقدماتی A1",
        level: "A1",
        image: "/es1.webp",
      },
      {
        id: "espresso-2",
        learnPath: "espresso-2",
        title: "اسپرسو ۲ (دروس ۶ تا ۱۰)",
        subtitle: "سطح متوسط A2",
        level: "A2",
        image: "/es2.webp",
      },
      {
        id: "driving-license",
        learnPath: "driving-license",
        title: "دوره قبولی گواهینامه ایتالیا",
        subtitle: "پکیج کامل آزمون تئوری",
        level: "B1",
        image: "/es3.webp",
      },
    ];
  }, [courses]);

  // Update slides per view on mount and window resize
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(3); // lg: 3 cards
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(2); // sm: 2 cards
      } else {
        setSlidesPerView(1); // mobile: 1 card
      }
    };

    updateSlidesPerView();

    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSlidesPerView, 150);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const totalSlides = useMemo(() => 
    Math.ceil(displayCourses.length / slidesPerView), 
    [displayCourses.length, slidesPerView]
  );

  const scrollToPosition = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      
      if (direction === 'next') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      scrollToPosition('next');
      setCurrentSlide((prev) => prev + 1);
    }
  }, [currentSlide, totalSlides, scrollToPosition]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      scrollToPosition('prev');
      setCurrentSlide((prev) => prev - 1);
    }
  }, [currentSlide, scrollToPosition]);

  const goToSlide = useCallback((index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * index * 0.8;
      container.scrollTo({ left: -scrollAmount, behavior: 'smooth' });
    }
    setCurrentSlide(index);
  }, []);

  if (displayCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <Sprout className="w-40 h-40 text-neutral-gray" />
        {/* Text Content */}
        <div className="mt-8 text-center space-y-2">
          <h3 className="text-xl font-bold text-text-charcoal">
            هنوز دوره‌ای ندارید
          </h3>
          <p className="text-sm text-text-gray max-w-sm">
            با خرید دوره‌های آموزشی، سفر یادگیری خود را شروع کنید
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.location.href = '/store'}
          className="mt-8 px-8 py-3 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-200"
        >
          مشاهده دوره‌ها
        </button>
      </div>
    );
  }

  return (
    <section className="w-full overflow-x-hidden" aria-label="دوره‌های من">
      <div className="container  px-6 relative" role="region" aria-roledescription="carousel">
        {/* Navigation Buttons */}
        {displayCourses.length > slidesPerView && (
          <>
            {/* Previous Button - Right Edge */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg 
                transition-all duration-200 border border-neutral-lighter ${
                currentSlide === 0
                  ? 'bg-neutral-lighter text-text-light cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-neutral-indigo text-text-charcoal hover:shadow-xl'
              }`}
              aria-label="قبلی"
              type="button"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Next Button - Left Edge */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg 
                transition-all duration-200 border border-neutral-lighter ${
                currentSlide === totalSlides - 1
                  ? 'bg-neutral-lighter text-text-light cursor-not-allowed opacity-50'
                  : 'bg-white hover:bg-neutral-indigo text-text-charcoal hover:shadow-xl'
              }`}
              aria-label="بعدی"
              type="button"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Cards Container - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden px-12 scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-6 pb-4 ">
              {displayCourses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(30%-25px)]"
                >
                  <CourseCard course={course} priority={index < 2} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-neutral-gray hover:bg-neutral-darker"
                  }`}
                  aria-label={`اسلاید ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

