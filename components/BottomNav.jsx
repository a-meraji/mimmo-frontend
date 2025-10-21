"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_ITEMS, isPathActive } from "@/constants/routes";

export default function BottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);

    const footer = document.getElementById("main-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Hide when footer is more than 50% visible
          // Show when footer is less than 50% visible
          if (entry.intersectionRatio > 0.5) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: [0, 0.5, 1], // Observe at 0%, 50%, and 100% visibility
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

/*
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-4 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/20 shadow-lg">
*/

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 w-full ${
        isMounted ? `transition-all duration-500 ease-in-out ${
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 pointer-events-none"
        }` : ""
      }`}
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around relative mb-2 rounded-2xl bg-white border border-neutral-extralight shadow-2xl py-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(pathname, item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative flex flex-col items-center justify-center gap-1 px-6 py-2 transition-all duration-200 group"
              >
                {/* Top indicator line for active state */}
                <div
                  className={`absolute top-0 max-w-10 right-1/2 w-10  translate-x-1/2 h-0.5 transition-all duration-300 ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />

                {/* Icon */}
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-text-light group-hover:text-text-gray"
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-text-light group-hover:text-text-gray"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

