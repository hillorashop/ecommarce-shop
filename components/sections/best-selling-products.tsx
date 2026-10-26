"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { HeadingTitle } from "../heading-title";
import { useEffect, useState } from "react";
import { pushToDataLayer } from "@/lib/gtm";
import { siteMeta } from "@/data";
import { useCustomQuery } from "@/hooks/use-query";
import { getBestSellingProducts, BestSellingProductResponse } from "@/actions/product";
import { hasFiredEvent, markEventFired } from "@/lib/event-dedupe";
import { trackEcommerceEvent } from "@/lib/custom-tm";
import { useKeenSlider } from "keen-slider/react";
import { AutoplayPlugin } from "@/lib/keen-autoplay";

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
  const { data: bestSellingProducts, isLoading } = useCustomQuery<BestSellingProductResponse>(
    ["best-selling-products"],
    () => getBestSellingProducts()
  );
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const items = bestSellingProducts?.data ?? [];
  const canLoop = items.length > 5;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      slides: {
        perView: 2,
        spacing: 12,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 3, spacing: 16 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 4, spacing: 16 },
        },
        "(min-width: 1280px)": {
          slides: { perView: 5, spacing: 20 },
        },
      },
    },
    items.length > 1 ? [AutoplayPlugin(3500, true)] : []
  );

  useEffect(() => {
    instanceRef.current?.update();
  }, [items, instanceRef]);

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
    <div className="py-4 lg:py-8 bg-gradient-to-br from-primary/5 via-background to-accent/10 relative">
      <HeadingTitle title="Best Selling" />

      {!isClient || isLoading ? (
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div className="keen-slider py-4 px-1 gap-3 sm:gap-4 lg:gap-4 xl:gap-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="keen-slider__slide p-1 min-w-[calc(50%-6px)] sm:min-w-[calc(33.333%-11px)] lg:min-w-[calc(25%-12px)] xl:min-w-[calc(20%-16px)] max-w-[calc(50%-6px)] sm:max-w-[calc(33.333%-11px)] lg:max-w-[calc(25%-12px)] xl:max-w-[calc(20%-16px)] flex-shrink-0"
              >
                <div className="border border-gray-100 bg-white p-0 h-[380px] flex flex-col justify-between shadow-md rounded-none">
                  <Skeleton className="w-full aspect-[4/4] rounded-none" />
                  <div className="p-3 sm:p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-7 sm:h-8 w-full mt-2" />
                    <Skeleton className="h-7 sm:h-8 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div ref={sliderRef} className="keen-slider py-4 px-1">
            {items.map((product, index) => (
              <div key={product.id} className="keen-slider__slide flex p-1">
                <ProductCard product={product} index={index} className="w-full h-full shadow-md hover:shadow-xl" />
              </div>
            ))}
          </div>

          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
            aria-label="Next products"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10">No products found.</p>
      )}
    </div>
  );
}
