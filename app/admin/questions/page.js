'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { handleApiError, getSuccessMessage, ENTITY_NAMES } from '@/utils/errorHandler';
import { questionManagement } from '@/utils/adminApi';
import Breadcrumbs from '@/components/admin/Breadcrumbs';
import Pagination from '@/components/admin/ui/Pagination';
import Badge from '@/components/admin/ui/Badge';
import LoadingSpinner from '@/components/admin/ui/LoadingSpinner';
import EmptyState from '@/components/admin/ui/EmptyState';
import Modal from '@/components/admin/ui/Modal';
import TextArea from '@/components/admin/forms/TextArea';
import { HelpCircle, BookOpen } from 'lucide-react';

export default function QuestionsPage() {
  const { authenticatedFetch } = useAuth();
  const { success: notifySuccess, error: notifyError, warning: notifyWarning } = useNotification();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const fetchQuestions = async (status, page) => {
    try {
      setLoading(true);
      const response = await questionManagement.getQuestions(status, page, authenticatedFetch);
      setQuestions(response.data.questions || []);
      setTotalPages(Math.ceil(response.data.total / response.data.pageSize));
    } catch (error) {
      handleApiError(error, notifyError, ENTITY_NAMES.questions);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleAnswerQuestion = (question) => {
    setSelectedQuestion(question);
    setAnswerText(question.answer || '');
    setIsAnswerModalOpen(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) {
      notifyWarning('لطفاً پاسخ را وارد کنید');
      return;
    }

    try {
      setIsSubmitting(true);
      await questionManagement.answerQuestion(selectedQuestion.id, answerText.trim(), authenticatedFetch);
      notifySuccess('پاسخ با موفقیت ثبت شد');
      setIsAnswerModalOpen(false);
      fetchQuestions(activeTab, currentPage);
    } catch (error) {
      handleApiError(error, notifyError, 'ثبت پاسخ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'مدیریت سوالات' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت سوالات</h1>
          <p className="text-gray-600 mt-1">پاسخ به سوالات کاربران</p>
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
          بدون پاسخ
        </button>
        <button
          onClick={() => handleTabChange('ANSWERED')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'ANSWERED'
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          پاسخ داده شده
        </button>
        <button
          onClick={() => handleTabChange(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === null
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          همه
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="در حال بارگذاری سوالات..." />
      ) : questions.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="سوالی یافت نشد"
          message="سوالی با این وضعیت وجود ندارد"
        />
      ) : (
        <>
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-gray-900">
                        {question.user.name || question.user.email || 'کاربر نامشخص'}
                      </span>
                      <Badge variant={question.status === 'ANSWERED' ? 'success' : 'warning'}>
                        {question.status === 'ANSWERED' ? 'پاسخ داده شده' : 'در انتظار پاسخ'}
                      </Badge>
                      <Badge variant={question.visibility === 'PUBLIC' ? 'info' : 'default'}>
                        {question.visibility === 'PUBLIC' ? 'عمومی' : 'خصوصی'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <BookOpen className="w-4 h-4" />
                      <span>{question.lesson.title}</span>
                      <span className="text-gray-400">•</span>
                      <span>{new Date(question.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">سوال:</p>
                    <p className="text-gray-900 leading-relaxed">{question.content}</p>
                  </div>

                  {question.answer && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">پاسخ:</p>
                      <p className="text-green-800 leading-relaxed">{question.answer}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 mt-4">
                  <button
                    onClick={() => handleAnswerQuestion(question)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90
                             transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    {question.status === 'ANSWERED' ? 'ویرایش پاسخ' : 'پاسخ دادن'}
                  </button>
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

      {/* Answer Modal */}
      <Modal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        title="پاسخ به سوال"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setIsAnswerModalOpen(false)}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700
                       hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              لغو
            </button>
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium
                       hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'در حال ثبت...' : 'ثبت پاسخ'}
            </button>
          </>
        }
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">سوال:</p>
              <p className="text-gray-900">{selectedQuestion.content}</p>
            </div>

            <TextArea
              label="پاسخ شما"
              name="answer"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={6}
              placeholder="پاسخ خود را اینجا بنویسید..."
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

