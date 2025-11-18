'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { packageManagement } from '@/utils/adminApi';
import { getPackageById } from '@/utils/lessonData';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import ChapterForm from '@/components/admin/packages/ChapterForm';
import { Plus, Edit, Trash2, ChevronLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ChaptersPage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.packageId;
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  
  const [packageData, setPackageData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChapterFormOpen, setIsChapterFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPackage();
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const pkg = await getPackageById(packageId);
      setPackageData(pkg);
      setChapters(pkg.chapters || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.package);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = () => {
    setSelectedChapter(null);
    setIsChapterFormOpen(true);
  };

  const handleEditChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsChapterFormOpen(true);
  };

  const handleDeleteChapter = (chapter) => {
    setSelectedChapter(chapter);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveChapter = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (selectedChapter) {
        await packageManagement.updateChapter(selectedChapter.id, data, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.chapter));
      } else {
        await packageManagement.createChapter({ ...data, packageId }, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.chapter));
      }
      
      setIsChapterFormOpen(false);
      fetchPackage();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.chapter);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await packageManagement.deleteChapter(selectedChapter.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.chapter));
      setIsDeleteDialogOpen(false);
      fetchPackage();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.chapter);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="در حال بارگذاری..." />;
  if (!packageData) return <EmptyState title="پکیج یافت نشد" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'مدیریت پکیج‌ها', href: '/admin/packages' },
          { label: packageData.packageName },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">فصل‌های {packageData.packageName}</h1>
          <p className="text-gray-600 mt-1">مدیریت فصل‌های این پکیج</p>
        </div>
        <button
          onClick={handleCreateChapter}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          افزودن فصل
        </button>
      </div>

      {/* Content */}
      {chapters.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="فصلی یافت نشد"
          message="هنوز فصلی برای این پکیج ایجاد نشده است"
          action={
            <button
              onClick={handleCreateChapter}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                       transition-colors font-medium"
            >
              افزودن اولین فصل
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {chapters
            .sort((a, b) => a.numericOrder - b.numericOrder)
            .map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white rounded-xl border border-gray-200 p-6
                         hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{chapter.numericOrder}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{chapter.title}</h3>
                      <p className="text-sm text-gray-600">
                        {chapter.parts?.length || 0} بخش
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/packages/${packageId}/chapters/${chapter.id}/parts`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary
                               rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      مشاهده بخش‌ها
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditChapter(chapter)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      aria-label="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modals */}
      <ChapterForm
        isOpen={isChapterFormOpen}
        onClose={() => setIsChapterFormOpen(false)}
        onSave={handleSaveChapter}
        chapter={selectedChapter}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف فصل"
        message={`آیا از حذف فصل "${selectedChapter?.title}" اطمینان دارید؟ این عمل تمام بخش‌ها و درس‌های مرتبط را نیز حذف می‌کند.`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

