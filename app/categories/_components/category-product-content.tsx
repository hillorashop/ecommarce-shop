"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import {  ArrowLeft, ArrowRight } from "lucide-react";



import {useState } from "react";
import { dbProductwihtoutAll } from "@/actions/product";
import { useCategoryProducts } from "@/hooks/use-categories";

interface Props {
  sortBy?: "price" |  "createdAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  categoryUrl:string;
}

export const CategoryProductsContent = ({
  sortBy,
  sortOrder,
  minPrice,
  maxPrice,
  categoryUrl,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: category, isLoading } = useCategoryProducts({
    categoryUrl,
    page:currentPage,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    
});

  return (
    <>

      {isLoading ? (
        <div className="
              grid
              grid-cols-2                   
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-3
              xl:grid-cols-4 gap-2 w-full">
          {[...Array(8)].map((_, i) => (
      
             <div
              key={i}
              className="p-3 border rounded-xl  space-y-3"
            >
              
              <Skeleton className="h-40 w-full rounded-lg" />
           
              <Skeleton className="h-4 w-3/4" />
          
              <Skeleton className="h-4 w-1/2" />
             
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
   
          
          ))}
        </div>
      ) : category?.data && category?.data.length > 0 ? (
        <>
          
          <div className="grid 
              grid-cols-2                   
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-3
              xl:grid-cols-4 gap-2">
            {category.data.map((product: dbProductwihtoutAll, index: number) => (
              <ProductCard product={product} key={index} />
            ))}
          </div>

          
          <div className="flex justify-center items-center gap-4 pt-10">
            <Button
            size={"icon"}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
               <ArrowLeft className="size-4"/>
            </Button>

            <span className="text-sm text-muted-foreground font-medium">
              Page {currentPage} of {category.totalPages}
            </span>

            <Button
            size={"icon"}
              disabled={currentPage >= category.totalPages!}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
        <ArrowRight className="size-4"/>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 py-20 h-screen">
          No products found.
        </p>
      )}
    </>
  );
};
