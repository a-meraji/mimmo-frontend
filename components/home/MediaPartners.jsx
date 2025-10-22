import { useMemo } from "react";
import Image from "next/image";

export default function MediaPartners() {
  const partners = useMemo(() => [
    { name: "همشهری", image: "/hamshahri.webp" },
    { name: "خبر آنلاین", image: "/khabarOnline.webp" },
    { name: "تکراتو", image: "/techrato.webp" },
    { name: "زومیت", image: "/zoomit.webp" },
  ], []);

  return (
    <section className="w-full py-20 bg-white overflow-hidden" aria-label="رسانه های همکار">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-text-charcoal text-center mb-12">
          میمو در رسانه ها
        </h2>

        {/* Infinite Scroll Container */}
        <div className="relative" role="list" aria-label="لوگوهای رسانه های همکار">
   
          {/* Scrolling Track */}
          <div className="flex animate-scroll" aria-hidden="true">
            {/* First set of logos */}
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center"
                style={{ width: "300px", height: "80px" }}
                role="listitem"
              >
                <Image
                  src={partner.image}
                  alt={`لوگوی ${partner.name}`}
                  width={200}
                  height={80}
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  loading={index < 4 ? "eager" : "lazy"}
                  quality={70}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

