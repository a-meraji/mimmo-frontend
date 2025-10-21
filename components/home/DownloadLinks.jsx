import DownloadCard from "./DownloadCard";

export default function DownloadLinks() {
  const platforms = [
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
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-neutral-indigo to-white relative overflow-hidden">
      {/* Decorative Background Elements for Desktop */}
      <div className="hidden lg:block absolute top-10 left-10 w-64 h-64 bg-gradient-purple rounded-full opacity-10 blur-3xl" />
      <div className="hidden lg:block absolute bottom-10 right-10 w-80 h-80 bg-gradient-yellow rounded-full opacity-10 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-text-charcoal text-center mb-12">
          دانلود اپلیکیشن میمو
        </h2>

        {/* Desktop Layout - Creative Horizontal with Stagger */}
        <div className="hidden lg:flex items-center justify-center gap-6 max-w-6xl mx-auto">
          {platforms.map((platform, index) => (
            <div
              key={platform.platform}
              className={`flex-shrink-0 w-64 ${
                index % 2 === 0 ? "mt-0" : "mt-8"
              }`}
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
        </div>

        {/* Mobile Layout - 2x2 Grid */}
        <div className="lg:hidden grid grid-cols-2 gap-4 max-w-md mx-auto">
          {platforms.map((platform) => (
            <DownloadCard
              key={platform.platform}
              platform={platform.platform}
              downloadUrl={platform.downloadUrl}
            />
          ))}
        </div>

        {/* Subtitle */}
        <p className="text-center mt-8 text-text-gray  text-lg font-medium">
          دسترسی به میمو در همه جا - موبایل، تبلت و کامپیوتر
        </p>
      </div>
    </section>
  );
}

