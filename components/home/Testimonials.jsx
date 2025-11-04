"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Star } from "lucide-react";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "سارا احمدی",
      role: "دانشجو",
      avatar: "/license1.webp",
      rating: 5,
      review:
        "دوره‌های میمو واقعاً عالی هستند! با روش‌های نوین و جذاب، یادگیری زبان ایتالیایی خیلی راحت‌تر شده. استادها حرفه‌ای هستند و همیشه آماده کمک.",
    },
    {
      id: 2,
      name: "علی کریمی",
      role: "مهندس نرم‌افزار",
      avatar: "/license2.webp",
      rating: 5,
      review:
        "من با استفاده از پلتفرم میمو، در عرض ۶ ماه توانستم گواهینامه B1 را بگیرم. پشتیبانی عالی و محتوای باکیفیت. واقعاً پیشنهاد می‌کنم.",
    },
    {
      id: 3,
      name: "سارا احمدی",
      role: "دانشجو",
      avatar: "/license1.webp",
      rating: 5,
      review:
        "دوره‌های میمو واقعاً عالی هستند! با روش‌های نوین و جذاب، یادگیری زبان ایتالیایی خیلی راحت‌تر شده. استادها حرفه‌ای هستند و همیشه آماده کمک.",
    },
    {
      id: 4,
      name: "مریم حسینی",
      role: "معلم",
      avatar: "/license3.webp",
      rating: 4,
      review:
        "پلتفرم بسیار کاربرپسند و دوره‌ها خیلی منظم و ساختار یافته هستند. تمرین‌های تعاملی به من کمک زیادی کرد. ممنون از تیم میمو!",
    },
    {
      id: 5,
      name: "رضا محمدی",
      role: "کارآفرین",
      avatar: "/license0.webp",
      rating: 5,
      review:
        "بهترین انتخاب برای یادگیری زبان ایتالیایی! محتوای غنی، استادهای با تجربه و امکان تمرین در هر زمان و مکان. عالی!",
    },
    {
      id: 6,
      name: "رضا محمدی",
      role: "کارآفرین",
      avatar: "/license0.webp",
      rating: 5,
      review:
        "بهترین انتخاب برای یادگیری زبان ایتالیایی! محتوای غنی، استادهای با تجربه و امکان تمرین در هر زمان و مکان. عالی!",
    },
    {
      id: 7,
      name: "رضا محمدی",
      role: "کارآفرین",
      avatar: "/license0.webp",
      rating: 5,
      review:
        "بهترین انتخاب برای یادگیری زبان ایتالیایی! محتوای غنی، استادهای با تجربه و امکان تمرین در هر زمان و مکان. عالی!",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 4000); // Change every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, testimonials.length]);

  // Calculate position for each card relative to current index - memoized
  const getCardPosition = useCallback((index) => {
    const diff = index - currentIndex;
    
    // Normalize the difference to be within -length/2 to length/2
    if (diff > testimonials.length / 2) {
      return diff - testimonials.length;
    } else if (diff < -testimonials.length / 2) {
      return diff + testimonials.length;
    }
    
    return diff;
  }, [currentIndex, testimonials.length]);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);
  const handleDotClick = useCallback((index) => setCurrentIndex(index), []);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-neutral-indigo overflow-hidden" aria-label="نظرات دانشجویان">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star className="w-8 h-8 text-primary" aria-hidden="true" />
            <h2 className="text-4xl font-black text-text-charcoal">
              داستان موفقیت دانشجویان میمو
            </h2>
          </div>
          <p className="text-text-gray text-lg">
            تجربه واقعی دانشجویان از یادگیری در میمو آکادمی
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative h-[400px] flex items-center justify-center px-4 lg:px-0"
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          role="region"
          aria-roledescription="carousel"
          aria-label="نظرات کاربران"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isActive={index === currentIndex}
              position={getCardPosition(index)}
            />
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-12" role="tablist" aria-label="انتخاب نظر">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-neutral-gray hover:bg-neutral-darker"
              }`}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={`نظر ${index + 1} از ${testimonials.length}`}
              type="button"
            />
          ))}
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <p className="text-center text-sm text-text-gray mt-4">
            ⏸ موقتاً متوقف شده
          </p>
        )}
      </div>
    </section>
  );
}

