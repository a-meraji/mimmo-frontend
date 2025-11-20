"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ProfileCard, StatsGrid, CoursesCarousel, Achievements, LeitnerPreview } from '@/components/learn';
import { SocialLinks } from '@/components/home';
import { getUserPayments } from '@/utils/learningApi';
import { getUserExams } from '@/utils/examApi';
import { getImageUrl } from '@/utils/imageUrl';

export default function LearnPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, authenticatedFetch } = useAuth();
  const { toast } = useToast();

  const [userStats, setUserStats] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fetch user payments and exams to build dashboard
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);
        setHasError(false);

        // Fetch payments to get purchased packages
        const paymentsResult = await getUserPayments(authenticatedFetch);
        
        // Fetch exams for statistics
        const examsResult = await getUserExams(authenticatedFetch);

        if (paymentsResult.success && paymentsResult.data) {
          // Extract packages from completed and partial payments
          const packages = [];
          const validStatuses = ['COMPLETED', 'PARTIAL_PAYMENT'];
          
          paymentsResult.data.forEach(payment => {
            if (validStatuses.includes(payment.status) && payment.packages) {
              payment.packages.forEach(pkg => {
                // Avoid duplicates
                if (!packages.find(p => p.id === pkg.id)) {
                  packages.push({
                    id: pkg.id,
                    learnPath: pkg.id, // Use UUID as path
                    title: pkg.packageName,
                    subtitle: pkg.subtitle || '',
                    level: pkg.level || '',
                    image: getImageUrl(pkg.imageUrl),
                    paymentStatus: payment.status,
                    paymentMethod: payment.paymentMethod
                  });
                }
              });
            }
          });

          setUserCourses(packages);
        } else {
          console.error('Failed to fetch payments:', paymentsResult.error);
          setHasError(true);
        }

        // Calculate stats from exams
        if (examsResult.success && examsResult.data) {
          const exams = examsResult.data;
          const completedExams = exams.filter(e => e.status === 'completed');
          
          // Calculate streak (consecutive days with completed exams)
          const calculateStreak = (exams) => {
            if (exams.length === 0) return 0;
            
            const dates = exams
              .filter(e => e.completedAt)
              .map(e => new Date(e.completedAt).toDateString())
              .sort((a, b) => new Date(b) - new Date(a));
            
            if (dates.length === 0) return 0;
            
            let streak = 1;
            const today = new Date().toDateString();
            
            if (dates[0] !== today && 
                new Date(dates[0]).getTime() !== new Date(today).getTime() - 86400000) {
              return 0; // Streak broken
            }
            
            for (let i = 1; i < dates.length; i++) {
              const diff = new Date(dates[i-1]).getTime() - new Date(dates[i]).getTime();
              if (diff === 86400000) { // 1 day
                streak++;
              } else {
                break;
              }
            }
            
            return streak;
          };

          // Calculate practice minutes (assuming 1 minute per question)
          const totalQuestions = completedExams.reduce((sum, exam) => sum + (exam.totalQuestions || 0), 0);
          
          setUserStats({
            totalExams: exams.length,
            completedExams: completedExams.length,
            streakDays: calculateStreak(completedExams),
            practiceMinutes: totalQuestions, // Approximate
            totalPackages: userCourses.length
          });
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setHasError(true);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchUserData();
    }
  }, [isAuthenticated, user, authenticatedFetch, isLoading]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success('خروج موفقیت‌آمیز بود');
      router.push('/');
    } catch (error) {
      toast.error('خطا در خروج از حساب');
    }
  }, [logout, toast, router]);

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow 
        flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  // Redirect if not authenticated (middleware should handle this, but as backup)
  if (!isAuthenticated) {
    // router.push('/auth');
    // return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-gradient-yellow/10 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 py-20 pb-24 lg:py-28 relative z-10">
        {/* Page Header - Mobile Only */}
        <div className="text-center mb-12 lg:hidden">
          <h1 className="text-4xl font-black text-text-charcoal">پروفایل</h1>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block mb-30">
          <div className="max-w-6xl mx-auto grid grid-cols-5 gap-6 mb-16 items-stretch">
            {/* Profile Card - Right Side */}
            <div className="col-span-2 flex">
              <ProfileCard user={user} onLogout={handleLogout} />
            </div>

            {/* Stats Grid - Left Side */}
            <div className="col-span-3 flex">
              <StatsGrid stats={userStats} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6 mb-12">
          {/* Profile Card */}
          <ProfileCard user={user} onLogout={handleLogout} />

          {/* Stats Grid */}
          <StatsGrid stats={userStats} />
        </div>

        {/* My Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl lg:text-3xl font-black text-text-charcoal text-center mb-8">
            دوره های من
          </h2>

          {isLoadingData ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
            </div>
          ) : hasError ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-4">
                <p className="text-rose-700 mb-4">خطا در بارگذاری دوره‌ها</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  تلاش مجدد
                </button>
              </div>
            </div>
          ) : userCourses.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-8">
                <ShoppingBag className="w-16 h-16 text-primary mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-bold text-text-charcoal mb-2">
                  هنوز دوره‌ای خریداری نکرده‌اید
                </h3>
                <p className="text-text-gray mb-6">
                  برای شروع یادگیری، یک دوره از فروشگاه انتخاب کنید
                </p>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  مشاهده فروشگاه
                </Link>
              </div>
            </div>
          ) : (
            <CoursesCarousel courses={userCourses} />
          )}
        </section>

        {/* Leitner System Preview */}
        <LeitnerPreview />

        {/* Social Links */}
        <SocialLinks />

        {/* Achievements */}
        <Achievements />
    </div>
    </main>
  );
}
