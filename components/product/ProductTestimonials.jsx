"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const TestimonialCard = ({ testimonial }) => {
  return (
    <article className="bg-white rounded-2xl p-6 border border-neutral-extralight hover:shadow-lg transition-shadow duration-300">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonial.rating} از 5 ستاره`}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < testimonial.rating
                ? "fill-secondary text-secondary"
                : "fill-neutral-extralight text-neutral-extralight"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="text-text-gray text-xs leading-relaxed mb-4">
        {testimonial.review}
      </blockquote>

      {/* Profile Section */}
      <div className="flex items-center gap-3 pt-4 border-t border-neutral-extralight">
        {/* Profile Image */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-neutral-indigo">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={`عکس پروفایل ${testimonial.name}`}
              fill
              className="object-cover"
              loading="lazy"
              quality={75}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary text-sm font-bold">
              {testimonial.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Name and Role */}
        <div>
          <h4 className="font-semibold text-text-charcoal text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-text-gray">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
};

export default function ProductTestimonials({ testimonials = [] }) {
  const [showAll, setShowAll] = useState(false);

  const defaultTestimonials = useMemo(() => [
    {
      id: 1,
      name: "سارا احمدی",
      role: "دانشجوی زبان ایتالیایی",
      rating: 5,
      review: "این دوره واقعاً عالی بود! با وجود اینکه هیچ پیش‌زمینه‌ای از زبان ایتالیایی نداشتم، توانستم به راحتی مفاهیم را یاد بگیرم. استاد بسیار صبور و حرفه‌ای بود.",
      avatar: "/e1.webp"
    },
    {
      id: 2,
      name: "امیر رضایی",
      role: "مهاجر به ایتالیا",
      rating: 5,
      review: "بهترین دوره‌ای که تا به حال دیده‌ام. محتوا کاملاً کاربردی است و دقیقاً همان چیزی است که برای زندگی در ایتالیا نیاز دارید. پشتیبانی هم فوق‌العاده است.",
      avatar: null
    },
    {
      id: 3,
      name: "مریم کریمی",
      role: "دانشجوی سطح A2",
      rating: 5,
      review: "من این دوره را به همه توصیه می‌کنم. ویدیوها با کیفیت عالی هستند و تمرینات تعاملی خیلی کمک کننده‌اند. در عرض ۳ ماه توانستم سطح A1 را کامل کنم.",
      avatar: null
    },
    {
      id: 4,
      name: "علی محمدی",
      role: "دانشجوی دانشگاه",
      rating: 4,
      review: "دوره جامع و کاملی است. تنها نکته منفی شاید حجم زیاد محتوا باشد که نیاز به زمان دارد، اما در کل بسیار راضی هستم.",
      avatar: null
    }
  ], []);

  const allTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;
  const displayTestimonials = showAll ? allTestimonials : allTestimonials.slice(0, 3);
  const hasMore = allTestimonials.length > 3;

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-charcoal">نظرات کاربران در مورد این دوره</h2>
        <span className="text-xs text-text-light">
          {allTestimonials.length} نظر
        </span>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {displayTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-extralight text-primary hover:bg-primary/5 transition-colors duration-200 text-sm font-medium"
          type="button"
        >
          {showAll ? (
            <>
              <span>نمایش کمتر</span>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>نمایش نظرات بیشتر</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

