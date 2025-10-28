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

  // Package data - Same structure as ProductInfo.jsx
  const packages = useMemo(() => [
    {
      id: 1,
      title: "Espresso 1 (درس‌های 1 تا 5)",
      subtitle: "شروع مسیر یادگیری زبان ایتالیایی",
      level: "A1",
      price: 450000,
      originalPrice: 600000,
      image: "/es1.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۴ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}
      ]
    },
    {
      id: 2,
      title: "Espresso 1 (درس‌های 6 تا 10)",
      subtitle: "ادامه سطح مقدماتی",
      level: "A1",
      price: 450000,
      image: "/es1.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۱ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 3,
      title: "Full Espresso 1",
      subtitle: "پکیج کامل سطح مقدماتی",
      level: "A1",
      price: 750000,
      originalPrice: 1200000,
      image: "/es1.webp",
      category: "italian",
      badge: "پرفروش",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۱۰ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۲ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 4,
      title: "Espresso 2 (درس‌های 1 تا 5)",
      subtitle: "ارتقا به سطح متوسط",
      level: "A2",
      price: 500000,
      image: "/es2.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۲۰ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 5,
      title: "Espresso 2 (درس‌های 6 تا 10)",
      subtitle: "تکمیل سطح A2",
      level: "A2",
      price: 500000,
      image: "/es2.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۶ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 6,
      title: "Full Espresso 2",
      subtitle: "پکیج کامل سطح متوسط",
      level: "A2",
      price: 850000,
      originalPrice: 1300000,
      image: "/es2.webp",
      category: "italian",
      badge: "پرفروش",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۱۰ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۴ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 7,
      title: "Espresso 3 (درس‌های 1 تا 5)",
      subtitle: "سطح پیشرفته",
      level: "B1",
      price: 550000,
      image: "/es3.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۸ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 8,
      title: "Espresso 3 (درس‌های 6 تا 10)",
      subtitle: "تکمیل سطح B1",
      level: "B1",
      price: 550000,
      image: "/es3.webp",
      category: "italian",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۵ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۸ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 9,
      title: "Full Espresso 3",
      subtitle: "پکیج کامل سطح پیشرفته",
      level: "B1",
      price: 950000,
      originalPrice: 1400000,
      image: "/es3.webp",
      category: "italian",
      badge: "پرفروش",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۱۰ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۱۶ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}

      ]
    },
    {
      id: 10,
      title: "پکیج گواهینامه رانندگی ایتالیا",
      subtitle: "آموزش کامل آیین نامه رانندگی",
      level: null,
      price: 650000,
      originalPrice: 900000,
      image: "/license2.webp",
      category: "license",
      badge: "پرفروش",
      specifications: [
        { icon: "BookOpenText", label: "تعداد درس", value: "۴۰ درس" },
        { icon: "Clock", label: "مدت زمان", value: "۲۰ ساعت" },
        {icon:"NotebookText", label:"تمرین و آزمون", value: "دارد"}
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
    <div className="min-h-screen bg-white relative">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" aria-hidden="true" />
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
            id={pkg.id}
            title={pkg.title}
            subtitle={pkg.subtitle}
            level={pkg.level}
            price={pkg.price}
            originalPrice={pkg.originalPrice}
            image={pkg.image}
            specifications={pkg.specifications}
            badge={pkg.badge}
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

