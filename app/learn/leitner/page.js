"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Plus, 
  PlayCircle, 
  Package, 
  Filter,
  TrendingUp,
  Calendar,
  BookMarked
} from 'lucide-react';
import { 
  getFlashcards, 
  getStatistics, 
  getCoursesList, 
  deleteFlashcard,
  BOX_COLORS,
  getCardsDueForReview
} from '@/utils/leitnerStorage';
import { useToast } from '@/contexts/ToastContext';
import AddFlashcardModal from '@/components/leitner/AddFlashcardModal';
import EditFlashcardModal from '@/components/leitner/EditFlashcardModal';
import FlashcardList from '@/components/leitner/FlashcardList';

export default function LeitnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [courses, setCourses] = useState([]);
  
  const [activeTab, setActiveTab] = useState('review'); // 'review', 'all', 'course'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBox, setSelectedBox] = useState(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);

  // Load data
  const loadData = useCallback(() => {
    const allFlashcards = getFlashcards();
    const stats = getStatistics();
    const coursesList = getCoursesList();
    
    setFlashcards(allFlashcards);
    setStatistics(stats);
    setCourses(coursesList);
    
    // Apply filters
    applyFilters(allFlashcards);
  }, []);

  // Apply filters based on active tab and selections
  const applyFilters = useCallback((cards = flashcards) => {
    let filtered = [...cards];

    if (activeTab === 'review') {
      filtered = getCardsDueForReview();
    } else if (activeTab === 'course' && selectedCourse) {
      filtered = filtered.filter(card => card.courseId === selectedCourse);
    }

    if (selectedBox) {
      filtered = filtered.filter(card => card.box === selectedBox);
    }

    setFilteredFlashcards(filtered);
  }, [activeTab, selectedCourse, selectedBox, flashcards]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reapply filters when tab or selections change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('leitnerUpdate', handleStorageChange);
    return () => window.removeEventListener('leitnerUpdate', handleStorageChange);
  }, [loadData]);

  const handleAddSuccess = (flashcard) => {
    toast.success('کارت با موفقیت اضافه شد');
    loadData();
  };

  const handleEditSuccess = (flashcard) => {
    toast.success('کارت با موفقیت ویرایش شد');
    loadData();
    setIsEditModalOpen(false);
    setEditingFlashcard(null);
  };

  const handleEdit = (flashcard) => {
    setEditingFlashcard(flashcard);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      deleteFlashcard(id);
      toast.success('کارت حذف شد');
      loadData();
    } catch (error) {
      toast.error('خطا در حذف کارت');
    }
  };

  const startReview = () => {
    const cardsDue = getCardsDueForReview();
    if (cardsDue.length === 0) {
      toast.info('هیچ کارتی برای مرور آماده نیست');
      return;
    }
    router.push('/learn/leitner/review');
  };

  if (!statistics) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </main>
    );
  }

  // Modern, sleek box colors (softer palette)
  const modernBoxColors = {
    1: { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-700', accent: 'bg-red-50' },
    2: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-700', accent: 'bg-orange-50' },
    3: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-700', accent: 'bg-amber-50' },
    4: { bg: 'bg-lime-100', border: 'border-lime-200', text: 'text-lime-700', accent: 'bg-lime-50' },
    5: { bg: 'bg-emerald-100', border: 'border-emerald-200', text: 'text-emerald-700', accent: 'bg-emerald-50' },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-8 sm:py-12 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb - Mobile Optimized */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-light flex-shrink-0" aria-hidden="true" />
          <span className="text-text-charcoal font-medium truncate">سیستم لایتنر</span>
        </nav>

        {/* Header - Mobile First */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-charcoal mb-2">
                سیستم لایتنر
              </h1>
              <p className="text-sm sm:text-base text-text-gray">
                مرور هوشمند با فاصله‌گذاری تکرار برای یادگیری بهتر
              </p>
            </div>
            {/* Action Buttons - Stacked on Mobile */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startReview}
                disabled={statistics.cardsDue === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 sm:py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] touch-manipulation"
                aria-label={`شروع مرور ${statistics.cardsDue} کارت`}
              >
                <PlayCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm sm:text-base">شروع مرور</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                  ({statistics.cardsDue})
                </span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 sm:py-3 bg-white border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all min-h-[48px] touch-manipulation"
                aria-label="افزودن کارت جدید"
              >
                <Plus className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm sm:text-base">افزودن کارت</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-neutral-extralight rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-text-charcoal">{statistics.total}</p>
                <p className="text-[10px] sm:text-xs text-text-gray">مجموع کارت‌ها</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-extralight rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-amber-600">{statistics.cardsDue}</p>
                <p className="text-[10px] sm:text-xs text-text-gray">آماده مرور</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-extralight rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">{statistics.successRate}%</p>
                <p className="text-[10px] sm:text-xs text-text-gray">نرخ موفقیت</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-neutral-extralight rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-bold text-text-charcoal">{statistics.totalReviews}</p>
                <p className="text-[10px] sm:text-xs text-text-gray">مجموع مرورها</p>
              </div>
            </div>
          </div>
        </div>

        {/* Box Distribution - Mobile First Vertical Cards */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-bold text-text-charcoal mb-4">توزیع جعبه‌ها</h2>
          {/* Mobile: Vertical Stack, Desktop: Horizontal Grid */}
          <div className="flex flex-col sm:grid sm:grid-cols-5 gap-3 sm:gap-3">
            {[1, 2, 3, 4, 5].map((box) => {
              const colors = modernBoxColors[box];
              const count = statistics.boxDistribution[box] || 0;
              const isSelected = selectedBox === box;
              const intervalText = box === 1 ? 'روزانه' : box === 2 ? '۲ روزه' : box === 3 ? '۴ روزه' : box === 4 ? '۸ روزه' : '۱۶ روزه';
              
              return (
                <button
                  key={box}
                  onClick={() => setSelectedBox(isSelected ? null : box)}
                  className={`relative border-2 ${colors.border} ${colors.bg} rounded-xl sm:rounded-xl p-4 transition-all hover:shadow-md active:scale-95 touch-manipulation min-h-[80px] sm:min-h-0 ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                  } ${count > 0 ? 'opacity-100' : 'opacity-40'}`}
                  aria-label={`جعبه ${box} با ${count} کارت`}
                >
                  <div className="text-center">
                    <div className={`text-3xl sm:text-3xl font-bold ${colors.text} mb-1`}>
                      {count}
                    </div>
                    <div className="text-xs sm:text-xs font-medium text-text-charcoal mb-1">
                      جعبه {box}
                    </div>
                    <div className="text-[10px] sm:text-[10px] text-text-gray">
                      {intervalText}
                    </div>
                  </div>
                  {/* Subtle accent indicator */}
                  {count > 0 && (
                    <div className={`absolute top-2 left-2 right-2 h-0.5 ${colors.accent} rounded-full`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabs - Mobile Optimized with Scroll */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl p-2 mb-4 sm:mb-6">
          {/* Mobile: Scrollable horizontal tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
            <button
              onClick={() => {
                setActiveTab('review');
                setSelectedCourse(null);
              }}
              className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all min-h-[48px] touch-manipulation ${
                activeTab === 'review'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-gray hover:bg-neutral-indigo/30 active:bg-neutral-indigo/40'
              }`}
              aria-label={`آماده مرور ${statistics.cardsDue} کارت`}
            >
              <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">آماده مرور</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === 'review' ? 'bg-white/20' : 'bg-primary/10 text-primary'
              }`}>
                ({statistics.cardsDue})
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCourse(null);
              }}
              className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all min-h-[48px] touch-manipulation ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-gray hover:bg-neutral-indigo/30 active:bg-neutral-indigo/40'
              }`}
              aria-label="همه کارت‌ها"
            >
              <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">همه کارت‌ها</span>
            </button>
            <button
              onClick={() => setActiveTab('course')}
              className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 sm:px-4 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all min-h-[48px] touch-manipulation ${
                activeTab === 'course'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-text-gray hover:bg-neutral-indigo/30 active:bg-neutral-indigo/40'
              }`}
              aria-label="بر اساس دوره"
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">بر اساس دوره</span>
            </button>
          </div>
        </div>

        {/* Course Filter (when course tab is active) - Mobile Optimized */}
        {activeTab === 'course' && courses.length > 0 && (
          <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl p-4 sm:p-4 mb-4 sm:mb-6">
            <label className="block text-sm font-semibold text-text-charcoal mb-3">
              انتخاب دوره
            </label>
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value || null)}
              className="w-full px-4 py-3.5 sm:py-3 border-2 border-neutral-extralight rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-base sm:text-sm min-h-[48px] touch-manipulation"
              aria-label="انتخاب دوره"
            >
              <option value="">همه دوره‌ها</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id} ({course.count} کارت)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Flashcards List - Mobile Optimized */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-extralight rounded-2xl p-4 sm:p-6">
          <FlashcardList
            flashcards={filteredFlashcards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage={
              activeTab === 'review' 
                ? 'هیچ کارتی برای مرور آماده نیست'
                : 'هیچ کارتی یافت نشد'
            }
          />
        </div>
      </div>

      {/* Modals */}
      <AddFlashcardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditFlashcardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingFlashcard(null);
        }}
        flashcard={editingFlashcard}
        onSuccess={handleEditSuccess}
      />
    </main>
  );
}

