"use client";

import { useCustomQuery } from "@/hooks/use-query";
import { getProducts, ProductsResponse } from "@/actions/product";
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
  const { data: products, isLoading } = useCustomQuery<ProductsResponse>(
    ["products", 1],
    () => getProducts(1)
  );
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
            {!isClient || isLoading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <div key={i} className="border border-gray-100 bg-white h-[380px] flex flex-col justify-between shadow-md rounded-none">
                    <Skeleton className="w-full aspect-[4/4] rounded-none" />
                    <div className="p-3 sm:p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-7 sm:h-8 w-full mt-2" />
                      <Skeleton className="h-7 sm:h-8 w-full" />
                    </div>
                  </div>
                ))
              : products?.data?.map((product, index) => (
                  <div key={product.id || index} className="flex">
                    <ProductCard product={product} index={index} className="w-full h-full shadow-md hover:shadow-xl" />
                  </div>
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
