'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { packageManagement } from '@/utils/adminApi';
import { getPartLessons, getChapterParts, getPackageChapters, getAllPackages } from '@/utils/api';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import LessonForm from '@/components/admin/packages/LessonForm';
import WordsManagement from '@/components/admin/packages/WordsManagement';
import { Plus, Edit, Trash2, BookText, FileText } from 'lucide-react';

export default function LessonsPage() {
  const params = useParams();
  const packageId = params.packageId;
  const chapterId = params.chapterId;
  const partId = params.partId;
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  
  const [packageData, setPackageData] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [partData, setPartData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isWordsModalOpen, setIsWordsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [partId]);

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
      
      // Fetch chapters
      const chaptersResponse = await getPackageChapters(packageId);
      const chapters = chaptersResponse?.data?.chapters || [];
      const chapter = chapters.find(c => c.id === chapterId);
      
      if (!chapter) {
        notifyError('فصل یافت نشد');
        setLoading(false);
        return;
      }
      
      setChapterData(chapter);
      
      // Fetch parts
      const partsResponse = await getChapterParts(chapterId);
      const parts = partsResponse?.data?.parts || [];
      const part = parts.find(p => p.id === partId);
      
      if (!part) {
        notifyError('بخش یافت نشد');
        setLoading(false);
        return;
      }
      
      setPartData(part);
      
      // Fetch lessons for this part
      const lessonsResponse = await getPartLessons(partId);
      setLessons(lessonsResponse?.data?.lessons || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.lesson);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = () => {
    setSelectedLesson(null);
    setIsLessonFormOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsLessonFormOpen(true);
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsDeleteDialogOpen(true);
  };

  const handleManageWords = (lesson) => {
    setSelectedLesson(lesson);
    setIsWordsModalOpen(true);
  };

  const handleSaveLesson = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (selectedLesson) {
        await packageManagement.updateLesson(selectedLesson.id, data, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.lesson));
      } else {
        await packageManagement.createLesson({ ...data, partId }, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.lesson));
      }
      
      setIsLessonFormOpen(false);
      fetchData();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.lesson);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await packageManagement.deleteLesson(selectedLesson.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.lesson));
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.lesson);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="در حال بارگذاری..." />;
  if (!packageData || !chapterData || !partData) return <EmptyState title="اطلاعات یافت نشد" />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'مدیریت پکیج‌ها', href: '/admin/packages' },
          { label: packageData.packageName, href: `/admin/packages/${packageId}/chapters` },
          { label: chapterData.title, href: `/admin/packages/${packageId}/chapters/${chapterId}/parts` },
          { label: partData.title },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">درس‌های {partData.title}</h1>
          <p className="text-gray-600 mt-1">مدیریت درس‌های این بخش</p>
        </div>
        <button
          onClick={handleCreateLesson}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white
                   rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          افزودن درس
        </button>
      </div>

      {/* Content */}
      {lessons.length === 0 ? (
        <EmptyState
          icon={BookText}
          title="درسی یافت نشد"
          message="هنوز درسی برای این بخش ایجاد نشده است"
          action={
            <button
              onClick={handleCreateLesson}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                       transition-colors font-medium"
            >
              افزودن اولین درس
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {lessons
            .sort((a, b) => a.numericOrder - b.numericOrder)
            .map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-xl border border-gray-200 p-6
                         hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{lesson.numericOrder}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{lesson.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleManageWords(lesson)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary
                               rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      مدیریت واژگان
                    </button>
                    <button
                      onClick={() => handleEditLesson(lesson)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      aria-label="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson)}
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
      <LessonForm
        isOpen={isLessonFormOpen}
        onClose={() => setIsLessonFormOpen(false)}
        onSave={handleSaveLesson}
        lesson={selectedLesson}
        isLoading={isSubmitting}
      />

      <WordsManagement
        isOpen={isWordsModalOpen}
        onClose={() => setIsWordsModalOpen(false)}
        lesson={selectedLesson}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف درس"
        message={`آیا از حذف درس "${selectedLesson?.title}" اطمینان دارید؟ این عمل تمام واژگان مرتبط را نیز حذف می‌کند.`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

