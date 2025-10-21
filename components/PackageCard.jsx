import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export default function PackageCard({ package: pkg }) {
  const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((pkg.originalPrice - pkg.discountedPrice) / pkg.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300 border border-neutral-lighter h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-[3/3] mt-2 flex-shrink-0">
        <Image
          src={pkg.image}
          alt={pkg.name}
          fill
          className="object-contain p-3 rounded-3xl"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-6 right-6 bg-rose-600 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
            {discountPercentage}% تخفیف
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Package Name - 20px, bold */}
        <h3 className="text-xl font-bold text-text-charcoal mb-3 line-clamp-2 ">
          {pkg.name}
        </h3>

        {/* Package Description - 14px, regular */}
        <p className="text-sm font-normal text-text-gray mb-4 line-clamp-3">
          {pkg.description}
        </p>

        {/* Spacer to push content to bottom */}
        <div className="flex-grow"></div>

        {/* Pricing Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                {/* Original Price - line-through */}
                <span className="text-sm font-medium text-text-gray line-through">
                  {pkg.originalPrice.toLocaleString('fa-IR')} تومان
                </span>
                {/* Discounted Price - bold */}
                <span className="text-sm font-bold text-rose-600">
                  {pkg.discountedPrice.toLocaleString('fa-IR')} تومان
                </span>
              </>
            ) : (
              /* Original Price - bold */
              <span className="text-sm font-bold text-text-charcoal">
                {pkg.originalPrice.toLocaleString('fa-IR')} تومان
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
          <ShoppingCart className="w-5 h-5" />
          افزودن به سبد خرید
        </button>
      </div>
    </div>
  );
}

