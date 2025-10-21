"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackageCard from "./PackageCard";

export default function PackagesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1); // Default to mobile view for SSR
  const scrollContainerRef = useRef(null);

  // Sample packages data
  const packages = [
    {
      id: 1,
      name: "پکیج 1",
      description: "منبع : درس اول کتاب اسپرسو 1",
      image: "/es1.webp",
      originalPrice: 990000,
      discountedPrice: 500000,
    },
    {
      id: 2,
      name: "پکیج جامع مقدماتی",
      description: "ویدیو آموزشی + درسنامه + تمرین انتهای درسنامه + آزمون",
      image: "/es2.webp",
      originalPrice: 1500000,
      discountedPrice: null,
    },
    {
      id: 3,
      name: "پکیج پیشرفته ایتالیایی",
      description: "دوره کامل با پشتیبانی 24 ساعته و گواهینامه معتبر",
      image: "/es1.webp",
      originalPrice: 2500000,
      discountedPrice: 1800000,
    },
    {
      id: 4,
      name: "پکیج مکالمه محور",
      description: "تمرکز بر مکالمه روزمره و تلفظ صحیح با اساتید بومی",
      image: "/es2.webp",
      originalPrice: 1200000,
      discountedPrice: null,
    },
  ];

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

    // Add resize listener
    window.addEventListener('resize', updateSlidesPerView);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const totalSlides = Math.ceil(packages.length / slidesPerView);

  const scrollToPosition = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * 0.8;
      
      if (direction === 'next') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      scrollToPosition('next');
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      scrollToPosition('prev');
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth * index * 0.8;
      container.scrollTo({ left: -scrollAmount, behavior: 'smooth' });
    }
    setCurrentSlide(index);
  };

  return (
    <section className="w-full  overflow-x-hidden">
      <div className="container mx-auto px-6 relative">
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
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(30%-25px)]"
                >
                  <PackageCard package={pkg} />
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

