'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { packageManagement } from '@/utils/adminApi';
import { clientAPI } from '@/utils/fetchInstance';
import { getImageUrl } from '@/utils/imageUrl';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';
import WordForm from './WordForm';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';

export default function WordsManagement({ isOpen, onClose, lesson }) {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && lesson?.id) {
      fetchWords();
    }
  }, [isOpen, lesson?.id]);

  const fetchWords = async () => {
    if (!lesson?.id) return;
    
    try {
      setLoading(true);
      const response = await clientAPI.post('/package/words', { lessonId: lesson.id });
      setWords(response?.data || []);
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.word);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWord = () => {
    setSelectedWord(null);
    setIsWordFormOpen(true);
  };

  const handleEditWord = (word) => {
    setSelectedWord(word);
    setIsWordFormOpen(true);
  };

  const handleDeleteWord = (word) => {
    setSelectedWord(word);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveWord = async (data) => {
    try {
      setIsSubmitting(true);
      
      if (selectedWord) {
        await packageManagement.updateWord(selectedWord.id, data, authenticatedFetch);
        notifySuccess(getSuccessMessage('update', ENTITY_NAMES.word));
      } else {
        await packageManagement.createWord({ ...data, lessonId: lesson.id }, authenticatedFetch);
        notifySuccess(getSuccessMessage('create', ENTITY_NAMES.word));
      }
      
      setIsWordFormOpen(false);
      fetchWords();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.word);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);
      await packageManagement.deleteWord(selectedWord.id, authenticatedFetch);
      notifySuccess(getSuccessMessage('delete', ENTITY_NAMES.word));
      setIsDeleteDialogOpen(false);
      fetchWords();
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.word);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`واژگان درس: ${lesson?.title || ''}`}
        size="2xl"
        footer={
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            بستن
          </button>
        }
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <p className="text-gray-600">مدیریت واژگان این درس</p>
            <button
              onClick={handleCreateWord}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              افزودن واژه
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="py-8">
              <LoadingSpinner message="در حال بارگذاری واژگان..." />
            </div>
          ) : words.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="واژه‌ای یافت نشد"
              message="هنوز واژه‌ای برای این درس ایجاد نشده است"
              action={
                <button
                  onClick={handleCreateWord}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  افزودن اولین واژه
                </button>
              }
            />
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {word.imageUrl && (
                      <img
                        src={getImageUrl(word.imageUrl)}
                        alt={word.word}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{word.word}</h4>
                      <p className="text-sm text-gray-600">{word.title}</p>
                      <p className="text-xs text-gray-500">{word.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditWord(word)}
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                      aria-label="ویرایش"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWord(word)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Word Form Modal */}
      <WordForm
        isOpen={isWordFormOpen}
        onClose={() => setIsWordFormOpen(false)}
        onSave={handleSaveWord}
        word={selectedWord}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف واژه"
        message={`آیا از حذف واژه "${selectedWord?.word}" اطمینان دارید؟`}
        confirmText="حذف"
        variant="danger"
        isLoading={isSubmitting}
      />
    </>
  );
}

