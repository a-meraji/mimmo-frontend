"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartItem({ item }) {
  const { removeFromCart } = useCart();

  const discount = useMemo(() => {
    if (!item.originalPrice) return null;
    return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  }, [item.price, item.originalPrice]);

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <article className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-neutral-extralight hover:border-primary/30 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Image */}
      <Link
        href={`/store/${item.id}`}
        className="relative w-full sm:w-32 aspect-[4/3] sm:aspect-square flex-shrink-0 rounded-xl overflow-hidden bg-neutral-indigo group"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 128px"
        />
        {discount && (
          <div className="absolute top-2 left-2 text-white px-2 py-1 rounded-full text-xs font-bold">
            {discount}٪
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Title & Price */}
        <div className="flex justify-between items-end">
          <div className='space-y-2'>

          <Link href={`/store/${item.id}`} className="group">
            <h3 className="text-base sm:text-lg font-bold text-text-charcoal group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
          </Link>
          {item.subtitle && (
            <p className="text-sm text-text-gray line-clamp-1">
              {item.subtitle}
            </p>
          )}
          </div>
          <div className="flex flex-col justify-between items-end">

          <div className="flex items-center gap-2 flex-wrap">
            {item.originalEuroPrice && (
              <span className="text-sm text-text-light line-through">
                {item.originalEuroPrice} €
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {item.euroPrice} €
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {item.originalPrice && (
              <span className="text-sm text-text-light line-through">
                {item.originalPrice.toLocaleString('fa-IR')} تومان
              </span>
            )}
            <span className="text-lg font-bold text-primary">
              {item.price.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        </div>
            </div>

        {/* Remove Button */}
        <div className="flex items-center justify-end mt-4 pt-4 border-t border-neutral-extralight">
          <button
            onClick={handleRemove}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors group font-medium text-sm"
            aria-label="حذف از سبد خرید"
            type="button"
          >
            <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
            حذف از سبد خرید
          </button>
        </div>
      </div>
    </article>
  );
}

