"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function BadgeCard({ badge, onPrevious, onNext, showNavigation = false }) {
  return (
    <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Navigation Arrows for Ranked Badges */}
      {showNavigation && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-2 top-1/3 -translate-y-1/2 p-2 rounded-full bg-white/80 text-text-gray hover:bg-white hover:text-primary transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="نشان قبلی"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={onNext}
            className="absolute right-2 top-1/3 -translate-y-1/2 p-2 rounded-full bg-white/80 text-text-gray hover:bg-white hover:text-primary transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="نشان بعدی"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Badge Image */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <Image
            src={badge.image}
            alt={badge.title}
            fill
            className={`object-contain transition-all duration-300 ${
              badge.achieved ? "" : "grayscale opacity-40"
            }`}
          />
        </div>
      </div>

      {/* Badge Title */}
      <h3 className="text-xl font-bold text-text-charcoal text-center mb-3">
        {badge.title}
      </h3>

      {/* Badge Description */}
      <p className="text-sm text-text-gray text-center leading-relaxed">
        {badge.description}
      </p>

      {/* Achievement Status Indicator */}
      {badge.achieved && (
        <div className="absolute top-4 left-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

