"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCustomQuery } from "@/hooks/use-query";
import { getBlogs, BlogResponse } from "@/actions/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { BlogCard } from "@/app/blogs/_components/blog-card";
import { HeadingTitle } from "../heading-title";
import { dbBlog } from "@/types/type";
import { useKeenSlider } from "keen-slider/react";
import { AutoplayPlugin } from "@/lib/keen-autoplay";

export const BlogsSection = () => {
  const { data: blogs, isLoading } = useCustomQuery<BlogResponse>(
    ["blogs", 1],
    () => getBlogs(1)
  );
  const [isClient, setIsClient] = useState(false);
  const items = blogs?.data ?? [];
  const canLoop = items.length > 3;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      slides: {
        perView: 1.12,
        spacing: 14,
      },
      breakpoints: {
        "(min-width: 480px)": {
          slides: { perView: 1.5, spacing: 16 },
        },
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 18 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 22 },
        },
      },
    },
    items.length > 1 ? [AutoplayPlugin(6000, true)] : []
  );

  useEffect(() => {
    instanceRef.current?.update();
  }, [items, instanceRef]);

  if (!isClient || isLoading) {
    return (
      <section className="py-6 lg:py-10 w-full">
        <HeadingTitle title="Latest Blogs" />
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div className="keen-slider py-4 px-1 gap-3 sm:gap-4 lg:gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="keen-slider__slide p-1 min-w-[85%] sm:min-w-[calc(50%-10px)] lg:min-w-[calc(33.333%-16px)] max-w-[85%] sm:max-w-[calc(50%-10px)] lg:max-w-[calc(33.333%-16px)] flex-shrink-0"
              >
                <Card className="flex flex-col overflow-hidden rounded-xl shadow-md border border-gray-100 bg-white">
                  <Skeleton className="aspect-[16/10] sm:aspect-[16/9] w-full" />
                  <CardContent className="space-y-3 p-4 sm:p-5">
                    <Skeleton className="h-5 sm:h-6 w-3/4 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-4 w-1/4 rounded mt-4" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="py-6 lg:py-10 w-full">
      <HeadingTitle title="Latest Blogs" />
      <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
        <div ref={sliderRef} className="keen-slider py-4 px-1">
          {items.map((blog: dbBlog) => (
            <div key={blog.id} className="keen-slider__slide p-1 flex flex-col">
              <BlogCard blog={blog} className="w-full h-full" />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
              aria-label="Previous blogs"
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </button>

            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
              aria-label="Next blogs"
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};
