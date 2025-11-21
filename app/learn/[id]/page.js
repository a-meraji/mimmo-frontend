"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenCheck, Clock3, Flame, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getBoughtPackages } from "@/utils/learningApi";
import { getProgressTracker } from "@/utils/examApi";
import { PackageHierarchy } from "@/components/learn";
import { getImageUrl } from "@/utils/imageUrl";

export default function LearnCoursePage({ params }) {
  const { id } = use(params); // Package UUID
  const router = useRouter();
  const { user, isAuthenticated, isLoading, authenticatedFetch } = useAuth();
  
  const [packageData, setPackageData] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch bought packages directly
        const packagesResult = await getBoughtPackages(authenticatedFetch);
        
        if (!packagesResult.success) {
          setError('خطا در بارگذاری اطلاعات دوره');
          setLoading(false);
          return;
        }

        // Find the specific package by ID
        const foundPackage = packagesResult.data.find(pkg => pkg.id === id);

        if (!foundPackage) {
          setError('دوره یافت نشد یا دسترسی ندارید');
          setLoading(false);
          return;
        }

        setPackageData(foundPackage);

        // Fetch progress tracker - we'll get all lesson IDs from hierarchy later
        // For now, just set empty array
        setCompletedLessonIds([]);

      } catch (err) {
        console.error('Error fetching package data:', err);
        setError('خطا در بارگذاری اطلاعات دوره');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchPackageData();
    }
  }, [id, isAuthenticated, user, authenticatedFetch, isLoading]);

  // Loading state
  if (isLoading || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !packageData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-black text-text-charcoal mb-4">خطا</h1>
          <p className="text-text-gray mb-6">{error || 'دوره یافت نشد'}</p>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
            بازگشت به داشبورد
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-8" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">{packageData.packageName}</span>
        </nav>

        {/* Package Header */}
        <header className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-3xl shadow-xl overflow-hidden mb-10">
          <div className="grid lg:grid-cols-12 gap-0">
            {/* Package Image */}
            <div className="lg:col-span-5 relative min-h-[260px] bg-neutral-indigo/10">
              <Image
                src={getImageUrl(packageData.imageUrl)}
                alt={packageData.packageName}
                fill
                className="object-contain p-8"
                priority
              />
              {packageData.level && (
                <span className="absolute top-6 right-6 inline-flex items-center gap-2 bg-primary text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg">
                  سطح {packageData.level}
                </span>
              )}
              {packageData.badge && (
                <span className="absolute top-6 left-6 inline-flex items-center gap-2 bg-secondary text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg">
                  {packageData.badge}
                </span>
              )}
            </div>

            {/* Package Info */}
            <div className="lg:col-span-7 p-8 space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-black text-text-charcoal">
                  {packageData.packageName}
                </h1>
                <p className="text-sm text-text-gray">{packageData.subtitle}</p>
              </div>

              <p className="text-sm text-text-charcoal/80 leading-7">
                {packageData.description}
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <StatBadge
                  icon={BookOpenCheck}
                  title="تعداد دروس"
                  value={packageData.specifications?.find(s => s.label.includes('درس'))?.value || 'نامشخص'}
                />
                <StatBadge
                  icon={Clock3}
                  title="مدت زمان"
                  value={packageData.specifications?.find(s => s.label.includes('ساعت'))?.value || 'نامشخص'}
                />
                <StatBadge
                  icon={Flame}
                  title="سطح"
                  value={packageData.level || 'نامشخص'}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Package Content */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8">
          <div className="lg:col-span-12">
            <section className="bg-white border border-neutral-extralight rounded-2xl p-6 lg:p-8">
              <h2 className="text-xl font-bold text-text-charcoal mb-6">محتوای دوره</h2>
              
              <PackageHierarchy
                packageId={id}
                completedLessonIds={completedLessonIds}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatBadge({ icon: Icon, title, value }) {
  return (
    <div className="bg-neutral-indigo/30 border border-neutral-extralight rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs text-text-light">{title}</p>
        <p className="text-sm font-semibold text-text-charcoal">{value}</p>
      </div>
    </div>
  );
}
