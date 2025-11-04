"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Car } from "lucide-react";
import PackageCard from "../PackageCard";

export default function DrivingLicenseHome() {
  const scrollRowRef = useRef(null);

  const pkg = useMemo(() => ({
    id: 10,
    title: "پکیج گواهینامه رانندگی ایتالیا",
    subtitle: "آموزش کامل آیین نامه رانندگی",
    level: null,
    price: 650000,
    originalPrice: 900000,
    euroPrice: 259,
    image: "/license2.webp",
    badge: "پرفروش",
  }), []);

  // Background images configuration - bigger sizes
  const backgroundImages = useMemo(() => [
    { src: "/license0.webp", width: 350, height: 480, rotation: -4 },
    { src: "/license1.webp", width: 320, height: 450, rotation: 6 },
    { src: "/license2.webp", width: 380, height: 500, rotation: -3 },
    { src: "/license3.webp", width: 340, height: 470, rotation: 5 },
    { src: "/license4.webp", width: 360, height: 490, rotation: -5 },
    { src: "/license5.webp", width: 340, height: 470, rotation: 6 },
  ], []);

  // Parallax scroll effect with useCallback
  const handleScroll = useCallback(() => {
    if (scrollRowRef.current) {
      const scrollPosition = window.scrollY;
      // Move horizontally based on vertical scroll (0.3 is the parallax speed factor)
      const horizontalOffset = scrollPosition * 0.3;
      scrollRowRef.current.style.transform = `translateX(-${horizontalOffset}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="relative bg-gradient-to-b from-white via-gradient-yellow-muted to-white py-20 overflow-hidden" aria-label="دوره گواهینامه رانندگی">
      {/* Animated Background Layer with Parallax - Desktop Only */}
      <div className="hidden lg:block absolute inset-0 opacity-35 blur-[2px]" aria-hidden="true">
        <div
          ref={scrollRowRef}
          className="absolute top-1/2 -translate-y-1/2 left-0 flex gap-16 animate-scroll-left transition-transform duration-100 ease-out"
          style={{ willChange: "transform" }}
        >
          {/* Triple the images for seamless infinite scroll */}
          {[...backgroundImages, ...backgroundImages, ...backgroundImages].map((img, index) => (
            <div
              key={`bg-${index}`}
              className="relative flex-shrink-0 transform hover:scale-105 transition-transform duration-500"
              style={{
                width: `${img.width}px`,
                height: `${img.height}px`,
                transform: `rotate(${img.rotation}deg)`,
              }}
            >
              <Image
                src={img.src}
                alt=""
                fill
                className="object-cover rounded-3xl blur-[2px] shadow-2xl"
                loading={index < 6 ? "eager" : "lazy"}
                quality={20}
                sizes={`${img.width}px`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content Layer */}
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="w-8 h-8 text-[#583d01]" aria-hidden="true" />
            <h2 className="text-4xl font-black text-[#583d01]">
              دوره گواهینامه رانندگی در ایتالیا
            </h2>
          </div>
          <p className="text-[#583d01] text-lg">
            آموزش جامع آیین‌نامه و تست‌های واقعی برای اخذ گواهینامه
          </p>
        </div>

        {/* Desktop Layout with Side Images */}
        <div className="hidden lg:flex items-start justify-center  max-w-7xl mx-auto">
          {/* Left Image */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-64 h-80 -ml-6 mt-16 transform rotate-[8deg] hover:rotate-[4deg] transition-transform duration-300">
              <div className="absolute inset-0 bg-white rounded-2xl ">
                <Image
                  src="/license1.webp"
                  alt="گواهینامه رانندگی ایتالیا"
                  fill
                  className="object-cover rounded-2xl p-3 shadow-xl border-[1px] border-neutral-lighter"
                quality={70}

                />
              </div>
            </div>
          </div>

          {/* Center - Package Card */}
          <div className="flex-shrink-0 w-[380px] relative z-10">
            <PackageCard package={pkg} />
          </div>

          {/* Right Image */}
          <div className="flex-shrink-0  relative mt-20 -mr-2 z-10">
            <div className="relative w-64 h-80 transform rotate-[-10deg] hover:rotate-[-4deg] transition-transform duration-300">
              <div className="absolute inset-0  bg-white rounded-2xl ">
                <Image
                  src="/license0.webp"
                  alt="آموزش رانندگی در ایتالیا"
                  fill
                  className="object-cover rounded-2xl p-3 shadow-xl border-[1px] border-neutral-lighter"
                quality={70}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Card Only */}
        <div className="lg:hidden flex justify-center">
          <div className="w-full max-w-sm">
            <PackageCard package={pkg} />
          </div>
        </div>

        {/* Mobile Auto-Scroll Images - Below Card */}
        <div className="lg:hidden mt-8 overflow-hidden">
          <div className="flex gap-4 animate-scroll-right-fast">
            {/* Triple the images for seamless infinite scroll */}
            {[...backgroundImages, ...backgroundImages, ...backgroundImages].map((img, index) => (
              <div
                key={`mobile-${index}`}
                className="relative flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
                style={{
                  width: '120px',
                  height: '160px',
                  transform: `rotate(${img.rotation}deg)`,
                }}
              >
                <Image
                  src={img.src}
                  alt={`نمونه گواهینامه ${index + 1}`}
                  fill
                  className="object-cover rounded-2xl shadow-xl border border-neutral-lighter"
                  loading="lazy"
                  quality={75}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}