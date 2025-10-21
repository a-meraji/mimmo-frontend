"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import StoreHero from "@/components/store/StoreHero";
import StoreFilters from "@/components/store/StoreFilters";
import StorePackageCard from "@/components/store/StorePackageCard";

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Package data
  const packages = useMemo(() => [
    {
      id: 1,
      title: "Espresso 1 (درس‌های 1 تا 5)",
      subtitle: "شروع مسیر یادگیری زبان ایتالیایی",
      level: "A1",
      lessons: 5,
      price: 450000,
      originalPrice: 600000,
      image: "/license0.webp",
      category: "italian",
      features: [
        "ویدیوهای آموزشی با کیفیت بالا",
        "تمرینات تعاملی و کوئیز",
        "پشتیبانی آنلاین استاد"
      ]
    },
    {
      id: 2,
      title: "Espresso 1 (درس‌های 6 تا 10)",
      subtitle: "ادامه سطح مقدماتی",
      level: "A1",
      lessons: 5,
      price: 450000,
      originalPrice: 600000,
      image: "/license1.webp",
      category: "italian",
      features: [
        "تکمیل سطح A1",
        "آزمون‌های تعاملی",
        "دسترسی مادام‌العمر"
      ]
    },
    {
      id: 3,
      title: "Full Espresso 1",
      subtitle: "پکیج کامل سطح مقدماتی",
      level: "A1",
      lessons: 10,
      price: 750000,
      originalPrice: 1200000,
      image: "/license2.webp",
      category: "italian",
      badge: "پرفروش",
      features: [
        "تمام درس‌های Espresso 1",
        "20٪ تخفیف ویژه",
        "گواهینامه معتبر پایان دوره"
      ]
    },
    {
      id: 4,
      title: "Espresso 2 (درس‌های 1 تا 5)",
      subtitle: "ارتقا به سطح متوسط",
      level: "A2",
      lessons: 5,
      price: 500000,
      originalPrice: 650000,
      image: "/license0.webp",
      category: "italian",
      features: [
        "گرامر پیشرفته‌تر",
        "مکالمات کاربردی",
        "تمرینات گوش دادن"
      ]
    },
    {
      id: 5,
      title: "Espresso 2 (درس‌های 6 تا 10)",
      subtitle: "تکمیل سطح A2",
      level: "A2",
      lessons: 5,
      price: 500000,
      originalPrice: 650000,
      image: "/license1.webp",
      category: "italian",
      features: [
        "تسلط بر مکالمات روزمره",
        "واژگان گسترده",
        "آزمون‌های جامع"
      ]
    },
    {
      id: 6,
      title: "Full Espresso 2",
      subtitle: "پکیج کامل سطح متوسط",
      level: "A2",
      lessons: 10,
      price: 850000,
      originalPrice: 1300000,
      image: "/license2.webp",
      category: "italian",
      badge: "پیشنهاد ویژه",
      features: [
        "تمام درس‌های Espresso 2",
        "تخفیف 35٪",
        "پروژه‌های عملی"
      ]
    },
    {
      id: 7,
      title: "Espresso 3 (درس‌های 1 تا 5)",
      subtitle: "سطح پیشرفته",
      level: "B1",
      lessons: 5,
      price: 550000,
      originalPrice: 700000,
      image: "/license0.webp",
      category: "italian",
      features: [
        "مکالمات پیچیده",
        "درک متن‌های تخصصی",
        "نگارش متون ساده"
      ]
    },
    {
      id: 8,
      title: "Espresso 3 (درس‌های 6 تا 10)",
      subtitle: "تکمیل سطح B1",
      level: "B1",
      lessons: 5,
      price: 550000,
      originalPrice: 700000,
      image: "/license1.webp",
      category: "italian",
      features: [
        "تسلط کامل بر زبان",
        "آمادگی برای آزمون‌های بین‌المللی",
        "مکالمات تخصصی"
      ]
    },
    {
      id: 9,
      title: "Full Espresso 3",
      subtitle: "پکیج کامل سطح پیشرفته",
      level: "B1",
      lessons: 10,
      price: 950000,
      originalPrice: 1400000,
      image: "/license2.webp",
      category: "italian",
      badge: "محبوب",
      features: [
        "تمام درس‌های Espresso 3",
        "32٪ تخفیف",
        "گواهینامه بین‌المللی"
      ]
    },
    {
      id: 10,
      title: "پکیج گواهینامه رانندگی ایتالیا",
      subtitle: "آموزش کامل آیین نامه رانندگی",
      level: null,
      lessons: 40,
      price: 650000,
      originalPrice: 900000,
      image: "/mimmo1.webp",
      category: "license",
      badge: "جدید",
      features: [
        "آموزش کامل قوانین رانندگی ایتالیا",
        "بانک سوالات کامل آزمون",
        "آزمون‌های شبیه‌سازی شده",
        "پشتیبانی تا زمان قبولی"
      ]
    }
  ], []);

  // Filter packages
  const filteredPackages = useMemo(() => {
    let filtered = packages;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(pkg => pkg.category === activeCategory);
    }

    // Filter by level
    if (activeLevel !== 'all') {
      filtered = filtered.filter(pkg => pkg.level === activeLevel);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.title.toLowerCase().includes(query) ||
        pkg.subtitle?.toLowerCase().includes(query) ||
        pkg.features?.some(feature => feature.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, activeLevel, searchQuery, packages]);

  const handleAddToCart = useCallback((packageId) => {
    setCart(prev => {
      if (prev.includes(packageId)) {
        return prev;
      }
      return [...prev, packageId];
    });
    // TODO: Implement actual cart logic
    console.log('Added to cart:', packageId);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    // Reset level filter when changing category
    if (category === 'license') {
      setActiveLevel('all');
    }
  }, []);

  const handleLevelChange = useCallback((level) => {
    setActiveLevel(level);
  }, []);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <StoreHero />

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-12">
        {/* Filters */}
        <div className="mb-8">
          <StoreFilters 
            activeCategory={activeCategory}
            activeLevel={activeLevel}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onLevelChange={handleLevelChange}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-text-gray text-sm">
            {filteredPackages.length === 0 ? (
              'هیچ دوره‌ای یافت نشد'
            ) : (
              <>نمایش <span className="font-bold text-primary">{filteredPackages.length}</span> دوره</>
            )}
          </p>
          {filteredPackages.length > 0 && (
            <p className="text-text-light text-xs">
              {packages.length} دوره موجود
            </p>
          )}
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPackages.map((pkg) => (
            <StorePackageCard
              key={pkg.id}
              {...pkg}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-neutral-indigo rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-text-light" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-text-charcoal mb-2">
                دوره‌ای یافت نشد
              </h3>
              <p className="text-text-gray mb-6">
                {searchQuery 
                  ? `نتیجه‌ای برای "${searchQuery}" پیدا نشد` 
                  : 'لطفاً فیلترهای دیگری را امتحان کنید'}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveLevel('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                type="button"
              >
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

