"use client";


import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



import {useState } from "react";
import { dbProductwihtoutAll } from "@/actions/product";
import { useCustomQuery } from "@/hooks/use-query";
import { getCategoryProducts, CategoryResponse } from "@/actions/category";
import { getPaginationRange } from "@/lib/utils";

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
  const { data: category, isLoading } = useCustomQuery<CategoryResponse>(
    ['category-products', categoryUrl, currentPage, sortBy, sortOrder, minPrice, maxPrice],
    () => getCategoryProducts(categoryUrl, currentPage, sortBy, sortOrder, undefined, minPrice, maxPrice)
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              <ProductCard product={product} key={index}  index={index}/>
            ))}
          </div>

          
            {category.totalPages! > 1 && (
            <Pagination className="py-4 pt-10">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) goToPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
 
                {getPaginationRange(currentPage, category.totalPages!).map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
 
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < category.totalPages!) goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= category.totalPages! ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600 py-20 h-screen">
          No products found.
        </p>
      )}
    </>
  );
};
