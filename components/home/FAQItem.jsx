"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const buttonClasses = useMemo(() => 
    `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
      isOpen ? 'rotate-180 bg-primary text-white' : 'bg-primary/10 text-primary'
    }`,
    [isOpen]
  );

  return (
    <article 
      className="border border-neutral-lighter rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      role="listitem"
    >
      {/* Question Button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-right transition-colors duration-200 hover:bg-neutral-indigo/20"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question}`}
        type="button"
      >
        {/* Question Text */}
        <h3 className="text-base font-bold text-text-charcoal flex-1 pr-4">
          {question}
        </h3>

        {/* Chevron Icon */}
        <div className={buttonClasses} aria-hidden="true">
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* Answer Content */}
      <div
        id={`faq-answer-${question}`}
        ref={contentRef}
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        role="region"
        aria-hidden={!isOpen}
      >
        <div className="p-6 pt-0 text-text-gray leading-relaxed">
          {answer}
        </div>
      </div>
    </article>
  );
}

