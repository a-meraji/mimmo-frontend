"use client";

import { useState, useEffect, useCallback } from 'react';
import { Settings, Clock, FileQuestion, Filter, MessageSquare } from 'lucide-react';

export default function TestConfigForm({ 
  lessonId, 
  availableLessons = [], 
  defaultConfig, 
  onSubmit 
}) {
  const [config, setConfig] = useState({
    questionCount: 10,
    includeScope: 'this-lesson',
    previousLessons: [],
    questionMixture: 'all',
    timeLimit: false,
    feedbackMode: 'immediate',
    ...defaultConfig
  });

  const [errors, setErrors] = useState({});

  // Update config when defaultConfig changes
  useEffect(() => {
    if (defaultConfig) {
      setConfig(prev => ({ ...prev, ...defaultConfig }));
    }
  }, [defaultConfig]);

  // Validate form
  const validate = useCallback(() => {
    const newErrors = {};

    if (!config.questionCount || config.questionCount < 1) {
      newErrors.questionCount = 'تعداد سوالات باید حداقل ۱ باشد';
    }

    if (config.questionCount > 50) {
      newErrors.questionCount = 'تعداد سوالات نمی‌تواند بیشتر از ۵۰ باشد';
    }

    if (config.includeScope === 'include-previous' && config.previousLessons.length === 0) {
      newErrors.previousLessons = 'حداقل یک درس قبلی را انتخاب کنید';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [config]);

  // Handle form submission
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...config,
        lessonId
      });
    }
  }, [config, lessonId, validate, onSubmit]);

  // Handle checkbox change for previous lessons
  const handlePreviousLessonToggle = useCallback((lessonId) => {
    setConfig(prev => ({
      ...prev,
      previousLessons: prev.previousLessons.includes(lessonId)
        ? prev.previousLessons.filter(id => id !== lessonId)
        : [...prev.previousLessons, lessonId]
    }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
      {/* Question Count */}
      <div className="bg-white border border-neutral-extralight rounded-xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-3 lg:mb-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileQuestion className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm lg:text-base text-text-charcoal">تعداد سوالات</h3>
            <p className="text-xs text-text-gray">چند سوال می‌خواهید تمرین کنید؟</p>
          </div>
        </div>
        <input
          type="number"
          min="1"
          max="50"
          value={config.questionCount}
          onChange={(e) => setConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 1 }))}
          className="w-full px-4 py-2.5 lg:py-3 border-2 border-neutral-extralight rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 text-sm lg:text-base"
        />
        {errors.questionCount && (
          <p className="text-sm text-rose-600 mt-2">{errors.questionCount}</p>
        )}
      </div>

      {/* Source Scope */}
      <div className="bg-white border border-neutral-extralight rounded-xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-3 lg:mb-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm lg:text-base text-text-charcoal">محدوده سوالات</h3>
            <p className="text-xs text-text-gray">از کدام دروس سوال بیاید؟</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-neutral-extralight rounded-xl cursor-pointer hover:bg-neutral-indigo/20 transition-colors">
            <input
              type="radio"
              name="includeScope"
              value="this-lesson"
              checked={config.includeScope === 'this-lesson'}
              onChange={(e) => setConfig(prev => ({ ...prev, includeScope: e.target.value, previousLessons: [] }))}
              className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-sm font-medium text-text-charcoal">فقط این درس</span>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-neutral-extralight rounded-xl cursor-pointer hover:bg-neutral-indigo/20 transition-colors">
            <input
              type="radio"
              name="includeScope"
              value="include-previous"
              checked={config.includeScope === 'include-previous'}
              onChange={(e) => setConfig(prev => ({ ...prev, includeScope: e.target.value }))}
              className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <span className="text-sm font-medium text-text-charcoal">شامل دروس قبلی</span>
          </label>
        </div>

        {/* Previous Lessons Selection */}
        {config.includeScope === 'include-previous' && availableLessons.length > 0 && (
          <div className="mt-4 p-4 bg-neutral-indigo/10 rounded-xl space-y-2">
            <p className="text-sm font-medium text-text-charcoal mb-3">انتخاب دروس قبلی:</p>
            {availableLessons.map(lesson => (
              <label key={lesson.id} className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
                <input
                  type="checkbox"
                  checked={config.previousLessons.includes(lesson.id)}
                  onChange={() => handlePreviousLessonToggle(lesson.id)}
                  className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary/20 rounded"
                />
                <span className="text-sm text-text-charcoal">{lesson.title}</span>
              </label>
            ))}
            {errors.previousLessons && (
              <p className="text-sm text-rose-600 mt-2">{errors.previousLessons}</p>
            )}
          </div>
        )}
      </div>

      {/* Question Mixture */}
      <div className="bg-white border border-neutral-extralight rounded-xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-3 lg:mb-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm lg:text-base text-text-charcoal">نوع سوالات</h3>
            <p className="text-xs text-text-gray">چه سوالاتی نمایش داده شود؟</p>
          </div>
        </div>
        
        <select
          value={config.questionMixture}
          onChange={(e) => setConfig(prev => ({ ...prev, questionMixture: e.target.value }))}
          className="w-full px-4 py-2.5 lg:py-3 border-2 border-neutral-extralight rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 bg-white text-sm lg:text-base"
        >
          <option value="all">همه سوالات</option>
          <option value="wrong">فقط سوالات اشتباه قبلی</option>
          <option value="non-answered">فقط سوالات پاسخ داده نشده</option>
          <option value="doubtful">فقط سوالات مشکوک</option>
          <option value="combined">ترکیبی (اشتباه + پاسخ نداده + مشکوک)</option>
        </select>
      </div>

      {/* Time Limit */}
      <div className="bg-white border border-neutral-extralight rounded-xl p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm lg:text-base text-text-charcoal">محدودیت زمانی</h3>
              <p className="text-xs text-text-gray">۵۰ ثانیه برای هر سوال</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.timeLimit}
              onChange={(e) => setConfig(prev => ({ ...prev, timeLimit: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-gray rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-neutral-extralight after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Feedback Mode */}
      <div className="bg-white border border-neutral-extralight rounded-xl p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-3 lg:mb-4">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm lg:text-base text-text-charcoal">نمایش پاسخ صحیح</h3>
            <p className="text-xs text-text-gray">چه زمانی پاسخ صحیح نمایش داده شود؟</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-neutral-extralight rounded-xl cursor-pointer hover:bg-neutral-indigo/20 transition-colors">
            <input
              type="radio"
              name="feedbackMode"
              value="immediate"
              checked={config.feedbackMode === 'immediate'}
              onChange={(e) => setConfig(prev => ({ ...prev, feedbackMode: e.target.value }))}
              className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <div>
              <span className="text-sm font-medium text-text-charcoal block">بعد از هر سوال</span>
              <span className="text-xs text-text-gray">بلافاصله پاسخ صحیح نمایش داده شود</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border-2 border-neutral-extralight rounded-xl cursor-pointer hover:bg-neutral-indigo/20 transition-colors">
            <input
              type="radio"
              name="feedbackMode"
              value="end"
              checked={config.feedbackMode === 'end'}
              onChange={(e) => setConfig(prev => ({ ...prev, feedbackMode: e.target.value }))}
              className="w-5 h-5 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <div>
              <span className="text-sm font-medium text-text-charcoal block">در پایان آزمون</span>
              <span className="text-xs text-text-gray">پس از اتمام همه سوالات نمایش داده شود</span>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        شروع آزمون
      </button>
    </form>
  );
}

