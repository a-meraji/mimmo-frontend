"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, ChevronDown, ChevronUp, Loader2, MessageSquare } from "lucide-react";
import { getCommentsByPackageId } from "@/utils/commentApi";

const TestimonialCard = ({ comment }) => {
  // Calculate rating (default to 5 for now since backend doesn't have rating field)
  const rating = 5;
  
  // Get user display name
  const userName = comment.user?.name && comment.user?.familyName
    ? `${comment.user.name} ${comment.user.familyName}`
    : comment.user?.name || comment.user?.email || 'کاربر';

  // Get first letter for avatar
  const avatarLetter = userName.charAt(0);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-2xl p-6 border border-neutral-extralight hover:shadow-lg transition-shadow duration-300">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4" role="img" aria-label={`${rating} از 5 ستاره`}>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? "fill-secondary text-secondary"
                : "fill-neutral-extralight text-neutral-extralight"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="text-text-gray text-xs leading-relaxed mb-4">
        {comment.content}
      </blockquote>

      {/* Profile Section */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-extralight">
        <div className="flex items-center gap-3">
          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary text-sm font-bold">
              {avatarLetter}
            </span>
          </div>

          {/* Name */}
          <div>
            <h4 className="font-semibold text-text-charcoal text-sm">
              {userName}
            </h4>
            {comment.createdAt && (
              <p className="text-xs text-text-gray">{formatDate(comment.createdAt)}</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {comment.status === 'APPROVED' && (
          <span className="text-xs bg-green-500/10 text-green-700 px-2 py-1 rounded-full">
            تایید شده
          </span>
        )}
      </div>
    </article>
  );
};

export default function ProductTestimonials({ packageId, initialComments = [] }) {
  const [comments, setComments] = useState(initialComments);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Fetch comments from backend
  useEffect(() => {
    if (!packageId) return;

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await getCommentsByPackageId(packageId, 0);
        
        if (response?.status === 200 && response?.data?.comments) {
          setComments(response.data.comments);
          // If we got less than 10 comments, there are no more pages
          setHasMore(response.data.comments.length >= 10);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        // Keep using initial comments if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [packageId]);

  // Load more comments
  const loadMoreComments = async () => {
    if (!packageId || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getCommentsByPackageId(packageId, nextPage);
      
      if (response?.status === 200 && response?.data?.comments) {
        const newComments = response.data.comments;
        setComments(prev => [...prev, ...newComments]);
        setCurrentPage(nextPage);
        
        // If we got less than 10 comments, no more pages available
        if (newComments.length < 10) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayComments = showAll ? comments : comments.slice(0, 3);
  const canShowMore = comments.length > 3 || hasMore;

  const handleShowMore = () => {
    if (showAll) {
      setShowAll(false);
    } else if (comments.length > 3) {
      setShowAll(true);
    } else if (hasMore) {
      loadMoreComments();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-extralight p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-charcoal flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          نظرات کاربران
        </h2>
        <span className="text-xs text-text-light">
          {comments.length} نظر
        </span>
      </div>

      {/* Loading State */}
      {isLoading && comments.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && comments.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-text-light mx-auto mb-3" />
          <p className="text-text-gray text-sm">
            هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <>
          <div className="space-y-4">
            {displayComments.map((comment) => (
              <TestimonialCard key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Show More/Less Button */}
          {canShowMore && (
            <button
              onClick={handleShowMore}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-extralight text-primary hover:bg-primary/5 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال بارگذاری...
                </>
              ) : showAll ? (
                <>
                  <span>نمایش کمتر</span>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>نمایش نظرات بیشتر</span>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
