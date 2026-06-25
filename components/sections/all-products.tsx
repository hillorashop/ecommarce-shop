"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeadingTitle } from "../heading-title";
import { useEffect, useState } from "react";
import { pushToDataLayer } from "@/lib/gtm";
import { siteMeta } from "@/data";
import { hasFiredEvent, markEventFired } from "@/lib/event-dedupe";
import { trackEcommerceEvent } from "@/lib/custom-tm";
import { getEffectivePrice } from "./best-selling-products";

export function AllProducts() {
  const { data: products, isLoading } = useProducts({ page: 1 });
  const [isClient, setIsClient] = useState(false);
    const skeletonCount = 8;

  useEffect(() => setIsClient(true), []);

useEffect(() => {
  if (!isClient || !products?.data || products.data.length === 0) return;
  const key = "view_item_list:all_products";
  if (hasFiredEvent(key)) return;
  markEventFired(key);

 const ecommerce = {
    item_list_id: "all_products",
    item_list_name: "All Products",
    currency: "BDT",
    affiliation: siteMeta?.siteName || "Online Store",
    items: products.data.map((product, index) => {
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
}, [isClient, products]);



  return (
    <div className="py-4 lg:py-8 w-full">
      <div className="space-y-8 w-full">
        <HeadingTitle title="All Products" />

    
        <div className="flex justify-center">
          <div
            className="
              grid
              grid-cols-2                   
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
              gap-4
              px-4
              md:px-6
              lg:px-8
              w-full 
                        
            "
          >
            {isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-60 w-full rounded-xl"
                  />
                ))
              : products?.data?.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
          </div>
        </div>

  
        {!isLoading && products?.data && products.data.length > 8 && (
          <div className="text-center mt-4">
            <Link href="/products">
              <Button
                variant="outline"
                className="px-8 py-2 text-foreground transition-colors"
              >
                View All
              </Button>
            </Link>
          </div>
        )}

 
        {!isLoading && (!products?.data || products.data.length === 0) && (
          <p className="text-center text-gray-600 py-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
