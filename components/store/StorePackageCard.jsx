"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, BookOpenText, Clock, NotebookText, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function StorePackageCard({ 
  id,
  title, 
  subtitle,
  level,
  price, 
  originalPrice,
  euroPrice,
  originalEuroPrice,
  image,
  specifications = [],
  badge,
  onAddToCart 
}) {
  const { addToCart } = useCart();

  const discount = useMemo(() => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }, [price, originalPrice]);

  const levelColor = useMemo(() => {
    switch (level) {
      case 'A1':
        return 'bg-green-500/10 text-green-700 border-green-500/40';
      case 'A2':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/40';
      case 'B1':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/40';
      default:
        return 'bg-primary/10 text-primary border-primary/40';
    }
  }, [level]);

  // Icon mapping - same as ProductInfo.jsx
  const iconMap = {
    BookOpenText,
    Clock,
    NotebookText,
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id,
      title,
      subtitle: subtitle || '',
      image,
      price,
      originalPrice: originalPrice || null,
      euroPrice: euroPrice || null,
      originalEuroPrice: originalEuroPrice || null,
    });

    // Call the optional callback if provided
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <article className="group h-full flex flex-col bg-white rounded-2xl border border-neutral-lighter shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/store/${id}`} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] flex-shrink-0 overflow-hidden bg-[#fcfcfc]">
        <Image
          src={image}
          alt={`پکیج ${title}`}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
          loading="lazy"
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
        {badge && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
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

        {/* Specifications - Same structure as ProductInfo.jsx */}
        {specifications.length > 0 && (
          <div className="space-y-1 mb-4">
            {specifications.map((spec, index) => {
              const Icon = typeof spec.icon === 'string' ? iconMap[spec.icon] : spec.icon;
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-extralight last:border-0">
                  <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-text-gray" aria-hidden="true" />
     
                    <span className="text-xs text-text-gray">{spec.label}</span>
                  </div>
                  <span className="text-xs font-medium text-text-charcoal">{spec.value}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Pricing Display */}
        <div className="mt-4 pt-4 border-t border-neutral-lighter flex justify-between items-end">
          <div className="flex flex-col items-start">
            {originalEuroPrice && (<span className="text-xs text-text-light line-through mb-1">{originalEuroPrice} €</span>)}
            <span className="text-xl font-bold text-primary">{euroPrice} €</span>
          </div>
          <div className="flex flex-col items-end">
            {originalPrice && discount && (
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

      {/* Action Buttons - Outside Link */}
      <div className="p-5 pt-0">
        <div className="flex gap-2">
          {/* View Course Button */}
          <Link
            href={`/store/${id}`}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-200"
            aria-label={`مشاهده ${title}`}
          >
            <Eye className="w-5 h-5" aria-hidden="true" />
            <span>مشاهده دوره</span>
          </Link>

          {/* Add to Cart Button - Icon Only */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
            aria-label={`افزودن ${title} به سبد خرید`}
            type="button"
          >
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

