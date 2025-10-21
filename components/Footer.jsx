"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Send, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const quickLinks = useMemo(() => [
    { label: "صفحه اصلی", href: "/" },
    { label: "دوره‌ها", href: "/learn" },
    { label: "آزمون‌ها", href: "/exam" },
    { label: "فروشگاه", href: "/store" },
  ], []);

  const supportLinks = useMemo(() => [
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
    { label: "سوالات متداول", href: "/faq" },
    { label: "قوانین و مقررات", href: "/terms" },
  ], []);

  const socialLinks = useMemo(() => [
    { icon: Instagram, href: "https://instagram.com/italian4u.italian4u", label: "اینستاگرام", color: "hover:text-pink-400" },
    { icon: Send, href: "https://t.me/mimmo_academy", label: "تلگرام", color: "hover:text-blue-400" },
    { icon: Youtube, href: "https://youtube.com/@italian4u", label: "یوتیوب", color: "hover:text-red-400" },
  ], []);

  return (
    <footer id="main-footer" className="bg-[#17192c] text-white" role="contentinfo" aria-label="فوتر سایت">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/mimmo-logo.webp"
                  alt="لوگوی میمو آکادمی"
                  fill
                  className="object-contain"
                  loading="lazy"
                  quality={85}
                  sizes="48px"
                />
              </div>
              <h2 className="text-2xl font-bold">میمو آکادمی</h2>
            </div>
            <p className="text-[#A9ACC1] text-sm leading-relaxed">
              آکادمی آموزش زبان ایتالیایی و آیین نامه گواهینامه رانندگی در ایتالیا با بیش از 8 سال تجربه
            </p>
            
            {/* Social Links */}
            <nav className="flex gap-3 pt-2" aria-label="شبکه های اجتماعی">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-white/20`}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="دسترسی سریع">
            <h3 className="text-lg font-bold mb-4">دسترسی سریع</h3>
            <ul className="space-y-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="پشتیبانی">
            <h3 className="text-lg font-bold mb-4">پشتیبانی</h3>
            <ul className="space-y-3" role="list">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <address className="not-italic">
            <h3 className="text-lg font-bold mb-4">تماس با ما</h3>
            <ul className="space-y-4" role="list">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href="mailto:info@mimmo.academy"
                  className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
                  aria-label="ایمیل: info@mimmo.academy"
                >
                  info@mimmo.academy
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <a
                  href="tel:+989123456789"
                  className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
                  aria-label="تلفن: ۰۹۱۲-۳۴۵-۶۷۸۹"
                >
                  ۰۹۱۲-۳۴۵-۶۷۸۹
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-[#A9ACC1] text-sm leading-relaxed">
                  تهران، خیابان ولیعصر، پلاک ۱۲۳
                </span>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A9ACC1] text-sm text-center md:text-right">
              © {currentYear} میمو آکادمی. تمامی حقوق محفوظ است.
            </p>
            <nav className="flex items-center gap-6" aria-label="لینک های قانونی">
              <Link
                href="/privacy"
                className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
              >
                حریم خصوصی
              </Link>
              <Link
                href="/terms"
                className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
              >
                شرایط استفاده
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

