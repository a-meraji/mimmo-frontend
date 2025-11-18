'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { commentManagement } from '@/utils/adminApi';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import Pagination from '@/components/admin/ui/Pagination';
import Badge from '@/components/admin/ui/Badge';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import ConfirmDialog from '@/components/admin/ui/ConfirmDialog';
import { MessageSquare, Check, Trash2, Package } from 'lucide-react';

export default function CommentsPage() {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const fetchComments = async (status, page) => {
    try {
      setLoading(true);
      const response = await commentManagement.getAll(status, page, authenticatedFetch);
      setComments(response.data.comments || []);
      setTotalPages(Math.ceil(response.data.total / response.data.pageSize));
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.comments);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleApprove = async (comment) => {
    try {
      setIsSubmitting(true);
      await commentManagement.changeStatus(comment.id, 'APPROVED', authenticatedFetch);
      notifySuccess(getSuccessMessage('approve', ENTITY_NAMES.comment));
      fetchComments(activeTab, currentPage);
    } catch (error) {
      handleApiError(error, notifyError, 'تأیید ' + ENTITY_NAMES.comment);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (comment) => {
    setSelectedComment(comment);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await commentManagement.deleteById(selectedComment.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.comment));
      setIsDeleteDialogOpen(false);
      fetchComments(activeTab, currentPage);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.comment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'مدیریت نظرات' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت نظرات</h1>
          <p className="text-gray-600 mt-1">بررسی و تأیید نظرات کاربران</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex gap-1">
        <button
          onClick={() => handleTabChange('PENDING')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'PENDING'
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          در انتظار تأیید
        </button>
        <button
          onClick={() => handleTabChange('APPROVED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'APPROVED'
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          تأیید شده
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="در حال بارگذاری نظرات..." />
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="نظری یافت نشد"
          message={`نظری با وضعیت "${activeTab === 'PENDING' ? 'در انتظار تأیید' : 'تأیید شده'}" وجود ندارد`}
        />
      ) : (
        <>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {comment.user.name || comment.user.email || 'کاربر نامشخص'}
                        </span>
                        <Badge variant={comment.status === 'APPROVED' ? 'success' : 'warning'}>
                          {comment.status === 'APPROVED' ? 'تأیید شده' : 'در انتظار'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Package className="w-4 h-4" />
                      <span>{comment.package.packageName}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{comment.content}</p>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {activeTab === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(comment)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white
                                 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium
                                 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        تأیید
                      </button>
                      <button
                        onClick={() => handleReject(comment)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white
                                 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium
                                 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        رد و حذف
                      </button>
                    </>
                  )}
                  {activeTab === 'APPROVED' && (
                    <button
                      onClick={() => handleReject(comment)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white
                               rounded-lg hover:bg-red-700 transition-colors text-sm font-medium
                               disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف نظر"
        message="آیا از حذف این نظر اطمینان دارید؟ این عمل قابل بازگشت نیست."
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

