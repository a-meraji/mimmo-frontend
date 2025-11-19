"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ProductInfo from "./ProductInfo";
import CommentForm from "./CommentForm";
import StickyProductInfo from "./StickyProductInfo";

export default function ProductDetailClient({ product }) {
  const commentFormRef = useRef(null);
  const [showStickyInfo, setShowStickyInfo] = useState(false);

  const handleAddToCart = useCallback(() => {
    console.log('Added to cart:', product.id);
    // Cart logic is handled by CartContext in ProductInfo
  }, [product.id]);

  const handleCommentCreated = useCallback((comment) => {
    console.log('Comment created:', comment);
    // Comment is created and will be shown after admin approval
  }, []);

  // Intersection Observer for CommentForm on desktop
  useEffect(() => {
    const commentForm = commentFormRef.current;
    if (!commentForm) return;

    // Check if we're on desktop
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky when CommentForm is not visible (scrolled past it)
        const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowStickyInfo(isScrolledPast);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px 0px 0px'
      }
    );

    observer.observe(commentForm);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Mobile: Stacked ProductInfo and CommentForm */}
      <div className="lg:hidden space-y-6">
        <ProductInfo
          id={product.id}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          originalPrice={product.originalPrice}
          euroPrice={product.euroPrice}
          originalEuroPrice={product.originalEuroPrice}
          image={product.image}
          rating={product.rating}
          reviewCount={product.reviewCount}
          specifications={product.specifications}
          onAddToCart={handleAddToCart}
        />
        <CommentForm packageId={product.id} onCommentCreated={handleCommentCreated} />
      </div>

      {/* Desktop: Sticky behavior */}
      <div className="hidden lg:block">
        <div className="space-y-6">
          <ProductInfo
            id={product.id}
            title={product.title}
            subtitle={product.subtitle}
            price={product.price}
            originalPrice={product.originalPrice}
            euroPrice={product.euroPrice}
            originalEuroPrice={product.originalEuroPrice}
            image={product.image}
            rating={product.rating}
            reviewCount={product.reviewCount}
            specifications={product.specifications}
            onAddToCart={handleAddToCart}
          />
          <div ref={commentFormRef}>
            <CommentForm packageId={product.id} onCommentCreated={handleCommentCreated} />
          </div>
        </div>

        {/* Sticky Product Info */}
        <StickyProductInfo
          id={product.id}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          originalPrice={product.originalPrice}
          euroPrice={product.euroPrice}
          originalEuroPrice={product.originalEuroPrice}
          image={product.image}
          rating={product.rating}
          reviewCount={product.reviewCount}
          onAddToCart={handleAddToCart}
          isVisible={showStickyInfo}
        />
      </div>
    </>
  );
}

