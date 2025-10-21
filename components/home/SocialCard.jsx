import Image from "next/image";

export default function SocialCard({ platform, title, handle, image, gradientFrom, gradientVia, gradientTo, url }) {
  const gradientClass = gradientVia
    ? `bg-gradient-to-r from-[${gradientFrom}] via-[${gradientVia}] to-[${gradientTo}]`
    : `bg-gradient-to-r from-[${gradientFrom}] to-[${gradientTo}]`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: gradientVia
          ? `linear-gradient(to right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`
          : `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        {/* Text Content */}
        <div className={`flex-1 font-bold text-right ${platform === "Instagram" ? "text-[#836880]" : "text-white"}`}>
          <h3 className={`text-lg mb-2`}>
            {title}
          </h3>
          <p className="text-sm bg-white/30 rounded-full px-4 py-2 w-fit">
            {handle}
          </p>
        </div>

        {/* Icon/Logo */}
        <div className="flex-shrink-0 w-16 h-16 relative">
          <Image
            src={image}
            alt={platform}
            fill
            className="object-contain scale-200"
          />
        </div>
      </div>
    </a>
  );
}

