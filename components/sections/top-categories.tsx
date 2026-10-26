'use client';

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard } from "../ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomQuery } from "@/hooks/use-query";
import { getCategories, CategoriesResponse } from "@/actions/category";
import { HeadingTitle } from "../heading-title";
import { Card, CardContent } from "@/components/ui/card";
import { useKeenSlider } from "keen-slider/react";
import { AutoplayPlugin } from "@/lib/keen-autoplay";

export const TopCategories = () => {
  const { data: categories, isLoading } = useCustomQuery<CategoriesResponse>(
    ["categories"],
    () => getCategories()
  );
  const [isClient, setIsClient] = useState(false);
  const items = categories?.data ?? [];
  const canLoop = items.length > 6;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      slides: {
        perView: 2,
        spacing: 12,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 3, spacing: 16 },
        },
        "(min-width: 768px)": {
          slides: { perView: 4, spacing: 16 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 6, spacing: 16 },
        },
      },
    },
    [AutoplayPlugin(3500, true)]
  );

  useEffect(() => {
    instanceRef.current?.update({
      loop: items.length > 6,
    });
  }, [items, instanceRef]);

  return (
    <div className="py-4 lg:py-8 w-full">
      <HeadingTitle title="Top Categories" />

      {!isClient || isLoading ? (
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div className="keen-slider py-3 px-1 gap-3 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="keen-slider__slide min-w-[calc(50%-6px)] sm:min-w-[calc(33.333%-11px)] md:min-w-[calc(25%-12px)] lg:min-w-[calc(16.666%-14px)] max-w-[calc(50%-6px)] sm:max-w-[calc(33.333%-11px)] md:max-w-[calc(25%-12px)] lg:max-w-[calc(16.666%-14px)] flex-shrink-0"
              >
                <Card className="flex flex-col items-center p-4 animate-pulse rounded-xl shadow-md border border-gray-100">
                  <CardContent className="flex flex-col items-center p-0">
                    <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full" />
                    <Skeleton className="mt-3 h-4 w-20 sm:w-24 md:w-28 rounded" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div ref={sliderRef} className="keen-slider py-3 px-1">
            {items.map((category, index) => (
              <div key={category.id ?? index} className="keen-slider__slide">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </button>

          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2 bg-background/90 hover:bg-background transition border cursor-pointer"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10">No categories found.</p>
      )}
    </div>
  );
};
