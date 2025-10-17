import Image from "next/image";
import PackageCard from "../PackageCard";

export default function DrivingLicenseHome() {
  const pkg = {
    id: 1,
    name: "پکیج آزمون آیین نامه رانندگی در ایتالیا",
    description: "منبع : درس اول کتاب اسپرسو 1",
    image: "/license2.webp",
    originalPrice: 990000,
    discountedPrice: 500000,
  };

  return (
    <section className="bg-gradient-to-b from-white via-neutral-yellow to-white py-20">
      <div className="container mx-auto px-6">
        {/* Title */}
        <h2 className="font-extrabold text-[#583d01] text-3xl text-center mb-12">
          دوره گواهینامه رانندگی در ایتالیا
        </h2>

        {/* Desktop Layout with Side Images */}
        <div className="hidden lg:flex items-start justify-center  max-w-7xl mx-auto">
          {/* Left Image */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-64 h-80 -ml-8  mt-10 transform rotate-[8deg] hover:rotate-[4deg] transition-transform duration-300">
              <div className="absolute inset-0 bg-white rounded-2xl max-w-48 max-h-48">
                <Image
                  src="/license1.webp"
                  alt="گواهینامه رانندگی ایتالیا"
                  fill
                  className="object-cover rounded-2xl p-3 shadow-xl"
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
                  className="object-cover rounded-2xl p-3 shadow-xl"
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
      </div>
    </section>
  );
}