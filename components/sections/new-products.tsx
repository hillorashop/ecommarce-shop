"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeadingTitle } from "../heading-title";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

export function NewProducts() {
  const { data: products, isLoading } = useProducts({
  page:1,
  sortBy:"createdAt",
  sortOrder:"asc",
  productName:"",
  minPrice:0,
  maxPrice:999999,
  categoryIds:[]
})

   const [isClient, setIsClient] = useState(false);
     useEffect(() => setIsClient(true), []);

  // ✅ Autoplay plugin
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="py-4 lg:py-8 bg-gray-50   relative">
      <HeadingTitle title="New Products" />

      {!isClient || isLoading ? (
        <div className="grid grid-flow-col auto-cols-[12rem] gap-4 px-4 sm:px-8 lg:px-10 overflow-x-auto mt-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : products?.data && products.data.length > 0 ? (
        <div className="relative mt-8">
          <Carousel className="w-full" plugins={[plugin.current]}>
       <CarouselContent
  className="
    grid grid-flow-col 
    auto-cols-[calc(50%-0.5rem)]     
    md:auto-cols-[calc(33.333%-0.67rem)] 
    lg:auto-cols-[calc(20%-0.8rem)]  
    gap-4 
    px-4 sm:px-8 lg:px-10 
    py-2
    lg:justify-center
  "
>
  {products.data.map((product) => (
    <CarouselItem key={product.id} className="w-full lg:w-auto">
      <ProductCard product={product} />
    </CarouselItem>
  ))}
</CarouselContent>

            {/* Optional Navigation Arrows */}
            <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 shadow-md hover:shadow-lg rounded-full p-2 transition">
              <ChevronLeft className="h-5 w-5 fill-primary" />
            </CarouselPrevious>

            <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 shadow-md hover:shadow-lg rounded-full p-2 transition">
              <ChevronRight className="h-5 w-5 fill-primary" />
            </CarouselNext>
          </Carousel>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10">No products found.</p>
      )}
    </div>
  );
}
