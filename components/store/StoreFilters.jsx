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
    <div className="w-full space-y-4" role="search" aria-label="جستجو و فیلتر دوره‌ها">
      {/* Search and Category Row */}
      <div className="flex flex-row flex-wrap gap-x-4 gap-y-6 sm:gap-x-6">
        {/* Search Input */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-text-gray pr-0.5">جستجو</h3>
          <div className="relative group">
            <Search 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light group-focus-within:text-primary transition-colors" 
              aria-hidden="true" 
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجو..."
              className="w-36 sm:w-52 pr-10 pl-10 py-2.5 rounded-xl border border-neutral-extralight bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-xs font-normal"
              aria-label="جستجوی دوره"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light hover:text-primary transition-colors"
                aria-label="پاک کردن جستجو"
                type="button"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-36 sm:w-52 space-y-2" ref={dropdownRef}>
          <h3 className="text-xs font-medium text-text-gray pr-0.5">دسته‌بندی</h3>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-neutral-extralight bg-white text-text-charcoal hover:border-primary/30 focus:border-primary focus:outline-none transition-all duration-200"
            aria-label="انتخاب دسته‌بندی"
            aria-expanded={isDropdownOpen}
            type="button"
          >
            <div className="flex items-center gap-1.5">
              {activeCategoryData && (
                <>
                  <activeCategoryData.icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-normal">{activeCategoryData.label}</span>
                </>
              )}
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-text-light transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-neutral-extralight shadow-lg z-50 overflow-hidden">
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
                    className={`w-full flex items-center gap-2 px-3 py-2 text-right transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary/5 text-primary font-medium'
                        : 'text-text-gray font-normal hover:bg-neutral-indigo'
                    }`}
                    type="button"
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-light'}`} aria-hidden="true" />
                    <span className="text-xs">{category.label}</span>
                    {isActive && (
                      <div className="mr-auto w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Level Filter - Only show for Italian category */}
        {(activeCategory === 'italian' || activeCategory === 'all') && (
          <div className=" space-y-2">
            <h3 className="text-xs font-medium text-text-gray pr-0.5">سطح آموزشی</h3>
            
            {/* Mobile & Desktop: Same Layout */}
            <div className="flex flex-wrap gap-1.5">
              {levels.map((level) => {
                const isActive = activeLevel === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => onLevelChange(level.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-200 border ${
                      isActive
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 font-medium'
                        : 'bg-white text-text-gray border-neutral-extralight hover:border-primary/30 hover:shadow-sm font-normal'
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
      </div>

     

      {/* Active Filters Summary */}
      {(activeCategory !== 'all' || activeLevel !== 'all' || searchQuery) && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-extralight">
          <span className="text-[10px] text-text-light font-normal">فعال:</span>
          <div className="flex flex-wrap gap-1">
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-normal border border-primary/20">
                {categories.find(c => c.id === activeCategory)?.label}
                <button
                  onClick={() => onCategoryChange('all')}
                  className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                  aria-label="حذف فیلتر دسته‌بندی"
                  type="button"
                >
                  <X className="w-2.5 h-2.5" aria-hidden="true" />
                </button>
              </span>
            )}
            {activeLevel !== 'all' && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-normal border border-primary/20">
                سطح {activeLevel}
                <button
                  onClick={() => onLevelChange('all')}
                  className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                  aria-label="حذف فیلتر سطح"
                  type="button"
                >
                  <X className="w-2.5 h-2.5" aria-hidden="true" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[10px] font-normal border border-primary/20">
                "{searchQuery}"
                <button
                  onClick={() => onSearchChange('')}
                  className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
                  aria-label="حذف جستجو"
                  type="button"
                >
                  <X className="w-2.5 h-2.5" aria-hidden="true" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

