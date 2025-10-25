"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

// Popular countries and their codes
const COUNTRIES = [
  { code: '+98', name: 'ایران', flag: '🇮🇷', nameEn: 'Iran' },
  { code: '+1', name: 'ایالات متحده', flag: '🇺🇸', nameEn: 'United States' },
  { code: '+44', name: 'انگلستان', flag: '🇬🇧', nameEn: 'United Kingdom' },
  { code: '+49', name: 'آلمان', flag: '🇩🇪', nameEn: 'Germany' },
  { code: '+33', name: 'فرانسه', flag: '🇫🇷', nameEn: 'France' },
  { code: '+39', name: 'ایتالیا', flag: '🇮🇹', nameEn: 'Italy' },
  { code: '+34', name: 'اسپانیا', flag: '🇪🇸', nameEn: 'Spain' },
  { code: '+90', name: 'ترکیه', flag: '🇹🇷', nameEn: 'Turkey' },
  { code: '+971', name: 'امارات', flag: '🇦🇪', nameEn: 'UAE' },
  { code: '+966', name: 'عربستان', flag: '🇸🇦', nameEn: 'Saudi Arabia' },
  { code: '+964', name: 'عراق', flag: '🇮🇶', nameEn: 'Iraq' },
  { code: '+93', name: 'افغانستان', flag: '🇦🇫', nameEn: 'Afghanistan' },
  { code: '+92', name: 'پاکستان', flag: '🇵🇰', nameEn: 'Pakistan' },
  { code: '+7', name: 'روسیه', flag: '🇷🇺', nameEn: 'Russia' },
  { code: '+86', name: 'چین', flag: '🇨🇳', nameEn: 'China' },
  { code: '+81', name: 'ژاپن', flag: '🇯🇵', nameEn: 'Japan' },
  { code: '+82', name: 'کره جنوبی', flag: '🇰🇷', nameEn: 'South Korea' },
  { code: '+91', name: 'هند', flag: '🇮🇳', nameEn: 'India' },
  { code: '+61', name: 'استرالیا', flag: '🇦🇺', nameEn: 'Australia' },
  { code: '+55', name: 'برزیل', flag: '🇧🇷', nameEn: 'Brazil' },
  { code: '+52', name: 'مکزیک', flag: '🇲🇽', nameEn: 'Mexico' },
  { code: '+54', name: 'آرژانتین', flag: '🇦🇷', nameEn: 'Argentina' },
  { code: '+20', name: 'مصر', flag: '🇪🇬', nameEn: 'Egypt' },
  { code: '+27', name: 'آفریقای جنوبی', flag: '🇿🇦', nameEn: 'South Africa' },
  { code: '+212', name: 'مراکش', flag: '🇲🇦', nameEn: 'Morocco' },
  { code: '+213', name: 'الجزایر', flag: '🇩🇿', nameEn: 'Algeria' },
  { code: '+216', name: 'تونس', flag: '🇹🇳', nameEn: 'Tunisia' },
  { code: '+31', name: 'هلند', flag: '🇳🇱', nameEn: 'Netherlands' },
  { code: '+32', name: 'بلژیک', flag: '🇧🇪', nameEn: 'Belgium' },
  { code: '+41', name: 'سوئیس', flag: '🇨🇭', nameEn: 'Switzerland' },
  { code: '+43', name: 'اتریش', flag: '🇦🇹', nameEn: 'Austria' },
  { code: '+45', name: 'دانمارک', flag: '🇩🇰', nameEn: 'Denmark' },
  { code: '+46', name: 'سوئد', flag: '🇸🇪', nameEn: 'Sweden' },
  { code: '+47', name: 'نروژ', flag: '🇳🇴', nameEn: 'Norway' },
  { code: '+351', name: 'پرتغال', flag: '🇵🇹', nameEn: 'Portugal' },
  { code: '+353', name: 'ایرلند', flag: '🇮🇪', nameEn: 'Ireland' },
  { code: '+358', name: 'فنلاند', flag: '🇫🇮', nameEn: 'Finland' },
  { code: '+420', name: 'چک', flag: '🇨🇿', nameEn: 'Czech Republic' },
  { code: '+48', name: 'لهستان', flag: '🇵🇱', nameEn: 'Poland' },
  { code: '+30', name: 'یونان', flag: '🇬🇷', nameEn: 'Greece' },
  { code: '+380', name: 'اوکراین', flag: '🇺🇦', nameEn: 'Ukraine' },
  { code: '+994', name: 'آذربایجان', flag: '🇦🇿', nameEn: 'Azerbaijan' },
  { code: '+995', name: 'گرجستان', flag: '🇬🇪', nameEn: 'Georgia' },
  { code: '+374', name: 'ارمنستان', flag: '🇦🇲', nameEn: 'Armenia' },
  { code: '+996', name: 'قرقیزستان', flag: '🇰🇬', nameEn: 'Kyrgyzstan' },
  { code: '+998', name: 'ازبکستان', flag: '🇺🇿', nameEn: 'Uzbekistan' },
  { code: '+992', name: 'تاجیکستان', flag: '🇹🇯', nameEn: 'Tajikistan' },
  { code: '+993', name: 'ترکمنستان', flag: '🇹🇲', nameEn: 'Turkmenistan' },
  { code: '+60', name: 'مالزی', flag: '🇲🇾', nameEn: 'Malaysia' },
  { code: '+62', name: 'اندونزی', flag: '🇮🇩', nameEn: 'Indonesia' },
  { code: '+63', name: 'فیلیپین', flag: '🇵🇭', nameEn: 'Philippines' },
  { code: '+65', name: 'سنگاپور', flag: '🇸🇬', nameEn: 'Singapore' },
  { code: '+66', name: 'تایلند', flag: '🇹🇭', nameEn: 'Thailand' },
  { code: '+84', name: 'ویتنام', flag: '🇻🇳', nameEn: 'Vietnam' },
];

