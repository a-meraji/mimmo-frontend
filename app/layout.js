import { kalameh } from "./fonts";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "MIMMO Academy",
  description: "MIMMO Academy - Learning Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${kalameh.variable} antialiased font-sans`}>
        <Header />
        <main className="pb-24">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
