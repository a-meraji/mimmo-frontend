"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function PackageCard({ package: pkg, priority = false }) {
  const { addToCart } = useCart();

  const discount = useMemo(() => {
    if (!pkg.originalPrice) return null;
    return Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);
  }, [pkg.price, pkg.originalPrice]);

  const levelColor = useMemo(() => {
    switch (pkg.level) {
      case 'A1':
        return 'bg-green-500/10 text-green-700 border-green-500/40';
      case 'A2':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/40';
      case 'B1':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/40';
      default:
        return 'bg-primary/10 text-primary border-primary/40';
    }
  }, [pkg.level]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: pkg.id,
      title: pkg.title,
      subtitle: pkg.subtitle || '',
      image: pkg.image,
      price: pkg.price,
      originalPrice: pkg.originalPrice || null,
    });
  };

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-neutral-lighter shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/store/${pkg.id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden">
          <Image
            src={pkg.image}
            alt={`پکیج ${pkg.title}`}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            loading={priority ? "eager" : "lazy"}
            quality={80}
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
          {pkg.badge && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {pkg.badge}
            </div>
          )}

          {/* Level Badge */}
          {pkg.level && (
            <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${levelColor}`}>
              سطح {pkg.level}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-5">
          {/* Title & Subtitle */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-text-charcoal mb-1 line-clamp-2">
              {pkg.title}
            </h3>
            {pkg.subtitle && (
              <p className="text-sm text-text-gray line-clamp-1">
                {pkg.subtitle}
              </p>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Pricing Display */}
          <div className="mt-4 pt-4 border-t border-neutral-lighter">
            <div className="flex flex-col items-end">
              {pkg.originalPrice && discount && (
                <span 
                  className="text-xs text-text-light line-through mb-1"
                  aria-label={`قیمت اصلی: ${pkg.originalPrice.toLocaleString('fa-IR')} تومان`}
                >
                  {pkg.originalPrice.toLocaleString('fa-IR')} تومان
                </span>
              )}
              <span 
                className="text-xl font-bold text-primary"
                aria-label={`قیمت: ${pkg.price.toLocaleString('fa-IR')} تومان`}
              >
                {pkg.price.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button - Outside Link */}
      <div className="p-5 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          aria-label={`افزودن ${pkg.title} به سبد خرید`}
          type="button"
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          افزودن به سبد خرید
        </button>
      </div>
    </article>
  );
}

