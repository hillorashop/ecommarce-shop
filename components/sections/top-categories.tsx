'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCard } from "../ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { HeadingTitle } from "../heading-title";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const TopCategories = () => {
  const { data: categories, isLoading } = useCategories();

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <div className="py-16 w-full max-w-5xl mx-auto">
      <HeadingTitle title="Top Categories" />

      {isLoading ? (
        <div className="grid grid-flow-col auto-cols-[10rem] gap-4 px-4 sm:px-8 overflow-x-auto mt-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="flex flex-col items-center p-4 animate-pulse rounded-xl">
              <CardContent className="flex flex-col items-center p-0">
                <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full" />
                <Skeleton className="mt-3 h-4 w-20 sm:w-24 md:w-28 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : categories?.data && categories.data.length > 0 ? (
        <div className="relative mt-8">
          <Carousel className="w-full" plugins={[plugin.current]}>
            <CarouselContent className="grid grid-flow-col auto-cols-[calc(50%-0.5rem)] sm:auto-cols-[calc(33.333%-0.75rem)] lg:auto-cols-[calc(25%-1rem)] gap-4 px-4 sm:px-8 py-2">
              {categories.data.map((category, index) => (
                <CarouselItem key={index} className="w-full"> 
                  <CategoryCard category={category} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <CarouselPrevious className="absolute left-2 md:left-4 lg:left-2 top-1/2 -translate-y-1/2 shadow-md hover:shadow-lg rounded-full p-2 transition">
              <ChevronLeft className="h-5 w-5 fill-primary" />
            </CarouselPrevious>

            <CarouselNext className="absolute right-2 md:right-4 lg:right-2 top-1/2 -translate-y-1/2 shadow-md hover:shadow-lg rounded-full p-2 transition">
              <ChevronRight className="h-5 w-5 fill-primary" />
            </CarouselNext>
          </Carousel>
        </div>
      ) : (
        <p className="text-center text-gray-600 py-10">No categories found.</p>
      )}
    </div>
  );
};
