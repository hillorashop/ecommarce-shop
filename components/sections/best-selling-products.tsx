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

export function BestSelling() {
  const { data: products, isLoading } = useProducts({ page: 1 });
  const [isClient, setIsClient] = useState(false);
    const skeletonCount = 8;

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient || !products?.data || products.data.length === 0) return;

    const items = products.data.map((product, index) => ({
      item_id: product.id,
      item_name: product.name,
      price: product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price,
      discount: product.discountPrice && product.discountPrice > 0 ? product.price - product.discountPrice : 0,
      index,
      item_brand: siteMeta.siteName,
      item_list_id: "best_selling",
      item_list_name: "Best Selling",
      quantity: 1,
    }));

    pushToDataLayer("view_item_list", {
      item_list_id: "best_selling",
      item_list_name: "Best Selling",
      items,
    });
  }, [isClient, products]);



  return (
    <div className="py-4 lg:py-8 w-full">
      <div className="space-y-8 w-full">
        <HeadingTitle title="Best Selling" />

        {/* Wrapper for centering */}
        <div className="flex justify-center">
          <div
            className="
              grid
              grid-cols-2                     /* mobile */
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]  /* LG: min 200px, max stretch */
              gap-4
              px-4 sm:px-8 lg:px-10
              min-w-[200px]
              max-w-[2000px]                 
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

        {/* View All Button */}
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

        {/* No products fallback */}
        {!isLoading && (!products?.data || products.data.length === 0) && (
          <p className="text-center text-gray-600 py-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
