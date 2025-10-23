"use client";

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartModal() {
  const { cart, isModalOpen, setIsModalOpen, total, itemCount } = useCart();

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, setIsModalOpen]);

  // Get last 3 items for preview
  const previewItems = useMemo(() => {
    return cart.slice(-3).reverse();
  }, [cart]);

  if (!isModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ease-out"
        onClick={() => setIsModalOpen(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] mx-auto max-w-lg px-4 pt-10 flex justify-center items-center animate-slide-down"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-modal-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-l from-primary to-secondary p-6 text-white relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="بستن"
              type="button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            
            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cart-modal-title" className="text-xl font-bold">
                  سبد خرید شما
                </h2>
                <p className="text-sm text-white/90">
                  {itemCount} دوره در سبد خرید
                </p>
              </div>
            </div>
          </div>

          {/* Cart Items Preview */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-indigo flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-text-light" aria-hidden="true" />
                </div>
                <p className="text-text-gray">سبد خرید شما خالی است</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-neutral-extralight hover:border-primary/30 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-indigo">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-charcoal line-clamp-1">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-text-gray line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary">
                          {item.price.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {cart.length > 3 && (
                  <p className="text-center text-xs text-text-light pt-2">
                    و {cart.length - 3} دوره دیگر
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-extralight p-6 bg-neutral-indigo/30 space-y-4">
              {/* Total */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-extralight">
                <span className="text-sm text-text-gray">جمع کل:</span>
                <span className="text-2xl font-bold text-primary">
                  {total.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/cart"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  مشاهده سبد خرید
                  <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                </Link>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 rounded-xl font-medium text-text-gray hover:bg-white transition-colors border border-neutral-extralight"
                  type="button"
                >
                  ادامه خرید
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

