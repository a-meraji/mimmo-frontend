"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { createComment } from "@/utils/commentApi";
import { Loader2 } from "lucide-react";

export default function CommentForm({ packageId, onCommentCreated }) {
  const { user, accessToken, isLoading } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user || !accessToken) {
      toast.error('برای ثبت نظر ابتدا باید وارد حساب کاربری خود شوید');
      return;
    }

    // Validate comment
    if (!comment.trim()) {
      toast.error('لطفاً نظر خود را بنویسید');
      return;
    }

    if (!packageId) {
      toast.error('خطا در شناسایی پکیج');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createComment(packageId, comment.trim(), accessToken);
      
      if (response?.status === 201) {
        toast.success('نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود');
        setComment(''); // Reset form
        
        // Notify parent component if callback provided
        if (onCommentCreated) {
          onCommentCreated(response.data?.comment);
        }
      } else {
        throw new Error('Failed to create comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'خطا در ثبت نظر';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      <h2 className="text-lg font-bold text-text-charcoal">دیدگاه خود را بنویسید</h2>

      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
          <p className="text-text-gray text-sm">در حال بارگذاری...</p>
        </div>
      ) : !user ? (
        <div className="text-center py-8">
          <p className="text-text-gray text-sm mb-4">
            برای ثبت نظر باید وارد حساب کاربری خود شوید
          </p>
          <a
            href="/auth"
            className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            ورود / ثبت‌نام
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Display */}
          <div className="flex items-center gap-3 p-3 bg-neutral-indigo rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-charcoal">
                {user.name && user.familyName 
                  ? `${user.name} ${user.familyName}`
                  : user.name || user.email || 'کاربر'}
              </p>
              <p className="text-xs text-text-gray">در حال نوشتن نظر</p>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="block text-xs font-medium text-text-gray">
              دیدگاه :
            </label>
            <textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              rows={6}
              className="w-full px-4 py-3 rounded-xl border border-neutral-extralight bg-white text-text-charcoal placeholder:text-text-light focus:border-primary focus:ring-0 focus:outline-none transition-all duration-200 text-xs resize-none disabled:bg-neutral-extralight disabled:cursor-not-allowed"
              placeholder="نظر خود را بنویسید..."
            />
            <p className="text-xs text-text-light">
              نظر شما پس از تایید مدیر نمایش داده خواهد شد
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              'ارسال نظر'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
