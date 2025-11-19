"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getImageUrl } from "@/utils/imageUrl";

export default function ProductImage({ image, title, description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-4">
      {/* Product Image */}
      <div className="relative w-full aspect-square max-h-[60vh] bg-gradient-to-br from-neutral-indigo/30 to-white rounded-xl overflow-hidden">
        <Image
          src={getImageUrl(image)}
          alt={title}
          fill
          className="object-contain p-4 drop-shadow-lg"
          priority
          quality={90}
        />
      </div>

      {/* About Section */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-text-charcoal">درباره دوره</h2>
        
        <div className="relative">
          <div
            className={`text-xs text-text-gray leading-relaxed transition-all duration-300 ${
              isExpanded ? 'max-h-none' : 'max-h-20 overflow-hidden'
            }`}
          >
            {description}
          </div>
          
          {/* Gradient Overlay */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Read More/Less Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          type="button"
        >
          {isExpanded ? (
            <>
              <span>نمایش کمتر</span>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>ادامه مطلب</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

