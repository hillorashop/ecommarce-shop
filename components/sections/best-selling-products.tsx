"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";

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
import { pushToDataLayer } from "@/lib/gtm";
import { siteMeta } from "@/data";
import { useBestSellingProducts } from "@/hooks/use-products";
import { hasFiredEvent, markEventFired } from "@/lib/event-dedupe";
import { trackEcommerceEvent } from "@/lib/custom-tm";

export function getEffectivePrice(product: any) {

  const unitFields = [
    { data: product.kgUnit, label: "kg" },
    { data: product.gramUnit, label: "g" },
    { data: product.piecesUnit, label: "pcs" },
  ];

  for (const { data } of unitFields) {
    if (data && typeof data === "object") {
      const entries = Object.entries(data);
      if (entries.length > 0) {
        const firstUnit = entries[0][1] as { price: number; discountPrice: number };
        return {
          price: firstUnit.price,
          discountPrice: firstUnit.discountPrice,
        };
      }
    }
  }

  return {
    price: product.price,
    discountPrice: product.discountPrice,
  };
}



export function BestSellingProducts() {
  const { data: bestSellingProducts, isLoading } = useBestSellingProducts()



   const [isClient, setIsClient] = useState(false);
     useEffect(() => setIsClient(true), []);

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

 useEffect(() => {
  if (!isClient || !bestSellingProducts?.data || bestSellingProducts.data.length === 0) return;

  const key = "view_item_list:best_selling"; 
  if (hasFiredEvent(key)) return;
  markEventFired(key);

  const ecommerce = {
    item_list_id: "best_selling",
    item_list_name: "Best Selling",
    currency: "BDT",
    affiliation: siteMeta?.siteName || "Online Store",
    items: bestSellingProducts.data.map((product, index) => {
      const effective = getEffectivePrice(product);
      const price = effective.price;
      const discountPrice = effective.discountPrice;
      const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
      const finalPrice = hasDiscount ? discountPrice : price;
      const discountAmount = hasDiscount ? price - discountPrice : 0;

      return {
        item_id: product.id,
        item_name: product.name,
        price: finalPrice,
        discount: discountAmount,
        item_brand: siteMeta?.siteName || "Online Store",
        index: index + 1,
        quantity: 1,
      };
    }),
  };

  pushToDataLayer("view_item_list", ecommerce);
  trackEcommerceEvent("view_item_list", ecommerce);
}, [isClient, bestSellingProducts]);



  return (
    <div className="py-4 lg:py-8 bg-gradient-to-br from-primary/5 via-background to-accent/10  relative">
      <HeadingTitle title="Best Selling"/>

      {!isClient || isLoading ? (
        <div className="grid grid-flow-col auto-cols-[12rem] gap-4 px-4 sm:px-8 lg:px-10 overflow-x-auto mt-8">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : bestSellingProducts?.data && bestSellingProducts.data.length > 0 ? (
        <div className="relative mt-8">
          <Carousel className="w-full" plugins={[plugin.current]}>
       <CarouselContent
  className="
 grid grid-flow-col
  auto-cols-[50%]
  md:auto-cols-[33.333%]
  lg:auto-cols-[25%]
  xl:auto-cols-[20%]
    gap-4 
    px-4 sm:px-8 lg:px-10 
    py-2

  "
>
  {!bestSellingProducts.data || bestSellingProducts.data.length === 0 ? null :  bestSellingProducts?.data.map((product, index) => (
    <CarouselItem key={product.id} className="w-full lg:w-auto">
      <ProductCard product={product} index={index}/>
    </CarouselItem>
  ))}
</CarouselContent>

        
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
