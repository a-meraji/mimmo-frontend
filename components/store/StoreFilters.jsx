"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Layers, BookOpen, Car, ChevronDown, X } from "lucide-react";

export default function StoreFilters({ 
  activeCategory, 
  activeLevel, 
  searchQuery,
  onCategoryChange, 
  onLevelChange,
  onSearchChange 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = useMemo(() => [
    { id: 'all', label: 'همه دوره‌ها', icon: Layers },
    { id: 'italian', label: 'زبان ایتالیایی', icon: BookOpen },
    { id: 'license', label: 'گواهینامه رانندگی', icon: Car },
  ], []);

  const levels = useMemo(() => [
    { id: 'all', label: 'همه سطوح' },
    { id: 'A1', label: 'A1' },
    { id: 'A2', label: 'A2' },
    { id: 'B1', label: 'B1' },
  ], []);

  const activeCategoryData = useMemo(
    () => categories.find(c => c.id === activeCategory),
    [activeCategory, categories]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full space-y-6" role="search" aria-label="جستجو و فیلتر دوره‌ها">
      {/* Search and Category Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category Dropdown */}
        <div className="relative sm:w-64" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 border-neutral-lighter bg-white text-text-charcoal hover:border-primary/30 focus:border-primary focus:outline-none transition-all duration-200"
            aria-label="انتخاب دسته‌بندی"
            aria-expanded={isDropdownOpen}
            type="button"
          >
            <div className="flex items-center gap-2">
              {activeCategoryData && (
                <>
                  <activeCategoryData.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-medium">{activeCategoryData.label}</span>
                </>
              )}
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-text-light transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border-2 border-neutral-lighter shadow-xl z-50 overflow-hidden">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-right transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-gray hover:bg-neutral-indigo'
                    }`}
                    type="button"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span className="text-sm font-medium">{category.label}</span>
                    {isActive && (
                      <div className="mr-auto w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="relative group">
            <Search 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light group-focus-within:text-primary transition-colors" 
              aria-hidden="true" 
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجوی دوره..."
              className="w-full pr-12 pl-12 py-3.5 rounded-2xl border-2 border-neutral-lighter bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-sm"
              aria-label="جستجوی دوره"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-charcoal transition-colors"
                aria-label="پاک کردن جستجو"
                type="button"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Level Filter - Only show for Italian category */}
      {(activeCategory === 'italian' || activeCategory === 'all') && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-charcoal pr-1">سطح آموزشی</h3>
          
          {/* Mobile & Desktop: Same Layout */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => {
              const isActive = activeLevel === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => onLevelChange(level.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                    isActive
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-white text-text-gray border-neutral-lighter hover:border-primary/30 hover:shadow-md'
                  }`}
                  aria-label={`سطح ${level.label}`}
                  aria-current={isActive ? 'true' : undefined}
                  type="button"
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(activeCategory !== 'all' || activeLevel !== 'all' || searchQuery) && (
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-lighter">
          <span className="text-xs text-text-gray">فیلترهای فعال:</span>
          <div className="flex flex-wrap gap-2">
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {categories.find(c => c.id === activeCategory)?.label}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label="حذف فیلتر دسته‌بندی"
                  type="button"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            )}
            {activeLevel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                سطح {activeLevel}
                <button
                  onClick={() => onLevelChange('all')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label="حذف فیلتر سطح"
                  type="button"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  aria-label="حذف جستجو"
                  type="button"
                >
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

