import Link from 'next/link';
import { Home, ArrowRight, Search, ShoppingBag, Info, Phone, User, GraduationCap, ChevronLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-extralight to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number - Artistic */}
        <div className="relative mb-8">
          <div className="text-[180px] md:text-[240px] font-bold text-primary/5 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg">
              <Search className="w-16 h-16 text-primary/40 mx-auto" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
            صفحه‌ای که دنبالش می‌گردی پیدا نشد!
          </h1>
          <p className="text-lg text-text-gray max-w-md mx-auto leading-relaxed">
            ممکنه لینک اشتباه باشه یا این صفحه دیگه وجود نداشته باشه. 
            نگران نباش، می‌تونی از لینک‌های زیر استفاده کنی.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/"
            className="group flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            <span>بازگشت به خانه</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/store"
            className="group flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all duration-200 w-full sm:w-auto justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>مشاهده پکیج‌ها</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Quick Links */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-light/50 shadow-sm">
          <h2 className="text-sm font-semibold text-text-gray mb-4 uppercase tracking-wider">
            لینک‌های پرکاربرد
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <Home className="w-4 h-4 flex-shrink-0" />
              <span>صفحه اصلی</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/store"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span>فروشگاه</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/about"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>درباره ما</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>تماس با ما</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/profile"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span>پروفایل من</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/lessons"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <GraduationCap className="w-4 h-4 flex-shrink-0" />
              <span>دروس من</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/faq"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <span>سوالات متداول</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/blog"
              className="group flex items-center gap-2 text-sm text-text-dark hover:text-primary font-medium py-3 px-4 rounded-lg hover:bg-primary/5 transition-all duration-200 hover:scale-105"
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>وبلاگ</span>
              <ChevronLeft className="w-3 h-3 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

