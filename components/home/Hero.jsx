"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-gradient-purple to-white">
      {/* Mobile Layout */}
      <div className="container mx-auto px-6 sm:px-6 max-w-lg lg:hidden">
        <div className="flex flex-col items-center text-center pt-16">
          {/* Main Heading - Figma 32px = 2rem, extrabold */}
          <h1 className="text-[2rem] leading-[1.3] font-extrabold text-text-charcoal mb-6 px-4">
            با آموزش‌های میمو ایتالیایی را برای زندگی کردن یاد بگیرید
          </h1>

          {/* Breadcrumb Navigation - Figma 16px = 1rem, medium weight */}
          <p className="text-base font-medium text-text-muted mb-1.5 tracking-wide">
             آموزش زبان ایتالیایی و گواهی نامه ایتالیا
          </p>

          {/* Repeat Text - normal weight */}
          <p className="text-base font-medium text-text-muted mb-7">
            در پلتفرم آموزشی میمو
          </p>

          {/* CTA Buttons */}
          <div className="flex  gap-3 w-full mb-12">
            <Link
              href="/auth"
              className="inline-block w-full bg-primary text-white font-semibold text-base py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md"
            >
              شروع آموزش
            </Link>
            <Link
              href="/contact"
              className="inline-block w-full bg-[#ffffff00] text-primary border-[1px] border-primary font-semibold text-base py-3.5 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md"
            >
              تعیین سطح
            </Link>
          </div>

          {/* Video Container with Shadow Elements */}
          <div className="relative w-full">
            {/* Video */}
            <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[3px] border-neutral-extralight shadow-xl">
              <video
                ref={videoRef}
                className="w-full h-auto aspect-video object-cover z-20"
                controls
                poster="/mimmo1.webp"
                preload="metadata"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
              >
                <source src="/videos/mimmoapp.mp4" type="video/mp4" />
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
              </video>
            </div>

            {/* Left Shadow Element - Purple Gradient */}
            <div 
              className="absolute -bottom-4 -top-4 -left-4 w-48 rounded-3xl blur-2xl z-0 opacity-80"
              style={{
                background: 'linear-gradient(to bottom, #D3D0FB, #E1DFF0)',
                zIndex: 0
              }}
            />

            {/* Right Shadow Element - Yellow Gradient */}
            <div 
              className="absolute -bottom-4 -top-4 -right-4 w-48 rounded-3xl blur-2xl z-0"
              style={{
                background: 'linear-gradient(to bottom, #FFF9EF, #FFF5E4)',
                zIndex: 0
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block container mx-auto px-6 max-w-7xl pt-20">
        <div className="grid grid-cols-2 gap-12 items-stretch">
          {/* Right Side - Text Content */}
          <div className="text-right pr-12 flex flex-col justify-between">
            {/* Main Heading */}
            <h1 className="text-4xl leading-tight font-extrabold text-text-charcoal">
            با آموزش‌های میمو ایتالیایی را برای زندگی کردن یاد بگیرید
            </h1>

            {/* Subtitle */}
            <p className="text-lg font-medium text-text-muted mb-10">
              آموزش زبان ایتالیایی و گواهی نامه ایتالیا
<br/>
              در پلتفرم آموزشی میمو
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link
                href="/auth"
                className="inline-block bg-primary text-white font-medium text-lg px-9 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                شروع آموزش
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-[#ffffff00] text-primary border-[1px] border-primary font-medium text-lg px-9 py-3 rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                تعیین سطح
              </Link>
            </div>
          </div>
          {/* Left Side - Video */}
          <div className="relative w-full">
            {/* Video Container */}
            <div className="relative z-10 w-full rounded-2xl overflow-hidden border-[3px] border-neutral-extralight shadow-xl">
              <video
                ref={videoRef}
                className="w-full h-auto aspect-video object-cover"
                controls
                poster="/mimmo1.webp"
                preload="metadata"
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
              >
                <source src="/videos/mimmoapp.mp4" type="video/mp4" />
                مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
              </video>
            </div>

            {/* Floating Image 1 - Top Left */}
            <div
              className={`absolute -top-8 -left-12 z-20 transition-all duration-500 ${
                isPlaying ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="bg-white rounded-xl shadow-2xl p-1 transform rotate-[-8deg]">
                <Image
                  src="/mimmo2.webp"
                  alt="دوره آموزشی"
                  width={160}
                  height={180}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Floating Image 2 - Bottom Right */}
            <div
              className={`absolute -bottom-8 -right-12 z-20 transition-all duration-500 ${
                isPlaying ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="bg-white rounded-xl shadow-2xl p-1 transform rotate-[6deg]">
                <Image
                  src="/mimmo.webp"
                  alt="کلمه ANDARE"
                  width={160}
                  height={180}
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Left Shadow Element - Purple Gradient */}
            <div 
              className="absolute -bottom-4 -top-4 -right-4 w-48 rounded-3xl blur-2xl z-0 opacity-80"
              style={{
                background: 'linear-gradient(to bottom, #D3D0FB, #bab3e9)',
                zIndex: 0
              }}
            />

            {/* Right Shadow Element - Yellow Gradient */}
            <div 
              className="absolute -bottom-4 -top-4 -left-4 w-48 rounded-3xl blur-2xl z-0"
              style={{
                background: 'linear-gradient(to bottom, #FFF5E4, #FFE5C2)',
                zIndex: 0
              }}
            />
          </div>

          
        </div>
      </div>
    </section>
  );
}

