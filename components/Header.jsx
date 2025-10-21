"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User } from "lucide-react";
import { getCurrentRouteName } from "@/constants/routes";

export default function Header() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Check if at top (within 10px threshold)
        setIsAtTop(currentScrollY < 10);

        // Show header if:
        // 1. At the top of page, OR
        // 2. Scrolling up
        if (currentScrollY < 10) {
          setIsVisible(true);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          // Scrolling down and past threshold
          setIsVisible(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });

      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const routeName = useMemo(() => getCurrentRouteName(pathname), [pathname]);

  return (
    <header 
      className={`fixed left-0 right-0 z-50 w-full transition-transform duration-300 ease-in-out ${
        isVisible ? 'top-0 translate-y-0' : '-translate-y-full'
      }`}
      role="banner"
      aria-label="هدر اصلی"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav 
          className="relative mt-2 rounded-2xl backdrop-blur-xl bg-white/70 border border-neutral-lighter shadow-lg"
          aria-label="ناوبری اصلی"
        >
          {/* Header Content */}
          <div className="flex items-center justify-between py-1 px-4 sm:px-6">
            {/* Left: Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              aria-label="صفحه اصلی میمو آکادمی"
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <Image
                  src="/mimmo-logo.webp"
                  alt="لوگوی میمو آکادمی"
                  fill
                  className="object-contain scale-150"
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 40px, 48px"
                />
              </div>
            </Link>

            {/* Center: Dynamic Route Name */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-text-charcoal font-semibold text-lg">
                {routeName}
              </h1>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4" role="navigation" aria-label="دسترسی سریع">
              {/* Shopping Bag Icon */}
              <Link
                href="/store"
                className="relative p-2 rounded-full hover:bg-neutral-indigo/50 transition-colors"
                aria-label="سبد خرید"
              >
                <ShoppingBag className="w-6 h-6 text-text-charcoal" strokeWidth={1.5} aria-hidden="true" />
                {/* Optional: Badge for cart items count */}
                {/* <span className="absolute top-0 right-0 w-5 h-5 bg-secondary text-xs flex items-center justify-center rounded-full font-bold" role="status" aria-label="3 آیتم در سبد">
                  3
                </span> */}
              </Link>

              {/* Profile Icon */}
              <Link
                href="/profile"
                className="p-2 rounded-full hover:bg-neutral-indigo/50 transition-colors"
                aria-label="پروفایل کاربری"
              >
                <User className="w-6 h-6 text-text-charcoal" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

