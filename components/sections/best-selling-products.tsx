"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeadingTitle } from "../heading-title";

export function BestSelling() {
  const { data: products, isLoading, error } = useProducts({page:1})


  return (
    <div className="py-4 lg:py-8 w-full">
      <div className="space-y-8 w-full">

        <HeadingTitle title="  Best Selling"/>
    

        {/* Loading State */}
        {isLoading ? (
          <div
            className="
             grid 
                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-5
                gap-4 
                px-4 sm:px-8 lg:px-10
                mb-8"
          >
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-60 w-full rounded-xl" />
            ))}
          </div>
        ) : products?.data &&  products?.data?.length > 0 ? (
          <>
      
            <div
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
              {products.data.slice(0, 8).map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>

            {/* View All Button */}
            {products.data.length > 8 && (
              <div className="text-center">
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
          </>
        ) : (
          <p className="text-center text-gray-600 py-10">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
}
