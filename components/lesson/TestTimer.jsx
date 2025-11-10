"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function TestTimer({ 
  duration = 50, 
  onTimeUp, 
  isPaused = false,
  onTick 
}) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef(null);

  // Calculate progress percentage
  const progressPercent = (timeRemaining / duration) * 100;
  const isWarning = timeRemaining <= 10;

  // Start/stop timer based on pause state
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Call onTick callback if provided
        if (onTick) {
          onTick(newTime);
        }

        // Time's up
        if (newTime <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, onTimeUp, onTick]);

  // Reset timer when duration changes (new question)
  useEffect(() => {
    setTimeRemaining(duration);
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`bg-white border-2 rounded-xl p-4 transition-all duration-300 ${
      isWarning ? 'border-rose-500 bg-rose-50' : 'border-neutral-extralight'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isWarning ? (
            <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" aria-hidden="true" />
          ) : (
            <Clock className="w-5 h-5 text-primary" aria-hidden="true" />
          )}
          <span className={`text-sm font-medium ${isWarning ? 'text-rose-700' : 'text-text-gray'}`}>
            زمان باقیمانده
          </span>
        </div>
        <span className={`text-2xl font-bold ${isWarning ? 'text-rose-700' : 'text-primary'}`}>
          {timeRemaining}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-neutral-indigo/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isWarning ? 'bg-rose-500' : 'bg-primary'
          }`}
          style={{ width: `${progressPercent}%` }}
          aria-hidden="true"
        />
      </div>

      {isWarning && (
        <p className="text-xs text-rose-600 mt-2 text-center font-medium animate-pulse">
          زمان رو به اتمام است!
        </p>
      )}
    </div>
  );
}

