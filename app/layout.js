import { kalameh } from "./fonts";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
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
  // If NEXT_PUBLIC_IS_DEVELOPING is set (string 'true'), render a single
  // "Under development" page and do not render the rest of the app.
  // Using process.env here is fine because Next injects NEXT_PUBLIC_* vars
  // into both server and client environments. We treat any truthy value of
  // the env var (commonly 'true') as enabling the development banner.
  if (process.env.NEXT_PUBLIC_IS_DEVELOPING === 'true' || process.env.NEXT_PUBLIC_IS_DEVELOPING === '1') {
    return (
      <html lang="fa" dir="rtl">
        <body className={`${kalameh.variable} antialiased font-sans bg-gray-50 text-gray-900 flex items-center justify-center h-screen`}> 
          <div className="max-w-xl text-center p-6">
            {/* Lucid-style alert SVG */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h1 className="text-2xl font-semibold mb-2">در حال توسعه</h1>
            <p className="text-gray-600">این سایت در حال حاضر در دست توسعه است. لطفاً بعداً بازگردید.</p>
            <p className="text-gray-600 mt-۲">تغییرات زیادی در راه است ...</p>
          </div>
        </body>
      </html>
    );
  }
  return (
    <html lang="fa" dir="rtl">
      <body className={`${kalameh.variable} antialiased font-sans`}>
        <ToastProvider>
          <AuthProvider>
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
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
