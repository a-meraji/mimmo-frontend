import { kalameh } from "./fonts";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import CartModal from "@/components/cart/CartModal";
import ToastContainer from "@/components/toast/ToastContainer";

export const metadata = {
  metadataBase: new URL('https://mimmo.academy'),
  title: {
    default: "میمو آکادمی | آموزش زبان ایتالیایی و گواهینامه رانندگی ایتالیا",
    template: "%s | میمو آکادمی"
  },
  description: "آکادمی میمو با بیش از 8 سال تجربه، بهترین پلتفرم آموزش آنلاین زبان ایتالیایی و آیین نامه گواهینامه رانندگی در ایتالیا. دوره‌های جامع، آزمون‌های تعاملی و پشتیبانی مستمر.",
  keywords: ["آموزش زبان ایتالیایی", "گواهینامه رانندگی ایتالیا", "آیین نامه رانندگی ایتالیا", "میمو آکادمی", "آموزش آنلاین ایتالیایی", "دوره زبان ایتالیایی", "MIMMO Academy"],
  authors: [{ name: "MIMMO Academy" }],
  creator: "MIMMO Academy",
  publisher: "MIMMO Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://mimmo.academy",
    siteName: "میمو آکادمی",
    title: "میمو آکادمی | آموزش زبان ایتالیایی و گواهینامه رانندگی ایتالیا",
    description: "آکادمی میمو با بیش از 8 سال تجربه، بهترین پلتفرم آموزش آنلاین زبان ایتالیایی و آیین نامه گواهینامه رانندگی در ایتالیا",
    images: [
      {
        url: "/mimmo.webp",
        width: 1200,
        height: 630,
        alt: "میمو آکادمی - آموزش زبان ایتالیایی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "میمو آکادمی | آموزش زبان ایتالیایی",
    description: "بهترین پلتفرم آموزش آنلاین زبان ایتالیایی و گواهینامه رانندگی ایتالیا",
    images: ["/mimmo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/mimmo-logo.webp",
    apple: "/mimmo-logo.webp",
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#17192c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${kalameh.variable} antialiased font-sans`}>
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="pb-24" id="main-content">
              {children}
            </main>
            <Footer />
            <BottomNav />
            <CartModal />
            <ToastContainer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
