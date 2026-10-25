'use client';

import { CategoryCard } from "@/components/ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomQuery } from "@/hooks/use-query";
import { getCategories, CategoriesResponse } from "@/actions/category";
import { dbCategory } from "@/types/type";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaginationRange } from "@/lib/utils";

interface Props {
  initialPage: number;
}

export const CategoryContent = ({ initialPage }: Props) => {
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page");
  const currentPage = Number(pageStr) || initialPage;
  const router = useRouter();
  const pathname = usePathname();
  const { data: categories, isLoading } = useCustomQuery<CategoriesResponse>(
    ["categories", currentPage],
    () => getCategories(currentPage)
  );

    const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col items-center p-4 animate-pulse rounded-xl">
              <CardContent className="flex flex-col items-center p-0">
                <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full" />
                <Skeleton className="mt-3 h-4 w-20 sm:w-24 md:w-28 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories?.data && categories?.data.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.data.map((category: dbCategory, index: number) => (
              <CategoryCard category={category} key={index} />
            ))}
          </div>
  {categories.totalPages > 1 && (
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
 
                {getPaginationRange(currentPage, categories.totalPages).map((page, idx) =>
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
                      if (currentPage < categories.totalPages) goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= categories.totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground flex items-center justify-center w-full h-60">
          No categories found.
        </p>
      )}
    </>
  );
};
