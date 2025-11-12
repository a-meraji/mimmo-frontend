"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpenText } from "lucide-react";

export default function CourseCard({ course, priority = false }) {
  const coursePath = course?.learnPath || course?.slug || course?.id;
  const courseHref = coursePath ? `/learn/${coursePath}` : '#';
  const levelColor = useMemo(() => {
    switch (course?.level) {
      case 'A1':
        return 'bg-green-500/10 text-green-700 border-green-500/40';
      case 'A2':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/40';
      case 'B1':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/40';
      default:
        return 'bg-primary/10 text-primary border-primary/40';
    }
  }, [course?.level]);

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-neutral-lighter shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={courseHref} className="flex-1 flex flex-col" prefetch={!!coursePath}>
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-[#fcfcfc]">
          <Image
            src={course?.image || "/es1.webp"}
            alt={`دوره ${course?.title || "آموزشی"}`}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
            loading={priority ? "eager" : "lazy"}
            quality={80}
          />
          
          {/* Special Badge */}
          {course?.badge && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {course.badge}
            </div>
          )}

          {/* Level Badge */}
          {course?.level && (
            <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${levelColor}`}>
              سطح {course.level}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-5">
          {/* Title & Subtitle */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text-charcoal mb-1 line-clamp-2">
              {course?.title || "دوره آموزشی"}
            </h3>
            {course?.subtitle && (
              <p className="text-sm text-text-gray line-clamp-1">
                {course.subtitle}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>
        </div>
      </Link>

      {/* View Course Button - Outside Link */}
      <div className="p-5 pt-0">
        <Link
          href={courseHref}
          className="w-full flex whitespace-nowrap items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label={`مشاهده ${course?.title || "دوره"}`}
          prefetch={!!coursePath}
        >
          <BookOpenText className="w-5 h-5" aria-hidden="true" />
          مشاهده دوره و یادگیری
        </Link>
      </div>
    </article>
  );
}

