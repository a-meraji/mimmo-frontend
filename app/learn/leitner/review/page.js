"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Trophy, 
  TrendingUp, 
  RotateCcw,
  Home
} from 'lucide-react';
import { getCardsDueForReview, moveFlashcard } from '@/utils/leitnerStorage';
import { useToast } from '@/contexts/ToastContext';
import ReviewCard from '@/components/leitner/ReviewCard';

export default function ReviewSessionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cards due for review
  useEffect(() => {
    const loadCards = () => {
      const dueCards = getCardsDueForReview();
      
      if (dueCards.length === 0) {
        toast.info('هیچ کارتی برای مرور آماده نیست');
        router.push('/learn/leitner');
        return;
      }

      // Shuffle cards for variety
      const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
      setIsLoading(false);
    };

    loadCards();
  }, [router, toast]);

  const handleAnswer = (cardId, isCorrect) => {
    try {
      // Move card based on answer
      moveFlashcard(cardId, isCorrect);

      // Update counts
      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
      } else {
        setIncorrectCount(prev => prev + 1);
      }

      // Move to next card or complete
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      toast.error('خطا در ثبت پاسخ');
    }
  };

  const handleRestart = () => {
    const dueCards = getCardsDueForReview();
    if (dueCards.length === 0) {
      toast.info('هیچ کارت جدیدی برای مرور آماده نیست');
      router.push('/learn/leitner');
      return;
    }
    
    const shuffled = [...dueCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIsComplete(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {!isComplete ? (
          <>
            {/* Header with Progress */}
            <div className="mb-8">
              <nav className="flex items-center gap-2 text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
                <Link href="/learn" className="hover:text-primary transition-colors">
                  بخش یادگیری
                </Link>
                <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
                <Link href="/learn/leitner" className="hover:text-primary transition-colors">
                  سیستم لایتنر
                </Link>
                <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
                <span className="text-text-charcoal font-medium">جلسه مرور</span>
              </nav>

              <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-text-charcoal">جلسه مرور</h1>
                    <p className="text-sm text-text-gray">
                      کارت {currentIndex + 1} از {cards.length}
                    </p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">{correctCount}</div>
                        <div className="text-xs text-text-gray">صحیح</div>
                      </div>
                      <div className="w-px h-10 bg-neutral-extralight" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{incorrectCount}</div>
                        <div className="text-xs text-text-gray">اشتباه</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-3 bg-neutral-indigo/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Card */}
            <ReviewCard
              flashcard={currentCard}
              onAnswer={handleAnswer}
            />
          </>
        ) : (
          /* Completion Screen */
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-3xl p-8 lg:p-12 shadow-2xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="w-10 h-10 text-white" aria-hidden="true" />
              </div>

              <h1 className="text-3xl lg:text-4xl font-black text-text-charcoal mb-4">
                عالی! جلسه مرور تمام شد
              </h1>

              <p className="text-lg text-text-gray mb-8">
                تمام کارت‌های امروز را مرور کردید
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
                <div className="bg-neutral-indigo/20 rounded-xl p-4">
                  <div className="text-3xl font-bold text-text-charcoal mb-1">
                    {cards.length}
                  </div>
                  <div className="text-sm text-text-gray">مجموع کارت‌ها</div>
                </div>

                <div className="bg-emerald-500/10 rounded-xl p-4">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {correctCount}
                  </div>
                  <div className="text-sm text-text-gray">پاسخ صحیح</div>
                </div>

                <div className="bg-red-500/10 rounded-xl p-4">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {incorrectCount}
                  </div>
                  <div className="text-sm text-text-gray">پاسخ اشتباه</div>
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold text-text-charcoal">نرخ موفقیت</span>
                </div>
                <div className="text-5xl font-black text-primary">
                  {Math.round((correctCount / cards.length) * 100)}%
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <RotateCcw className="w-5 h-5" aria-hidden="true" />
                  شروع مرور جدید
                </button>
                <Link
                  href="/learn/leitner"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-neutral-extralight text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo/10 transition-all"
                >
                  بازگشت به لایتنر
                </Link>
                <Link
                  href="/learn"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-neutral-extralight text-text-charcoal rounded-xl font-semibold hover:bg-neutral-indigo/10 transition-all"
                >
                  <Home className="w-5 h-5" aria-hidden="true" />
                  صفحه یادگیری
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

