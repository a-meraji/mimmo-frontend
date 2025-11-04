import { useMemo } from "react";
import { Share2 } from "lucide-react";
import SocialCard from "./SocialCard";

export default function SocialLinks() {
  const socialsData = useMemo(() => ({
    instagram: {
      platform: "Instagram",
      title: "از دوره ها و تخفیف ها جا نمونی !",
      handle: "@italian4u.italian4u",
      image: "/instagram.webp",
      gradientFrom: "#FFDDBE",
      gradientVia: "#FCBBCE",
      gradientTo: "#CFBBDB",
      url: "https://instagram.com/italian4u.italian4u",
    },
    telegram: {
      platform: "Telegram",
      title: "مارا در کانال تلگرام دنبال کنید",
      handle: "@mimmo_academy",
      image: "/telegram.webp",
      gradientFrom: "#8DD3FF",
      gradientVia: null,
      gradientTo: "#6489D0",
      url: "https://t.me/mimmo_academy",
    },
    facebook: {
      platform: "Facebook",
      title: "از اخبار آکادمی ما مطلع شوید",
      handle: "@italian4u.italian4u",
      image: "/facebook.webp",
      gradientFrom: "#badcff",
      gradientVia: null,
      gradientTo: "#0c3fc2",
      url: "https://facebook.com/italian4u",
    },
    youtube: {
      platform: "YouTube",
      title: "زندگی در ایتالیا در یوتیوب میمو",
      handle: "@italian4u.italian4u",
      image: "/youtube.webp",
      gradientFrom: "#FFFFFF",
      gradientVia: null,
      gradientTo: "#FF4E4E",
      url: "https://www.youtube.com/@italian4u.italian4u",
    },
  }), []);

  // Desktop order: Instagram, Telegram, Facebook, YouTube
  const desktopOrder = useMemo(() => [
    socialsData.instagram,
    socialsData.telegram,
    socialsData.facebook,
    socialsData.youtube,
  ], [socialsData]);

  // Mobile order: Instagram, Telegram, YouTube, Facebook
  const mobileOrder = useMemo(() => [
    socialsData.instagram,
    socialsData.telegram,
    socialsData.youtube,
    socialsData.facebook,
  ], [socialsData]);

  return (
    <section className="w-full py-20 " aria-label="شبکه های اجتماعی">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Share2 className="w-8 h-8 text-primary hidden md:block" aria-hidden="true" />
            <h2 className="text-4xl font-black text-text-charcoal">
              میمو را در شبکه های اجتماعی دنبال کنید
            </h2>
          </div>
          <p className="flex justify-center text-text-gray text-lg px-2">
            <Share2 className="w-8 h-8 ml-1 text-primary md:hidden" aria-hidden="true" />
            همراه ما باشید و از آخرین اخبار و تخفیف‌ها باخبر شوید
          </p>
        </div>

        {/* Mobile Layout - Stacked */}
        <nav className="lg:hidden flex flex-col gap-4 max-w-lg mx-auto" role="list">
          {mobileOrder.map((social) => (
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
          {desktopOrder.map((social) => (
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

