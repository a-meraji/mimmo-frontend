export default function DownloadCard({ platform, downloadUrl }) {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case "mac":
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      case "ios":
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M9 18h6M12 21v-3"/>
          </svg>
        );
      case "android":
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.5 11.5 0 0 0-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 11.16 3.5 13.84 3.5 16.5h17c0-2.66-1.3-5.34-2.9-7.02zM7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        );
      case "windows":
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5.5L10.5 4.5V11.5H3V5.5M10.5 12.5V19.5L3 18.5V12.5H10.5M11.5 4.28L21 3V11.5H11.5V4.28M21 12.5V21L11.5 19.72V12.5H21Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.5 11.5 0 0 0-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.8 11.16 3.5 13.84 3.5 16.5h17c0-2.66-1.3-5.34-2.9-7.02zM7 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        );
    }
  };

  const getPlatformLabel = () => {
    switch (platform.toLowerCase()) {
      case "mac":
        return "نسخه Mac";
      case "ios":
        return "نسخه iOS";
      case "android":
        return "نسخه اندروید";
      case "windows":
        return "نسخه ویندوز";
      default:
        return platform;
    }
  };

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-2xl p-6 border border-neutral-lighter shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-[4.5rem] h-[4.5rem] rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-text-muted group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
          {getIcon()}
        </div>

        {/* Platform Label */}
        <div>
          <h3 className="font-bold text-text-charcoal text-lg mb-1">دانلود</h3>
          <p className="text-sm text-text-gray">{getPlatformLabel()}</p>
        </div>
      </div>
    </a>
  );
}

