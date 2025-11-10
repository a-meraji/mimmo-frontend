"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { ProfileCard, StatsGrid, CoursesCarousel, Achievements } from '@/components/learn';
import { SocialLinks } from '@/components/home';

const MOCK_USER_COURSES = [
  {
    id: 'espresso-1',
    learnPath: 'espresso-1',
    title: 'اسپرسو ۱ - مکالمه روزمره',
    subtitle: 'دروس ۱ تا ۵ | سطح A1',
    level: 'A1',
    image: '/es1.webp',
  },
  {
    id: 'espresso-2',
    learnPath: 'espresso-2',
    title: 'اسپرسو ۲ - مکالمه پیشرفته',
    subtitle: 'دروس ۶ تا ۱۰ | سطح A2',
    level: 'A2',
    image: '/es2.webp',
  },
  {
    id: 'driving-license',
    learnPath: 'driving-license',
    title: 'دوره جامع گواهینامه ایتالیا',
    subtitle: 'آزمون تئوری با تمرین تعاملی',
    level: 'B1',
    image: '/license0.webp',
  },
];

export default function LearnPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, authenticatedFetch } = useAuth();
  const { toast } = useToast();

  const [userStats, setUserStats] = useState(null);
  const [userCourses, setUserCourses] = useState(MOCK_USER_COURSES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch user stats and courses
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoadingData(false);
        return;
      }

      try {
        setIsLoadingData(true);

        // Fetch user stats and courses in parallel
        const [statsResponse, coursesResponse] = await Promise.allSettled([
          authenticatedFetch('/user/stats', { method: 'GET' }).catch(() => null),
          authenticatedFetch('/user/courses', { method: 'GET' }).catch(() => null),
        ]);

        // Set stats if available
        if (statsResponse.status === 'fulfilled' && statsResponse.value) {
          setUserStats(statsResponse.value);
        }

        // Set courses if available
        if (coursesResponse.status === 'fulfilled' && coursesResponse.value) {
          const extractedCourses = coursesResponse.value.courses || coursesResponse.value || [];

          const normalisedCourses = Array.isArray(extractedCourses)
            ? extractedCourses.map((course) => ({
                id: course.id || course.slug || course.courseId || course.learnPath,
                learnPath: course.learnPath || course.slug || course.id || course.courseId,
                title: course.title || course.name,
                subtitle: course.subtitle || course.description || '',
                level: course.level || course.courseLevel || '',
                image: course.image || course.coverImage || '/es1.webp',
              }))
            : [];

          setUserCourses(normalisedCourses.length ? normalisedCourses : MOCK_USER_COURSES);
        } else {
          setUserCourses(MOCK_USER_COURSES);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Don't show error toast, just use default values
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
          ) : (
            <CoursesCarousel courses={userCourses} />
          )}
        </section>

        {/* Social Links */}
        <SocialLinks />

        {/* Achievements */}
        <Achievements />
      </div>
    </main>
  );
}
