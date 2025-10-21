"use client";

import { ShoppingBag, Sparkles } from "lucide-react";

export default function StoreHero() {
  return (
    <section className="relative w-full pb-6 lg:pb-12 pt-12 lg:pt-28 bg-gradient-to-b from-neutral-indigo via-white to-transparent overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <div className="container px-16 relative z-10">
        <div className="text-center lg:text-right">
        

          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold text-text-charcoal">
            دوره‌های آموزشی میمو
          </h1>

        </div>
      </div>
    </section>
  );
}

