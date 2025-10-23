"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Tag, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';

export default function CartPage() {
  const {
    cart,
    subtotal,
    discountValue,
    total,
    itemCount,
    discountCode,
    applyDiscount,
    removeDiscount,
  } = useCart();

  const [discountInput, setDiscountInput] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountSuccess, setDiscountSuccess] = useState('');

  const handleApplyDiscount = useCallback((e) => {
    e.preventDefault();
    setDiscountError('');
    setDiscountSuccess('');

    if (!discountInput.trim()) {
      setDiscountError('لطفاً کد تخفیف را وارد کنید');
      return;
    }

    const result = applyDiscount(discountInput.trim());
    
    if (result.success) {
      setDiscountSuccess(`کد تخفیف ${result.amount}٪ اعمال شد!`);
      setDiscountInput('');
      setTimeout(() => setDiscountSuccess(''), 3000);
    } else {
      setDiscountError(result.message);
    }
  }, [discountInput, applyDiscount]);

  const handleRemoveDiscount = useCallback(() => {
    removeDiscount();
    setDiscountError('');
    setDiscountSuccess('');
  }, [removeDiscount]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-indigo to-white py-16 sm:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto text-center">
            {/* Empty Cart Illustration */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-text-light" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold text-text-charcoal mb-4">
              سبد خرید شما خالی است
            </h1>
            <p className="text-text-gray mb-8">
              هنوز هیچ دوره‌ای به سبد خرید خود اضافه نکرده‌اید.
            </p>

            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              مشاهده دوره‌های آموزشی
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-indigo to-white py-16 sm:py-28">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-charcoal mb-2">
              سبد خرید
            </h1>
            <p className="text-text-gray">
              {itemCount} دوره در سبد خرید شما
            </p>
          </div>
          
          <Link
            href="/store"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium text-sm sm:text-base"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            بازگشت به فروشگاه
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary Card - Right Side */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-neutral-extralight p-6 shadow-lg sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-text-charcoal pb-4 border-b border-neutral-extralight">
                خلاصه سبد خرید
              </h2>

              {/* Discount Code Input */}
              <form onSubmit={handleApplyDiscount} className="space-y-3">
                <label htmlFor="discount-code" className="block text-sm font-medium text-text-gray">
                  کد تخفیف
                </label>
                
                {discountCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                      <span className="text-sm font-semibold text-green-700">
                        {discountCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                      aria-label="حذف کد تخفیف"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        id="discount-code"
                        type="text"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        placeholder="کد تخفیف را وارد کنید"
                        className=" px-4 py-3 col-span-1 rounded-xl border border-neutral-lighter focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                      />
                      <button
                        type="submit"
                        className="px-2 w-full col-span-1 text-sm py-2 flex gap-x-2 items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors font-medium"
                      >
                        اعمال تخفیف
                        <Tag className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                    
                    {discountError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1">
                        <X className="w-3 h-3" aria-hidden="true" />
                        {discountError}
                      </p>
                    )}
                    
                    {discountSuccess && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                        {discountSuccess}
                      </p>
                    )}
                  </>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-y border-neutral-extralight">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-gray">جمع آیتم‌ها:</span>
                  <span className="font-semibold text-text-charcoal">
                    {subtotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                {discountValue > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">تخفیف:</span>
                    <span className="font-semibold text-green-600">
                      {discountValue.toLocaleString('fa-IR')}- تومان
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-base font-semibold text-text-charcoal">مجموع:</span>
                <span className="text-2xl font-bold text-primary">
                  {total.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-primary to-secondary text-white py-4 rounded-xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-primary/30"
              >
                پرداخت در درگاه پرداخت
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Continue Shopping */}
              <Link
                href="/store"
                className="block w-full text-center py-3 rounded-xl font-medium text-text-gray hover:bg-neutral-indigo transition-colors border border-neutral-extralight"
              >
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

