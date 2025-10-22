"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, BookOpen, GraduationCap, CheckCircle } from "lucide-react";

export default function StorePackageCard({ 
  id,
  title, 
  subtitle,
  level,
  lessons,
  price, 
  originalPrice,
  image,
  features = [],
  badge,
  onAddToCart 
}) {
  const discount = useMemo(() => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [price, originalPrice]);

  const levelColor = useMemo(() => {
    switch (level) {
      case 'A1':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'A2':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'B1':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  }, [level]);

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-neutral-lighter shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/store/${id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-gradient-to-br from-neutral-indigo to-white">
        <Image
          src={image}
          alt={`پکیج ${title}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Discount Badge */}
        {discount && (
          <div 
            className="absolute top-3 left-3 bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            role="status"
            aria-label={`${discount}٪ تخفیف`}
          >
            {discount}٪ تخفیف
          </div>
        )}

        {/* Special Badge */}
        {badge && (
          <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {badge}
          </div>
        )}

        {/* Level Badge */}
        {level && (
          <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${levelColor}`}>
            سطح {level}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-5">
        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-text-charcoal mb-1 line-clamp-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-text-gray line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Lessons Info */}
        {lessons && (
          <div className="flex items-center gap-2 mb-4 text-text-gray">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm">{lessons} درس</span>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <ul className="space-y-2 mb-4" role="list">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-text-gray">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Pricing Display */}
        <div className="mt-4 pt-4 border-t border-neutral-lighter">
          <div className="flex flex-col items-end">
            {originalPrice && (
              <span 
                className="text-xs text-text-light line-through mb-1"
                aria-label={`قیمت اصلی: ${originalPrice.toLocaleString('fa-IR')} تومان`}
              >
                {originalPrice.toLocaleString('fa-IR')} تومان
              </span>
            )}
            <span 
              className="text-xl font-bold text-primary"
              aria-label={`قیمت: ${price.toLocaleString('fa-IR')} تومان`}
            >
              {price.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
      </div>
      </Link>

      {/* Add to Cart Button - Outside Link */}
      <div className="p-5 pt-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(id);
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label={`افزودن ${title} به سبد خرید`}
          type="button"
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          افزودن به سبد خرید
        </button>
      </div>
    </article>
  );
}

