import StoreHero from "@/components/store/StoreHero";
import StoreContent from "@/components/store/StoreContent";
import { getAllPackagesPages } from "@/utils/serverApi";

// ISR: Revalidate every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function StorePage() {
  // Fetch all packages at build time
  const packages = await getAllPackagesPages();

  return (
    <div className="min-h-screen bg-white relative">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" aria-hidden="true" />
      
      {/* Hero Section */}
      <StoreHero />

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-12">
        <StoreContent packages={packages} />
      </section>
    </div>
  );
}
