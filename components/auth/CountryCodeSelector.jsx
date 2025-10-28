"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES } from "@/constants/countries";
import Flag from "./Flag";

export default function CountryCodeSelector({
  value = "IR",
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get selected country by ISO code
  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.iso === value) || COUNTRIES[0],
    [value],
  );

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;

    const query = searchQuery.toLowerCase();
    return COUNTRIES.filter(
      (country) =>
        country.name.includes(searchQuery) ||
        country.nameEn.toLowerCase().includes(query) ||
        country.code.includes(searchQuery),
    );
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle country selection - returns ISO code
  const handleSelect = useCallback(
    (country) => {
      onChange(country.iso);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onChange],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  }, []);

  return (
    <div className="" ref={dropdownRef}>
      {/* Selected Country Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-3 border-2 rounded-xl
          transition-all duration-200
          ${disabled
            ? "bg-neutral-lighter border-neutral-extralight cursor-not-allowed opacity-60"
            : "bg-white border-neutral-extralight hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
          }
          ${isOpen ? "border-primary ring-2 ring-primary/20" : ""}
        `}
        aria-label={`کد کشور: ${selectedCountry.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex-shrink-0">
          <Flag countryCode={selectedCountry.iso} size="md" />
        </div>
        <span className="font-medium text-text-charcoal dir-ltr">
          {selectedCountry.code}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-gray transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
          <div className="p-3 border-b border-neutral-extralight sticky top-0 bg-white">
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
                className="w-full px-10 py-2 border border-neutral-extralight rounded-lg
                  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none
                  text-sm transition-all duration-200"
                aria-label="جستجوی کشور"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-neutral-lighter rounded transition-colors"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-3 h-3 text-text-charcoal" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.iso}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3
                    transition-colors duration-150
                    ${country.iso === value
                      ? "bg-primary/5 text-primary"
                      : "hover:bg-neutral-indigo/5 text-text-charcoal"
                    }
                  `}
                  role="option"
                  aria-selected={country.iso === value}
                >
                  <div className="flex-shrink-0">
                    <Flag countryCode={country.iso} size="sm" />
                  </div>

                  <div className="flex flex-col items-start gap-0.5">
                    <span className="text-sm font-medium text-text-charcoal">
                      {country.name} - {country.nameEn}
                    </span>
                    <span
                      className={`text-xs dir-ltr ${country.iso === value ? "text-primary font-medium" : "text-text-gray"
                        }`}
                    >
                      {country.code}
                    </span>
                  </div>
                  {country.iso === value && (
                    <div
                      className="mr-auto flex-shrink-0 w-2 h-2 rounded-full bg-primary"
                      aria-hidden="true"
                    />
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
