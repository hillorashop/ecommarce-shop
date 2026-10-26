import { HeroSection } from "@/components/sections/hero-section";
import { PromotionalBanners } from "@/components/sections/promotional-banners";
import { TopCategories } from "@/components/sections/top-categories";
import { AllProducts } from "@/components/sections/all-products";
import { BestSellingProducts } from "@/components/sections/best-selling-products";
import { ClientReviewsSection } from "@/components/sections/client-reviews-section";
import { BlogsSection } from "@/components/sections/blogs-section";
import { getPromotionalBanner } from "@/actions/promotional-banner";

export default async function HomePage() {
  const initialBanner = await getPromotionalBanner().catch(() => null);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <BestSellingProducts />
      <TopCategories />
      <PromotionalBanners initialBanner={initialBanner?.data} />
      <AllProducts />
      <ClientReviewsSection />
      <BlogsSection />
    </div>
  );
}
