import Image from "next/image";

export default function Roadmap() {

  const features = [
    {
      icon: "🞋",
      title: "هدفمند",
      description: "یادگیری تمرین محور",
    },
    {
      icon: "🏎",
      title: "سریع و موثر",
      description: "آزمون ⤺ عیب یابی ⤺ تکرار",
    },
    {
      icon: "🕑",
      title: "پشتیبانی ۲۴/۷",
      description: "همیشه در کنار شما",
    },
    {
      icon: "🌎",
      title: "دسترسی همه جا",
      description: "در هر کجا که باشید",
    },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Title - 40px = 2.5rem */}
        <h2 className="text-3xl font-extrabold text-text-charcoal text-center mb-10">
          بهترین شیوه یادگیری زبان ایتالیایی
        </h2>

        {/* Roadmap Container - Desktop Layout */}
        <div className="grid lg:flex lg:justify-center gap-8 items-center  mx-auto ">
          

          {/* Center - Roadmap SVG */}
          <div className=" lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative Background Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-purple rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-yellow rounded-full opacity-20 blur-2xl" />
              
              {/* SVG Roadmap */}
              <div className="relative z-10 p-4">
                <Image
                  src="/roadmap.svg"
                  alt="مسیر یادگیری زبان ایتالیایی"
                  width={400}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Features - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-[#583d01] flex flex-col justify-end aspect-square bg-gradient-to-br from-gradient-yellow to-white rounded-2xl p-6 border border-neutral-extralight shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-[#583d01] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#583d01]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Features - Show only on mobile */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gradient-yellow to-white rounded-xl p-4 text-center border border-neutral-extralight shadow-sm"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="text-sm font-bold text-text-charcoal mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-text-gray">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

