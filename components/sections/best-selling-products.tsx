"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeadingTitle } from "../heading-title";

export function BestSelling() {
  const { data: products, isLoading, error } = useProducts({ page: 1 });

  return (
    <div className="py-4 lg:py-8 w-full">
      <div className="space-y-8 w-full">
        <HeadingTitle title="Best Selling" />

        {/* Grid for Skeletons or Products */}
        <div
          className="
            grid 
            grid-cols-2 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-5 
            gap-4 
            px-4 sm:px-8 lg:px-10
          "
        >
          {isLoading
            ? [...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-xl" />
              ))
            : products?.data?.slice(0, 8).map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
        </div>

        {/* View All Button */}
        {!isLoading && products?.data && products?.data?.length > 8 && (
          <div className="text-center mt-4">
            <Link href="/products">
              <Button variant="outline" className="px-8 py-2 text-foreground transition-colors">
                View All
              </Button>
            </Link>
          </div>
        )}

        {/* No products fallback */}
        {!isLoading && (!products?.data || products.data.length === 0) && (
          <p className="text-center text-gray-600 py-10">No products found.</p>
        )}
      </div>
    </div>
  );
}
