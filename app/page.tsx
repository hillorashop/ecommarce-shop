

import { HeroSection } from "@/components/sections/hero-section"
import { PromotionalBanners } from "@/components/sections/promotional-banners"
import { TopCategories } from "@/components/sections/top-categories"
import { AllProducts } from "@/components/sections/all-products"
import { BestSellingProducts } from "@/components/sections/best-selling-products"


export default async function  HomePage () {
 

  return (
    <div className="min-h-screen">
      <HeroSection/>
      <BestSellingProducts/>
      <TopCategories/>
      <PromotionalBanners />
      <AllProducts/>
    </div>
  )
}
