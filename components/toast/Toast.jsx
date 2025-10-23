"use client";

import { useState, useEffect, useMemo } from 'react';
import { X, Info, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function Toast({ id, message, type, duration, isExiting }) {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  // Get toast configuration based on type
  const config = useMemo(() => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          iconBg: 'bg-green-100',
          progressColor: 'bg-green-500',
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          iconColor: 'text-rose-600',
          iconBg: 'bg-rose-100',
          progressColor: 'bg-rose-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-100',
          progressColor: 'bg-amber-500',
        };
      default: // info
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          progressColor: 'bg-blue-500',
        };
    }
  }, [type]);

  const Icon = config.icon;

  // Progress bar countdown (pause when exiting)
  useEffect(() => {
    if (isExiting) return; // Don't update progress when exiting
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isExiting]);

  // Handle close - removeToast now handles the exit animation
  const handleClose = () => {
    removeToast(id);
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg
        ${config.bgColor} ${config.borderColor}
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-sm font-medium text-text-charcoal leading-relaxed">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="بستن اعلان"
        type="button"
      >
        <X className="w-4 h-4 text-text-gray" aria-hidden="true" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-xl overflow-hidden">
        <div
          className={`h-full ${config.progressColor} transition-all duration-50 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