export default function CountryCodeSelector({ value = '+98', onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get selected country
  const selectedCountry = useMemo(
    () => COUNTRIES.find(c => c.code === value) || COUNTRIES[0],
    [value]
  );

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    
    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      country =>
        country.name.includes(searchQuery) ||
        country.nameEn.toLowerCase().includes(query) ||
        country.code.includes(searchQuery)
    );
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle country selection
  const handleSelect = useCallback((country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearchQuery('');
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery('');
    }
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Country Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-3 border-2 rounded-xl
          transition-all duration-200
          ${disabled 
            ? 'bg-neutral-lighter border-neutral-gray cursor-not-allowed opacity-60' 
            : 'bg-white border-neutral-gray hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : ''}
        `}
        aria-label={`کد کشور: ${selectedCountry.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-2xl leading-none" aria-hidden="true">
          {selectedCountry.flag}
        </span>
        <span className="font-medium text-text-charcoal dir-ltr">
          {selectedCountry.code}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-text-gray transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label="انتخاب کد کشور"
        >
          {/* Search Input */}
          <div className="p-3 border-b border-neutral-lighter sticky top-0 bg-white">
            <div className="relative">
              <Search 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" 
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="جستجو..."
                className="w-full pr-10 pl-10 py-2 border border-neutral-gray rounded-lg
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                  text-sm transition-all duration-200"
                aria-label="جستجوی کشور"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-lighter rounded transition-colors"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-3 h-3 text-text-gray" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    transition-colors duration-150
                    ${country.code === value 
                      ? 'bg-primary/5 text-primary' 
                      : 'hover:bg-neutral-indigo/5 text-text-charcoal'
                    }
                  `}
                  role="option"
                  aria-selected={country.code === value}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {country.flag}
                  </span>
                  <div className="flex-1 text-right">
                    <div className="font-medium">{country.name}</div>
                    <div className="text-xs text-text-gray">{country.nameEn}</div>
                  </div>
                  <span 
                    className={`text-sm font-medium dir-ltr ${
                      country.code === value ? 'text-primary' : 'text-text-gray'
                    }`}
                  >
                    {country.code}
                  </span>
                  {country.code === value && (
                    <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-text-gray">
                <p className="text-sm">کشوری یافت نشد</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

