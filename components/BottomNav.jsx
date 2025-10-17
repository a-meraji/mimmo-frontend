"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS, isPathActive } from "@/constants/routes";

export default function BottomNav() {
  const pathname = usePathname();

/*
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mt-4 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/20 shadow-lg">
*/

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full ">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around   relative mb-2 rounded-2xl bg-white  border border-neutral-extralight shadow-2xl py-0.5">
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

