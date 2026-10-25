'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { useCustomQuery } from "@/hooks/use-query";
import { getBlogs, BlogResponse } from "@/actions/blog";
import { dbBlog } from "@/types/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard } from "./blog-card";
import { getPaginationRange } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";


interface Props {
  initialPage: number;
}

export const BlogContent = ({ initialPage }: Props) => {
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page");
  const currentPage = Number(pageStr) || initialPage;
  const router = useRouter(); 
  const pathname = usePathname();  
  const { data: blogs, isLoading } = useCustomQuery<BlogResponse>(
    ["blogs", currentPage],
    () => getBlogs(currentPage)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden animate-pulse rounded-xl">
              <Skeleton className="w-full aspect-[1600/895] md:aspect-[1600/500]" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : blogs?.data && blogs?.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.data.map((blog: dbBlog, index: number) => (
              <BlogCard blog={blog} key={index} />
            ))}
          </div>

   
         {blogs.totalPages > 1 && (
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
 
                {getPaginationRange(currentPage, blogs.totalPages).map((page, idx) =>
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
                      if (currentPage < blogs.totalPages) goToPage(currentPage + 1);
                    }}
                    className={
                      currentPage >= blogs.totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
         
      
        </>
      ) : (
        <p className="text-center text-muted-foreground flex items-center justify-center w-full h-60">
          No blogs found.
        </p>
      )}
    </>
  );
};