"use client";

import { ShoppingCart, Star } from "lucide-react";
import { useMemo } from "react";
import { useCart } from "@/contexts/CartContext";

export default function StickyProductInfo({ 
  id,
  title, 
  subtitle,
  price, 
  originalPrice, 
  image,
  rating = 4.9,
  reviewCount = 1237,
  onAddToCart,
  isVisible = false
}) {
  const { addToCart } = useCart();
  
  const discount = useMemo(() => 
    originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null,
    [originalPrice, price]
  );

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      subtitle: subtitle || '',
      image,
      price,
      originalPrice: originalPrice || null,
    });

    // Call the optional callback if provided
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div 
      className={`
        sticky top-24 
        bg-white rounded-2xl border border-neutral-extralight p-6 space-y-4
        shadow-xl z-40
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}
      `}
      style={{
        marginTop: isVisible ? '-100vh' : '0'
      }}
      role="complementary"
      aria-label="اطلاعات سریع محصول"
      aria-hidden={!isVisible}
    >
      {/* Title & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-text-charcoal line-clamp-1">{title}</h2>
        {subtitle && (
          <p className="text-xs text-text-gray line-clamp-1">{subtitle}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 pb-3 border-b border-neutral-extralight">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-secondary fill-secondary" aria-hidden="true" />
          <span className="text-base font-bold text-text-charcoal">{rating}</span>
        </div>
        <span className="text-xs text-text-light">({reviewCount.toLocaleString('fa-IR')} نظر)</span>
      </div>

      {/* Price & Add to Cart */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {originalPrice && (
            <span className="text-sm text-text-light line-through">
              {originalPrice.toLocaleString('fa-IR')} تومان
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 bg-rose-600 text-white rounded-full text-xs font-bold">
              {discount}٪ تخفیف
            </span>
          )}
        </div>
        <div className="text-xl font-bold text-primary">
          {price.toLocaleString('fa-IR')} تومان
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          type="button"
          aria-label="افزودن به سبد خرید"
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

