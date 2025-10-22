"use client";

import { ShoppingCart, Star, Clock, BookOpen, Award, Users } from "lucide-react";

export default function ProductInfo({ 
  title, 
  subtitle,
  price, 
  originalPrice, 
  rating = 4.9,
  reviewCount = 1237,
  specifications = [],
  onAddToCart 
}) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

  const defaultSpecs = [
    { icon: BookOpen, label: "از متوسطه تا پیشرفته", value: "۴ سطح" },
    { icon: Clock, label: "ساعت ویدیو آموزشی", value: "۲۴" },
    { icon: Award, label: "تضمین کیفیت دوره", value: "۳۰ روز" },
    { icon: Users, label: "دانشجویان فعال", value: "+۵,۰۰۰" },
  ];

  const specs = specifications.length > 0 ? specifications : defaultSpecs;

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-text-charcoal">{title}</h1>
        {subtitle && (
          <p className="text-sm text-text-gray">{subtitle}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 pb-4 border-b border-neutral-extralight">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 text-secondary fill-secondary" aria-hidden="true" />
          <span className="text-lg font-bold text-text-charcoal">{rating}</span>
        </div>
        <span className="text-xs text-text-light">({reviewCount.toLocaleString('fa-IR')} نظر)</span>
      </div>

      {/* Price & Add to Cart */}
      <div className="space-y-4 pb-6 border-b border-neutral-extralight">
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
        <div className="text-2xl font-bold text-primary">
          {price.toLocaleString('fa-IR')} تومان
        </div>
        
        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          type="button"
        >
          <ShoppingCart className="w-5 h-5" aria-hidden="true" />
          افزودن به سبد خرید
        </button>
      </div>

      {/* Specifications */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text-charcoal">اطلاعات دوره</h3>
        <div className="space-y-2">
          {specs.map((spec, index) => {
            const Icon = spec.icon;
            return (
              <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-extralight last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <span className="text-xs text-text-gray">{spec.label}</span>
                </div>
                <span className="text-xs font-medium text-text-charcoal">{spec.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

