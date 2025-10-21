import localFont from "next/font/local";

// Kalameh font with all weights
export const kalameh = localFont({
  src: [
    {
      path: "../fonts/kalameh/KalamehWeb-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../fonts/kalameh/KalamehWeb-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-kalameh",
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

