"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import StoreFilters from "./StoreFilters";
import StorePackageCard from "./StorePackageCard";

export default function StoreContent({ packages = [] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLevel, setActiveLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter packages
  const filteredPackages = useMemo(() => {
    let filtered = packages;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(pkg => {
        // Backend returns category as array, check if includes the active category
        const categories = pkg.category || [];
        return categories.includes(activeCategory);
      });
    }

    // Filter by level
    if (activeLevel !== 'all') {
      filtered = filtered.filter(pkg => pkg.level === activeLevel);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg => 
        pkg.packageName?.toLowerCase().includes(query) ||
        pkg.subtitle?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, activeLevel, searchQuery, packages]);

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
    <>
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
            packageName={pkg.packageName}
            subtitle={pkg.subtitle}
            level={pkg.level}
            originalPrice={pkg.originalPrice}
            discountedPrice={pkg.discountedPrice}
            imageUrl={pkg.imageUrl}
            specifications={pkg.specifications}
            badge={pkg.badge}
            category={pkg.category}
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
    </>
  );
}

