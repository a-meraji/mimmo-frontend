"use client";

import { useState } from 'react';
import { RotateCw, Eye } from 'lucide-react';
import { BOX_COLORS } from '@/utils/leitnerStorage';

export default function ReviewCard({ flashcard, onAnswer }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const boxColors = BOX_COLORS[flashcard.box] || BOX_COLORS[1];

  const handleFlip = () => {
    if (isAnimating) return;
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect) => {
    if (!isFlipped) return; // Must flip first to see answer

    setIsAnimating(true);
    
    // Animate out then call callback
    setTimeout(() => {
      onAnswer(flashcard.id, isCorrect);
      setIsFlipped(false);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Container with 3D flip effect */}
      <div 
        className="relative w-full"
        style={{ 
          perspective: '1000px',
          minHeight: '500px'
        }}
      >
        <div 
          className={`relative w-full transition-transform duration-500 ${
            isAnimating ? 'scale-95 opacity-50' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
            minHeight: '500px',
          }}
        >
          {/* Front Side */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl border-2 border-neutral-extralight overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Box indicator */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${boxColors.bg} rounded-t-3xl z-10`} />

            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 lg:p-12 pt-12">
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${boxColors.badge} text-sm font-medium`}>
                  جعبه {flashcard.box}
                </div>
              </div>

              <div className="mb-8 flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-medium text-text-gray mb-3">سوال / کلمه:</h2>
                <p className="text-3xl lg:text-4xl font-bold text-text-charcoal leading-relaxed break-words px-4">
                  {flashcard.front}
                </p>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleFlip}
                  disabled={isAnimating}
                  className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  نمایش پاسخ
                </button>

                {flashcard.courseId && (
                  <div className="mt-4 text-sm text-text-gray">
                    دوره: {flashcard.courseId}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div 
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl border-2 border-neutral-extralight overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Box indicator */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${boxColors.bg} rounded-t-3xl z-10`} />

            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 lg:p-12 pt-12">
              <div className="mb-6">
                <button
                  onClick={handleFlip}
                  disabled={isAnimating}
                  className="inline-flex items-center gap-2 text-sm text-text-gray hover:text-primary transition-colors disabled:opacity-50"
                >
                  <RotateCw className="w-4 h-4" aria-hidden="true" />
                  برگشت به سوال
                </button>
              </div>

              <div className="mb-8 flex-1 flex flex-col justify-center">
                <h2 className="text-sm font-medium text-text-gray mb-3">پاسخ / معنی:</h2>
                <p className="text-2xl lg:text-3xl font-bold text-text-charcoal leading-relaxed mb-4 break-words px-4">
                  {flashcard.back}
                </p>
              </div>

              <div className="w-full max-w-md mt-auto">
                <p className="text-sm text-text-gray mb-4">آیا پاسخ درست بود؟</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={isAnimating}
                    className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    ❌ اشتباه بود
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={isAnimating}
                    className="flex-1 px-6 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    ✅ درست بود
                  </button>
                </div>
                <p className="text-xs text-text-gray mt-3">
                  درست: جعبه بعدی | اشتباه: برگشت به جعبه ۱
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

