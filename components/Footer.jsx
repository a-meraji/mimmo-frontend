"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Send, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "صفحه اصلی", href: "/" },
    { label: "دوره‌ها", href: "/learn" },
    { label: "آزمون‌ها", href: "/exam" },
    { label: "فروشگاه", href: "/store" },
  ];

  const supportLinks = [
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
    { label: "سوالات متداول", href: "/faq" },
    { label: "قوانین و مقررات", href: "/terms" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "اینستاگرام", color: "hover:text-pink-400" },
    { icon: Send, href: "https://t.me", label: "تلگرام", color: "hover:text-blue-400" },
    { icon: Youtube, href: "https://youtube.com", label: "یوتیوب", color: "hover:text-red-400" },
  ];

  return (
    <footer id="main-footer" className="bg-[#17192c] text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/mimmo-logo.webp"
                  alt="MIMMO Academy"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">میمو آکادمی</h3>
            </div>
            <p className="text-[#A9ACC1] text-sm leading-relaxed">
              آکادمی آموزش زبان ایتالیایی و آیین نامه گواهینامه رانندگی در ایتالیا با بیش از 8 سال تجربه
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
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
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-3">
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
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-3">
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
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@mimmo.academy"
                  className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
                >
                  info@mimmo.academy
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+989123456789"
                  className="text-[#A9ACC1] hover:text-white transition-colors duration-200 text-sm"
                >
                  ۰۹۱۲-۳۴۵-۶۷۸۹
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#A9ACC1] flex-shrink-0 mt-0.5" />
                <span className="text-[#A9ACC1] text-sm leading-relaxed">
                  تهران، خیابان ولیعصر، پلاک ۱۲۳
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A9ACC1] text-sm text-center md:text-right">
              © {currentYear} MIMMO Academy. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6">
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

