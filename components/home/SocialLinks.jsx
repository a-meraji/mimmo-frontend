import { useMemo } from "react";
import SocialCard from "./SocialCard";

export default function SocialLinks() {
  const socials = useMemo(() => [
    {
      platform: "Instagram",
      title: "از دوره ها و تخفیف ها جا نمونی !",
      handle: "@italian4u.italian4u",
      image: "/instagram.webp",
      gradientFrom: "#FFDDBE",
      gradientVia: "#FCBBCE",
      gradientTo: "#CFBBDB",
      url: "https://instagram.com/italian4u.italian4u",
    },
    {
      platform: "Telegram",
      title: "مارا در کانال تلگرام دنبال کنید",
      handle: "@mimmo_academy",
      image: "/telegram.webp",
      gradientFrom: "#8DD3FF",
      gradientVia: null,
      gradientTo: "#6489D0",
      url: "https://t.me/mimmo_academy",
    },
    {
      platform: "Facebook",
      title: "از اخبار آکادمی ما مطلع شوید",
      handle: "@italian4u.italian4u",
      image: "/facebook.webp",
      gradientFrom: "#badcff",
      gradientVia: null,
      gradientTo: "#0c3fc2",
      url: "https://facebook.com/italian4u",
    },
    {
      platform: "YouTube",
      title: "زندگی در ایتالیا در یوتیوب میمو",
      handle: "@italian4u.italian4u",
      image: "/youtube.webp",
      gradientFrom: "#FFFFFF",
      gradientVia: null,
      gradientTo: "#FF4E4E",
      url: "https://www.youtube.com/@italian4u.italian4u",
    },
  ], []);

  return (
    <section className="w-full py-20 " aria-label="شبکه های اجتماعی">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-text-charcoal text-center mb-12">
          میمو را در شبکه های اجتماعی دنبال کنید
        </h2>

        {/* Mobile Layout - Stacked */}
        <nav className="lg:hidden flex flex-col gap-4 max-w-lg mx-auto" role="list">
          {socials.map((social) => (
            <SocialCard
              key={social.platform}
              platform={social.platform}
              title={social.title}
              handle={social.handle}
              image={social.image}
              gradientFrom={social.gradientFrom}
              gradientVia={social.gradientVia}
              gradientTo={social.gradientTo}
              url={social.url}
            />
          ))}
        </nav>

        {/* Desktop Layout - Horizontal */}
        <nav className="hidden lg:grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto" role="list">
          {socials.map((social) => (
            <SocialCard
              key={social.platform}
              platform={social.platform}
              title={social.title}
              handle={social.handle}
              image={social.image}
              gradientFrom={social.gradientFrom}
              gradientVia={social.gradientVia}
              gradientTo={social.gradientTo}
              url={social.url}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}

