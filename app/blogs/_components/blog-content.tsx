'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { useBlogs } from "@/hooks/use-blogs";
import { dbBlog } from "@/types/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogCard } from "./blog-card";

interface Props {
  initialPage: number;
}

export const BlogContent = ({ initialPage }: Props) => {
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page");
  const currentPage = Number(pageStr) || initialPage;

  const { data: blogs, isLoading } = useBlogs(currentPage);

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden animate-pulse rounded-xl">
              <Skeleton className="w-full h-48 sm:h-56 md:h-64" />
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

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 pt-10">
            <Link
              href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
              className={`px-4 py-2 shadow rounded ${
                currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-primary transition"
              }`}
            >
              <ArrowLeft className="size-4" />
            </Link>

            <span className="text-sm font-semibold text-muted-foreground">
              Page {currentPage} of {blogs.totalPages}
            </span>

            <Link
              href={`?page=${currentPage < blogs.totalPages ? currentPage + 1 : blogs.totalPages}`}
              className={`px-4 py-2 shadow rounded ${
                currentPage >= blogs.totalPages ? "pointer-events-none opacity-50" : "hover:bg-primary transition"
              }`}
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground flex items-center justify-center w-full h-60">
          No blogs found.
        </p>
      )}
    </>
  );
};