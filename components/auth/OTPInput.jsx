"use client";

import { useRef, useEffect, useCallback } from 'react';

export default function OTPInput({ value = '', onChange, length = 4, disabled = false }) {
  const inputRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle input change
  const handleChange = useCallback((index, newValue) => {
    // Only allow digits
    const digit = newValue.replace(/[^0-9]/g, '');
    
    if (digit.length > 1) {
      // If pasting multiple digits
      const digits = digit.slice(0, length).split('');
      const newOTP = value.split('');
      
      digits.forEach((d, i) => {
        if (index + i < length) {
          newOTP[index + i] = d;
        }
      });
      
      onChange(newOTP.join(''));
      
      // Focus on the next empty input or last input
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      
      return;
    }

    // Single digit input
    const newOTP = value.split('');
    newOTP[index] = digit;
    onChange(newOTP.join(''));

    // Auto-focus to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  // Handle keydown for backspace/delete
  const handleKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      
      const currentValue = value[index] || '';
      
      if (currentValue) {
        // If current input has value, clear it
        const newOTP = value.split('');
        newOTP[index] = '';
        onChange(newOTP.join(''));
      } else if (index > 0) {
        // If current input is empty, go to previous and clear it
        const newOTP = value.split('');
        newOTP[index - 1] = '';
        onChange(newOTP.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  }, [value, onChange, length]);

  // Handle paste
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const digits = pastedData.replace(/[^0-9]/g, '').slice(0, length);
    
    if (digits) {
      onChange(digits.padEnd(length, '').slice(0, length));
      
      // Focus on the last filled input or last input
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  }, [onChange, length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (!disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [disabled]);

  return (
    <div 
      className="flex gap-3 justify-center dir-ltr"
      role="group"
      aria-label="کد تأیید"
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-14 h-14 sm:w-16 sm:h-16 
            text-center text-2xl font-semibold
            border-2 rounded-xl
            transition-all duration-200
            ${disabled 
              ? 'bg-neutral-lighter border-neutral-extralight text-text-gray cursor-not-allowed' 
              : 'bg-white border-neutral-extralight hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
            ${value[index] ? 'border-primary' : ''}
          `}
          aria-label={`رقم ${index + 1}`}
          autoComplete="off"
        />
      ))}
    </div>
  );
}

