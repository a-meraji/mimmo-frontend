"use client";

import { use, useCallback, useState, useEffect, useRef } from "react";
import ProductImage from "@/components/product/ProductImage";
import ProductInfo from "@/components/product/ProductInfo";
import CourseChapters from "@/components/product/CourseChapters";
import ProductTestimonials from "@/components/product/ProductTestimonials";
import CommentForm from "@/components/product/CommentForm";
import StickyProductInfo from "@/components/product/StickyProductInfo";
import { PackageConteiner } from "@/components/home";

// Mock data - In real app, fetch based on ID
const getProductData = (id) => {
  return {
    id,
    title: "Nuovo Espresso 1",
    subtitle: "دوره جامع یادگیری زبان ایتالیایی از سطح مقدماتی",
    image: "/es1.webp",
    price: 750000,
    originalPrice: 1200000,
    euroPrice: 25,
    originalEuroPrice: 30,
    rating: 4.9,
    reviewCount: 1237,
    description: `دوره Nuovo Espresso 1 یکی از کامل‌ترین و جامع‌ترین دوره‌های آموزش زبان ایتالیایی در سطح A1 است که با رویکرد علمی و کاربردی طراحی شده است. این دوره شامل ۱۰ فصل آموزشی است که هر فصل به طور دقیق و اصولی مهارت‌های چهارگانه زبان (خواندن، نوشتن، گفتن و شنیدن) را پوشش می‌دهد.
    
    در این دوره با استفاده از متدهای نوین تدریس و محتوای تعاملی، شما قادر خواهید بود تا در کوتاه‌ترین زمان ممکن با زبان ایتالیایی آشنا شوید و مکالمات روزمره را به راحتی انجام دهید. تمامی مباحث گرامری به زبان ساده و با مثال‌های کاربردی توضیح داده شده‌اند.
    
    علاوه بر این، دسترسی به بانک تمرینات تعاملی، آزمون‌های پایان فصل و پشتیبانی مستمر اساتید، یادگیری را برای شما لذت‌بخش‌تر و موثرتر می‌کند.`,
    specifications: [
      { icon: "BookOpenText", label: "تعداد درس", value: "۱۰ درس" },
      { icon: "Clock", label: "مدت زمان", value: "۲۴ ساعت" },
      { icon: "NotebookText", label: "تمرین و آزمون", value: "دارد" },
    ],
    seasons: [
      {
        title: "فصل ۱",
        totalDuration: "۲:۳۰ ساعت",
        chapters: [
          {
            title: "بخش اول (مقدماتی)",
            lessons: [
              { title: "درس اول", duration: "۱۰:۳۰", isFree: true },
              { title: "درس دوم", duration: "۱۵:۲۰", isFree: false },
              { title: "درس سوم", duration: "۱۲:۴۵", isFree: false },
            ]
          },
          {
            title: "بخش دوم (متوسطه)",
            lessons: [
              { title: "درس چهارم", duration: "۱۸:۱۰", isFree: false },
              { title: "درس پنجم", duration: "۲۰:۳۰", isFree: false },
            ]
          }
        ]
      },
      {
        title: "فصل ۲",
        totalDuration: "۳:۱۵ ساعت",
        chapters: [
          {
            title: "بخش اول",
            lessons: [
              { title: "درس اول", duration: "۱۴:۲۰", isFree: false },
              { title: "درس دوم", duration: "۱۶:۵۰", isFree: false },
            ]
          }
        ]
      },
      {
        title: "فصل ۳",
        totalDuration: "۲:۴۵ ساعت",
        chapters: [
          {
            title: "بخش اول",
            lessons: [
              { title: "درس اول", duration: "۱۲:۳۰", isFree: false },
            ]
          }
        ]
      },
      {
        title: "فصل ۴",
        totalDuration: "۳:۰۰ ساعت",
        chapters: [
          {
            title: "بخش اول",
            lessons: [
              { title: "درس اول", duration: "۱۵:۰۰", isFree: false },
            ]
          }
        ]
      },
      {
        title: "فصل ۵",
        totalDuration: "۲:۵۰ ساعت",
        chapters: [
          {
            title: "بخش اول",
            lessons: [
              { title: "درس اول", duration: "۱۳:۲۰", isFree: false },
            ]
          }
        ]
      },
      {
        title: "فصل ۶",
        totalDuration: "۳:۲۰ ساعت",
        chapters: [
          {
            title: "بخش اول",
            lessons: [
              { title: "درس اول", duration: "۱۷:۱۰", isFree: false },
            ]
          }
        ]
      },
    ]
  };
};

export default function ProductPage({ params }) {
  const { id } = use(params);
  const product = getProductData(id);
  const commentFormRef = useRef(null);
  const [showStickyInfo, setShowStickyInfo] = useState(false);
  
  const handleAddToCart = useCallback(() => {
    console.log('Added to cart:', product.id);
    // TODO: Implement cart logic
  }, [product.id]);

  const handleCommentSubmit = useCallback((commentData) => {
    console.log('Comment submitted:', commentData);
    // TODO: Implement comment submission
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
        // Hide when it comes back into view
        const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        console.log('Observer triggered:', { 
          isIntersecting: entry.isIntersecting, 
          top: entry.boundingClientRect.top,
          isScrolledPast 
        });
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
    <div className="min-h-screen bg-white py-16 sm:py-28">
      <div className="container mx-auto px-6">
        {/* Mobile Layout: Stacked */}
        <div className="lg:hidden space-y-6">
          <ProductImage
            image={product.image}
            title={product.title}
            description={product.description}
          />
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
          <CourseChapters seasons={product.seasons} />
          <ProductTestimonials />
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 ">
          {/* Left Column: Image & Chapters & Testimonials */}
          <div className="col-span-7 space-y-6">
            <ProductImage
              image={product.image}
              title={product.title}
              description={product.description}
            />
            <CourseChapters seasons={product.seasons} />
            <ProductTestimonials />
          </div>

          {/* Right Column: Info & Comment */}
          <div className="col-span-5">
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
                <CommentForm onSubmit={handleCommentSubmit} />
              </div>
            </div>
            
            {/* Sticky Product Info - Uses CSS sticky positioning */}
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
        </div>

      </div>

        {/* popular products */}
          <PackageConteiner title="دیگر محصولات محبوب میمو" />
    </div>
  );
}

