'use client';

import { CategoryCard } from "@/components/ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { dbCategory } from "@/types/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

interface Props {
  initialPage: number;
}

export const CategoryContent = ({ initialPage }: Props) => {
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page");
  const currentPage = Number(pageStr) || initialPage;

  const { data: categories, isLoading} = useCategories(currentPage);

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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-10">
            <Link
              href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
              className={`px-4 py-2 shadow rounded ${
                currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-primary transition"
              }`}
            >
              <ArrowBigLeft className="size-4"/>
            </Link>

            <span className="text-sm font-semibold text-muted-foreground">
              Page {currentPage} of {categories.totalPages}
            </span>

            <Link
              href={`?page=${currentPage < categories.totalPages ? currentPage + 1 : categories.totalPages}`}
              className={`px-4 py-2 shadow rounded ${
                currentPage >= categories.totalPages ? "pointer-events-none opacity-50" : "hover:bg-primary transition"
              }`}
            >
              <ArrowBigRight className="size-4"/>
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground flex items-center justify-center w-full h-60">
          No categories found.
        </p>
      )}
    </>
  );
};
