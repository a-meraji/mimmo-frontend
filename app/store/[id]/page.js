import ProductImage from "@/components/product/ProductImage";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import CourseChapters from "@/components/product/CourseChapters";
import ProductTestimonials from "@/components/product/ProductTestimonials";
import { PackageConteiner } from "@/components/home";
import { getAllPackagesPages, getCompletePackageStructure } from "@/utils/serverApi";
import { notFound } from "next/navigation";

// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

// Generate static params for all packages at build time
export async function generateStaticParams() {
  const packages = await getAllPackagesPages();
  
  return packages.map((pkg) => ({
    id: pkg.id,
  }));
}

// Transform chapters structure to match component expectations
function transformChaptersToSeasons(chapters) {
  if (!chapters || chapters.length === 0) return [];

  return chapters.map((chapter) => {
    // Calculate total duration from all lessons in all parts
    let totalMinutes = 0;
    const parts = chapter.parts || [];
    
    parts.forEach(part => {
      const lessons = part.lessons || [];
      lessons.forEach(lesson => {
        // Assuming each lesson is ~15 minutes (you can adjust this or get from backend)
        totalMinutes += 15;
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalDuration = `${hours}:${minutes.toString().padStart(2, '0')} ساعت`;

    // Transform parts to chapters format
    const transformedParts = parts.map(part => ({
      title: part.title,
      lessons: (part.lessons || []).map(lesson => ({
        title: lesson.title,
        duration: "۱۵:۰۰", // Default duration, adjust as needed
        isFree: false // Will need to fetch full lesson details for this
      }))
    }));

    return {
      title: chapter.title,
      totalDuration,
      chapters: transformedParts
    };
  });
}

export default async function ProductPage({ params }) {
  const { id } = params;
  
  // Fetch complete package structure
  const packageData = await getCompletePackageStructure(id);
  
  if (!packageData) {
    notFound();
  }

  // Transform data to match component props
  const product = {
    id: packageData.id,
    title: packageData.packageName,
    subtitle: packageData.subtitle,
    image: packageData.imageUrl,
    price: packageData.discountedPrice || packageData.originalPrice,
    originalPrice: packageData.discountedPrice ? packageData.originalPrice : null,
    euroPrice: null, // Not in backend data
    originalEuroPrice: null, // Not in backend data
    rating: packageData.rate || 0,
    reviewCount: packageData.rateCount || 0,
    description: packageData.description,
    specifications: packageData.specifications || [],
    seasons: transformChaptersToSeasons(packageData.chapters)
  };

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
          <ProductDetailClient product={product} />
          <CourseChapters seasons={product.seasons} />
          <ProductTestimonials packageId={id} />
        </div>

        {/* Desktop Layout: Grid */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Left Column: Image & Chapters & Testimonials */}
          <div className="col-span-7 space-y-6">
            <ProductImage
              image={product.image}
              title={product.title}
              description={product.description}
            />
            <CourseChapters seasons={product.seasons} />
            <ProductTestimonials packageId={id} />
          </div>

          {/* Right Column: Info & Comment */}
          <div className="col-span-5">
            <ProductDetailClient product={product} />
          </div>
        </div>
      </div>

      {/* Popular products */}
      <PackageConteiner title="دیگر محصولات محبوب میمو" />
    </div>
  );
}
