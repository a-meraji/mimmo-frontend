import Image from "next/image";
import { Target, Zap, Clock, Globe, Route } from "lucide-react";

export default function Roadmap() {

  const features = [
    {
      icon: Target,
      title: "هدفمند",
      description: "یادگیری تمرین محور",
    },
    {
      icon: Zap,
      title: "سریع و موثر",
      description: "آزمون ⤺ عیب یابی ⤺ تکرار",
    },
    {
      icon: Clock,
      title: "پشتیبانی ۲۴/۷",
      description: "همیشه در کنار شما",
    },
    {
      icon: Globe,
      title: "دسترسی همه جا",
      description: "در هر کجا که باشید",
    },
  ];

  return (
    <section className="w-full py-24 bg-white" aria-label="روش یادگیری میمو">
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Route className="w-8 h-8 text-primary" aria-hidden="true" />
            <h2 className="text-4xl font-black text-text-charcoal">
              بهترین شیوه یادگیری زبان ایتالیایی
            </h2>
          </div>
          <p className="text-text-gray text-lg">
            مسیر هوشمند و ساختاریافته برای رسیدن به تسلط کامل
          </p>
        </div>

        {/* Roadmap Container - Desktop Layout */}
        <div className="grid lg:flex lg:justify-center gap-8 items-center mx-auto max-w-7xl relative">
          
           {/* Right Features - Hidden on mobile, visible on desktop */}
           <div className="hidden lg:grid lg:grid-cols-2 gap-4" role="list">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article
                  key={index}
                  className="text-[#583d01] flex flex-col justify-end aspect-[1.5/1] bg-gradient-to-br from-gradient-yellow to-white rounded-2xl p-6 border border-neutral-extralight shadow-sm hover:shadow-md transition-all duration-300"
                  role="listitem"
                >
                  <Icon className="w-10 h-10 mb-3 text-[#583d01]" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-[#583d01] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#583d01]">{feature.description}</p>
                </article>
              );
            })}
          </div>

          {/* Left - Roadmap SVG */}
          <div className=" lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md mx-auto">
              {/* Decorative Background Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-purple rounded-full opacity-20 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-yellow rounded-full opacity-20 blur-2xl" />
              
              {/* SVG Roadmap */}
              <div className="relative z-10 p-4">
                <Image
                  src="/roadmap.svg"
                  alt="نمودار مسیر یادگیری زبان ایتالیایی در میمو آکادمی"
                  width={400}
                  height={600}
                  className="w-full h-auto"
                  priority
                  loading="eager"
                quality={75}
                />
              </div>
            </div>
          </div>

         

          {/* Left Decorative Visual Elements - Hidden on mobile */}
            {/* Floating Gradient Orb 1 */}
            <div className=" hidden lg:block absolute top-0 -left-2 w-48 h-48 bg-gradient-to-br from-primary via-secondary to-gradient-purple rounded-full opacity-20 blur-3xl animate-pulse" />
            
            {/* Floating Gradient Orb 2 */}
            <div className="absolute top-32 right-0 w-56 h-56 bg-gradient-to-br from-gradient-yellow via-gradient-purple to-primary rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            
            {/* Floating Gradient Orb 3 */}
            <div className=" hidden lg:block absolute bottom-20 left-6 w-44 h-44 bg-gradient-to-br from-secondary via-primary to-gradient-yellow rounded-full opacity-25 blur-3xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }} />
            
            {/* Abstract Geometric Shapes */}
            <div className=" hidden lg:block absolute top-20 left-8 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl rotate-12 animate-bounce" style={{ animationDuration: '6s' }} />
            
            <div className="absolute top-64 right-12 w-24 h-24 bg-gradient-to-br from-gradient-yellow/15 to-gradient-purple/15 rounded-2xl -rotate-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '7s' }} />
            
            <div className=" hidden lg:block absolute bottom-32 left-12 w-28 h-28 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }} />
            
            {/* Gradient Lines/Streaks */}
            <div className=" hidden lg:block absolute top-40 left-4 w-2 h-32 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
            
            <div className="absolute top-56 right-16 w-2 h-40 bg-gradient-to-b from-secondary/0 via-secondary/30 to-secondary/0 rounded-full animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
            
            <div className=" hidden lg:block absolute bottom-40 left-16 w-2 h-36 bg-gradient-to-b from-gradient-yellow/0 via-gradient-yellow/30 to-gradient-yellow/0 rounded-full animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '4s' }} />
            
            {/* Rotating Rings */}
            <div className=" hidden lg:block absolute top-48 left-10">
              <div className="w-40 h-40 border-4 border-primary/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute inset-4 border-4 border-secondary/10 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                  <div className="absolute inset-4 border-4 border-gradient-purple/10 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                </div>
              </div>
            </div>
            
            {/* Sparkle/Star Elements */}
            <div className="absolute top-12 right-20 w-3 h-3 bg-primary rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute top-72 left-4 w-2 h-2 bg-secondary rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }} />
            <div className="absolute bottom-24 right-24 w-4 h-4 bg-gradient-yellow rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
            
            {/* Floating Squares with Gradients */}
            <div className="absolute top-16 right-8 w-16 h-16">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-lg transform rotate-45 animate-pulse" style={{ animationDuration: '4s' }} />
            </div>
            
            <div className="absolute bottom-48 left-2 w-20 h-20">
              <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-transparent rounded-lg transform -rotate-45 animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }} />
            </div>
            
            {/* Wave-like Gradient Effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary/10 to-transparent rounded-full blur-2xl" />
            </div>
          </div>

        {/* Mobile Features - Show only on mobile */}
        <div className="lg:hidden mt-4 grid grid-cols-2 gap-4" role="list">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={index}
                className="bg-gradient-to-br from-gradient-yellow to-white rounded-xl p-4 text-center border border-neutral-extralight shadow-sm"
                role="listitem"
              >
                <Icon className="w-8 h-8 mb-2 mx-auto text-[#583d01]" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text-charcoal mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-gray">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

