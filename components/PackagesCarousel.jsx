"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackageCard from "./PackageCard";

export default function PackagesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1); // Default to mobile view for SSR
  const scrollContainerRef = useRef(null);

  // Sample packages data - same structure as store page
  const packages = useMemo(() => [
    {
      id: 1,
      title: "Full Espresso 1",
      subtitle: "پکیج کامل سطح مقدماتی",
      level: "A1",
      price: 2599000,
      originalPrice: 2799000,
      euroPrice: 25,
      badge: "پرفروش",
      image: "/es1.webp",
    },
    {
      id: 2,
      title: "Full Espresso 2",
      subtitle: "پکیج کامل سطح متوسط",
      level: "A2",
      price: 2599000,
      euroPrice: 25,
      badge: "پرفروش",
      image: "/es2.webp",
    },
    {
      id: 3,
      title: "Full Espresso 3",
      subtitle: "پکیج کامل سطح پیشرفته",
      level: "A1",
      price: 3599000,
      originalPrice: 3799000,
      euroPrice: 35,
      originalEuroPrice: 39,
      image: "/es3.webp",
    },
    {
      id:4,
      title: "Espresso 1 (درس‌های 1 تا 5)",
      subtitle: "شروع مسیر یادگیری زبان ایتالیایی",
      level: "A1",
      price: 2599000,
      originalPrice: 2799000,
      euroPrice: 25,
      image: "/es1.webp",
    },
  ], []);

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

    // Set initial value
    updateSlidesPerView();

    // Debounce resize for better performance
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateSlidesPerView, 150);
    };

    // Add resize listener
    window.addEventListener('resize', debouncedResize, { passive: true });
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const totalSlides = useMemo(() => Math.ceil(packages.length / slidesPerView), [packages.length, slidesPerView]);

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

  return (
    <section className="w-full overflow-x-hidden" aria-label="پکیج های آموزشی">
      <div className="container mx-auto px-6 relative" role="region" aria-roledescription="carousel">
        {/* Navigation Buttons - Fixed to Screen Edges */}
        {/* Previous Button - Right Edge */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 border border-neutral-lighter ${
            currentSlide === 0
              ? 'bg-neutral-lighter text-text-light cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-neutral-indigo text-text-charcoal hover:shadow-xl'
          }`}
          aria-label="قبلی"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Next Button - Left Edge */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 shadow-lg transition-all duration-200 border border-neutral-lighter ${
            currentSlide === totalSlides - 1
              ? 'bg-neutral-lighter text-text-light cursor-not-allowed opacity-50'
              : 'bg-white hover:bg-neutral-indigo text-text-charcoal hover:shadow-xl'
          }`}
          aria-label="بعدی"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Carousel Container */}
        <div className="relative">

          {/* Cards Container - Scrollable */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden px-12 scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-6 pb-4">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(30%-25px)]"
                >
                  <PackageCard package={pkg} priority={index < 2} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

