import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialCard({ testimonial, isActive, position }) {
  // Calculate styles based on position
  const getCardStyles = () => {
    if (position === 0) {
      // Active card - front and center
      return {
        transform: "translateX(0) scale(1)",
        opacity: 1,
        zIndex: 30,
        filter: "blur(0px)",
      };
    } else if (position === 1) {
      // Right card - slightly behind
      return {
        transform: "translateX(60%) scale(0.9)",
        opacity: 0.6,
        zIndex: 20,
        filter: "blur(2px)",
      };
    } else if (position === -1) {
      // Left card - slightly behind
      return {
        transform: "translateX(-60%) scale(0.9)",
        opacity: 0.6,
        zIndex: 20,
        filter: "blur(2px)",
      };
    } else {
      // Hidden cards
      return {
        transform: `translateX(${position * 100}%) scale(0.8)`,
        opacity: 0,
        zIndex: 10,
        filter: "blur(4px)",
      };
    }
  };

  const cardStyles = getCardStyles();

  return (
    <div
      className="absolute w-full max-w-md transition-all duration-700 ease-in-out"
      style={cardStyles}
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-lighter">
        {/* Rating Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < testimonial.rating
                  ? "fill-secondary text-secondary"
                  : "fill-neutral-lighter text-neutral-lighter"
              }`}
            />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-text-gray text-base leading-relaxed mb-6 min-h-[120px]">
          {testimonial.review}
        </p>

        {/* Profile Section */}
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-lighter">
          {/* Profile Image */}
          <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Role */}
          <div>
            <h4 className="font-bold text-text-charcoal text-lg">
              {testimonial.name}
            </h4>
            <p className="text-sm text-text-gray">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

