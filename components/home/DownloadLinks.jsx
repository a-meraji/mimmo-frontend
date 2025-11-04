import { useMemo } from "react";
import { Smartphone, Monitor, WifiOff, ClockPlus } from "lucide-react";
import DownloadCard from "./DownloadCard";

export default function DownloadLinks() {
  const platforms = useMemo(() => [
    {
      platform: "Mac",
      downloadUrl: "#", // Replace with actual download URL
    },
    {
      platform: "Android",
      downloadUrl: "#", // Replace with actual download URL
    },
    {
      platform: "Windows",
      downloadUrl: "#", // Replace with actual download URL
    },  
    {
      platform: "iOS",
      downloadUrl: "#", // Replace with actual download URL
    },
  ], []);

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-gradient-purple/10 to-white relative overflow-hidden" aria-label="دانلود اپلیکیشن">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-primary" aria-hidden="true" />
            <h2 className="text-4xl font-black text-text-charcoal">
              دانلود اپلیکیشن
            </h2>
          </div>
          <p className="text-text-gray text-lg">
            یادگیری در هر زمان و مکان با اپلیکیشن میمو
          </p>
        </div>

        {/* Desktop Layout - Clean Grid */}
        <nav className="hidden lg:grid lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12" aria-label="لینک های دانلود">
          {platforms.map((platform, index) => (
            <div
              key={platform.platform}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <DownloadCard
                platform={platform.platform}
                downloadUrl={platform.downloadUrl}
              />
            </div>
          ))}
        </nav>

        {/* Mobile Layout - 2x2 Grid */}
        <nav className="lg:hidden grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8" aria-label="لینک های دانلود">
          {platforms.map((platform) => (
            <DownloadCard
              key={platform.platform}
              platform={platform.platform}
              downloadUrl={platform.downloadUrl}
            />
          ))}
        </nav>

        {/* Feature Pills */}
        <div className=" hidden md:grid grid-cols-4 items-center justify-center gap-3 max-w-[43rem] mx-auto">
          <span className="px-4 py-2 justify-center whitespace-nowrap bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-text-gray border border-neutral-lighter flex items-center gap-2">
            <Smartphone className="w-4 h-4" aria-hidden="true" />
            موبایل
          </span>
          <span className="px-4 py-2  justify-center whitespace-nowrap bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-text-gray border border-neutral-lighter flex items-center gap-2">
            <Monitor className="w-4 h-4" aria-hidden="true" />
            دسکتاپ
          </span>
          <span className="px-4 py-2 justify-center whitespace-nowrap bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-text-gray border border-neutral-lighter flex items-center gap-2">
            <ClockPlus className="w-4 h-4" aria-hidden="true" />
            دسترسی همیشگی
          </span>
                    <span className="px-4 py-2 justify-center whitespace-nowrap bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-text-gray border border-neutral-lighter flex items-center gap-2">
            <WifiOff className="w-4 h-4" aria-hidden="true" />
            کارکرد آفلاین
          </span>
        </div>
      </div>
    </section>
  );
}

