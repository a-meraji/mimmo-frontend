import { getPackageById } from "@/utils/serverApi";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const packageData = await getPackageById(id);
  
  if (!packageData) {
    return {
      title: "محصول یافت نشد - میمو آکادمی",
      description: "محصول مورد نظر یافت نشد"
    };
  }

  const title = `${packageData.packageName} - میمو آکادمی`;
  const description = packageData.description || packageData.subtitle || 
    `خرید دوره ${packageData.packageName} - ${packageData.subtitle}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: packageData.imageUrl ? [packageData.imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: packageData.imageUrl ? [packageData.imageUrl] : [],
    }
  };
}

