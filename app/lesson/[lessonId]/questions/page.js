"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Send, RefreshCw, Lock, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLessonPublicQuestions, getUserQuestionsOnLesson, createQuestion } from '@/utils/questionApi';
import LessonNavTabs from '@/components/lesson/LessonNavTabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LessonQuestionsPage({ params }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, authenticatedFetch } = useAuth();
  const { toast } = useToast();
  
  // Questions state
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // New question form state
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch public questions
        const publicResult = await getLessonPublicQuestions(lessonId, currentPage);
        
        if (publicResult.success) {
          setPublicQuestions(publicResult.data);
          setTotalPages(publicResult.totalPages);
        } else {
          setError(publicResult.error);
        }

        // Fetch user's own questions if authenticated
        if (isAuthenticated && user) {
          const userResult = await getUserQuestionsOnLesson(user.id, lessonId);
          
          if (userResult.success) {
            setUserQuestions(userResult.data);
          }
        }

      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('خطا در بارگذاری سوالات');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading) {
      fetchQuestions();
    }
  }, [lessonId, currentPage, isAuthenticated, isLoading, user]);

  // Handle question submission
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('برای ارسال سوال باید وارد شوید');
      return;
    }

    if (!newQuestionContent.trim()) {
      toast.error('لطفاً متن سوال را وارد کنید');
      return;
    }

    setSubmitting(true);

    const result = await createQuestion(newQuestionContent.trim(), lessonId, authenticatedFetch);
    
    if (result.success) {
      toast.success('سوال شما با موفقیت ارسال شد');
      setNewQuestionContent('');
      
      // Add to user questions list
      setUserQuestions(prev => [result.data, ...prev]);
    } else {
      toast.error(result.error || 'خطا در ارسال سوال');
    }
    
    setSubmitting(false);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (loading && currentPage === 1) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow flex items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <p className="text-lg font-medium text-text-gray">در حال بارگذاری سوالات...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gradient-purple via-white to-gradient-yellow py-8 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-gray mb-6" aria-label="مسیر صفحه">
          <Link href="/learn" className="hover:text-primary transition-colors">
            بخش یادگیری
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-text-light" aria-hidden="true" />
          <span className="text-text-charcoal font-medium">پرسش و پاسخ</span>
        </nav>

        {/* Lesson Navigation Tabs */}
        <LessonNavTabs lessonId={lessonId} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Public Questions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-light rounded-2xl p-6 shadow-lg">
              <h2 className="flex items-center gap-2 text-xl font-bold text-text-charcoal mb-6">
                <MessageCircle className="w-6 h-6 text-primary" aria-hidden="true" />
                سوالات عمومی
              </h2>

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 mb-4">
                  {error}
                </div>
              )}

              {publicQuestions.length === 0 ? (
                <div className="text-center py-12 bg-neutral-extralight/50 rounded-xl">
                  <MessageCircle className="w-12 h-12 text-neutral-gray mx-auto mb-3" aria-hidden="true" />
                  <p className="text-text-gray">هنوز سوالی برای این درس ثبت نشده است</p>
                  <p className="text-sm text-text-light mt-1">اولین نفری باشید که سوال می‌پرسد!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {publicQuestions.map((question) => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-neutral-extralight hover:bg-neutral-indigo/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" aria-hidden="true" />
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                            currentPage === i + 1
                              ? 'bg-primary text-white'
                              : 'border border-neutral-extralight hover:bg-neutral-indigo/10 text-text-charcoal'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-neutral-extralight hover:bg-neutral-indigo/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Ask Question & User Questions */}
          <div className="space-y-6">
            {/* Ask Question Form */}
            <div className="bg-white border border-neutral-light rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-text-charcoal mb-4">
                سوال خود را بپرسید
              </h3>

              {isAuthenticated ? (
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <textarea
                    value={newQuestionContent}
                    onChange={(e) => setNewQuestionContent(e.target.value)}
                    placeholder="سوال خود را اینجا بنویسید..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-neutral-extralight rounded-xl focus:border-primary focus:outline-none resize-none"
                  />
                  
                  <button
                    type="submit"
                    disabled={submitting || !newQuestionContent.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" aria-hidden="true" />
                        ارسال سوال
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 bg-neutral-extralight/50 rounded-xl">
                  <Lock className="w-8 h-8 text-neutral-gray mx-auto mb-2" aria-hidden="true" />
                  <p className="text-sm text-text-gray mb-3">
                    برای ارسال سوال باید وارد شوید
                  </p>
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    ورود به حساب کاربری
                  </Link>
                </div>
              )}
            </div>

            {/* User's Questions */}
            {isAuthenticated && userQuestions.length > 0 && (
              <div className="bg-white border border-neutral-light rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-text-charcoal mb-4">
                  سوالات شما ({userQuestions.length})
                </h3>
                
                <div className="space-y-3">
                  {userQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="p-3 bg-neutral-indigo/10 rounded-lg border border-neutral-extralight"
                    >
                      <p className="text-sm text-text-charcoal mb-2">
                        {question.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        {question.status === 'ANSWERED' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                            <span className="text-emerald-600 font-medium">پاسخ داده شده</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" aria-hidden="true" />
                            <span className="text-amber-600 font-medium">در انتظار پاسخ</span>
                          </>
                        )}
                        <span className="text-neutral-gray">•</span>
                        <span className="text-neutral-gray">
                          {question.visibility === 'PUBLIC' ? 'عمومی' : 'خصوصی'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function QuestionCard({ question }) {
  return (
    <div className="border border-neutral-extralight rounded-xl p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-charcoal mb-2">
            {question.content}
          </p>
          
          {question.answer && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-emerald-700 mb-1">پاسخ:</p>
              <p className="text-sm text-emerald-900">{question.answer}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3 text-xs text-text-light">
            <span>{new Date(question.createdAt).toLocaleDateString('fa-IR')}</span>
            {question.answeredAt && (
              <>
                <span>•</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-600">پاسخ داده شده</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

