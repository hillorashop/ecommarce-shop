"use client";

import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { useBillboards } from "@/hooks/use-billboards";
import { Skeleton } from "@/components/ui/skeleton";
import { siteMeta } from "@/data";


const toRelativePath = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash; // only path + query + hash
  } catch {
    return url; // already relative
  }
}


export const HeroSection = () => {

  const { data: billboards, isLoading } = useBillboards();

  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
    api.on("select", () => setActiveIndex(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full">
      <div className="w-full">
        <Carousel className="w-full" plugins={[plugin.current]} setApi={setApi}>
          <CarouselContent>
            {isLoading
              ? [...Array(1)].map((_, i) => (
                  <CarouselItem
                    key={i}
                    className="w-full relative aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4]"
                  >
                    <Skeleton className="w-full h-full rounded-lg" />
                  </CarouselItem>
                ))
              : billboards?.data?.map((item, index) => (
                <CarouselItem
  key={item.id ?? index}
  className="w-full relative aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/4] overflow-hidden">
  {item.billboardImage ? (
    <Link
    href={toRelativePath(item.productLink)}
      className="block w-full h-full relative cursor-pointer"
    >
      <Image
        src={item.billboardImage}
        alt={siteMeta.siteName}
        fill
        className="object-cover object-center"
        priority
      />
    </Link>
  ) : (
    <Skeleton className="w-full h-full rounded-lg" />
  )}
</CarouselItem>

                ))}
          </CarouselContent>

          {/* Navigation Dots */}
          {!isLoading && billboards?.data && billboards?.data.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {billboards.data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`size-2 lg:size-3 rounded-full transition-all duration-300 ease-out shadow-lg ${
                    activeIndex === i ? "bg-amber-500" : "bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
    </section>
  );
};
