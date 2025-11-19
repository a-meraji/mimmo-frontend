'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { packageManagement } from '@/utils/adminApi';
import { getChapterParts, getAllPackages, getPackageChapters } from '@/utils/api';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import PartForm from '@/components/admin/packages/PartForm';
import { Plus, Edit, Trash2, ChevronLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function PartsPage() {
  const params = useParams();
  const packageId = params.packageId;
  const chapterId = params.chapterId;
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  
  const [packageData, setPackageData] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPartFormOpen, setIsPartFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [chapterId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch package details
      const packagesResponse = await getAllPackages();
      const allPackages = packagesResponse?.data?.packages || [];
      const pkg = allPackages.find(p => p.id === packageId);
      
      if (!pkg) {
        notifyError('پکیج یافت نشد');
        setLoading(false);
        return;
      }
      
      setPackageData(pkg);
      
      // Fetch chapters to get chapter details
      const chaptersResponse = await getPackageChapters(packageId);
      const chapters = chaptersResponse?.data?.chapters || [];
      const chapter = chapters.find(c => c.id === chapterId);
      
      if (!chapter) {
        notifyError('فصل یافت نشد');
        setLoading(false);
        return;
      }
      
      setChapterData(chapter);
      
      // Fetch parts for this chapter
      const partsResponse = await getChapterParts(chapterId);
      setParts(partsResponse?.data?.parts || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.chapter);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePart = () => {
    setSelectedPart(null);
    setIsPartFormOpen(true);
  };

  const handleEditPart = (part) => {
    setSelectedPart(part);
    setIsPartFormOpen(true);
  };

  const handleDeletePart = (part) => {
    setSelectedPart(part);
    setIsDeleteDialogOpen(true);
  };

  const handleSavePart = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (selectedPart) {
        await packageManagement.updatePart(selectedPart.id, data, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.part));
      } else {
        await packageManagement.createPart({ ...data, chapterId }, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.part));
      }
      
      setIsPartFormOpen(false);
      fetchData();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.part);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await packageManagement.deletePart(selectedPart.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.part));
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.part);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="در حال بارگذاری..." />;
  if (!packageData || !chapterData) return <EmptyState title="اطلاعات یافت نشد" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'مدیریت پکیج‌ها', href: '/admin/packages' },
          { label: packageData.packageName, href: `/admin/packages/${packageId}/chapters` },
          { label: chapterData.title },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">بخش‌های {chapterData.title}</h1>
          <p className="text-gray-600 mt-1">مدیریت بخش‌های این فصل</p>
        </div>
        <button
          onClick={handleCreatePart}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          افزودن بخش
        </button>
      </div>

      {/* Content */}
      {parts.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="بخشی یافت نشد"
          message="هنوز بخشی برای این فصل ایجاد نشده است"
          action={
            <button
              onClick={handleCreatePart}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                       transition-colors font-medium"
            >
              افزودن اولین بخش
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {parts
            .sort((a, b) => a.numericOrder - b.numericOrder)
            .map((part) => (
              <div
                key={part.id}
                className="bg-white rounded-xl border border-gray-200 p-6
                         hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{part.numericOrder}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{part.title}</h3>
                      <p className="text-sm text-gray-600">
                        {part.lessons?.length || 0} درس
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/packages/${packageId}/chapters/${chapterId}/parts/${part.id}/lessons`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary
                               rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      مشاهده درس‌ها
                      <ChevronLeft className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleEditPart(part)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      aria-label="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePart(part)}
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
      <PartForm
        isOpen={isPartFormOpen}
        onClose={() => setIsPartFormOpen(false)}
        onSave={handleSavePart}
        part={selectedPart}
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف بخش"
        message={`آیا از حذف بخش "${selectedPart?.title}" اطمینان دارید؟ این عمل تمام درس‌های مرتبط را نیز حذف می‌کند.`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

