"use client";

import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import Link from "next/link";
import { useCustomQuery } from "@/hooks/use-query";
import { getBillboards, BillboardsResponse } from "@/actions/billboard";
import { Skeleton } from "@/components/ui/skeleton";
import { siteMeta } from "@/data";
import { AutoplayPlugin } from "@/lib/keen-autoplay";

const toRelativePath = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
};

export const HeroSection = () => {
  const { data: billboards, isLoading } = useCustomQuery<BillboardsResponse>(
    ["billboards"],
    () => getBillboards()
  );
  const [isClient, setIsClient] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const items = billboards?.data ?? [];
  const canLoop = items.length > 1;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      initial: 0,
      slideChanged(slider) {
        setActiveIndex(slider.track.details.rel);
      },
    },
    canLoop ? [AutoplayPlugin(4000, true)] : []
  );

  useEffect(() => {
    instanceRef.current?.update();
  }, [items, instanceRef]);

  return (
    <section className="w-full">
      <div className="w-full relative">
        {!isClient || isLoading ? (
          <div className="keen-slider w-full">
            <div className="keen-slider__slide w-full relative aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4]">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
        ) : items.length > 0 ? (
          <>
            <div ref={sliderRef} className="keen-slider w-full">
              {items.map((item, index) => {
                const desktopImg = item.billboardImage?.trim();
                const mobileImg = item.billboardImageMobileDevice?.trim();
                const hasImage = Boolean(desktopImg || mobileImg);

                return (
                  <div
                    key={item.id ?? index}
                    className={`keen-slider__slide w-full relative overflow-hidden ${
                      mobileImg
                        ? "aspect-[14/6] lg:aspect-[12/3]"
                        : "aspect-[23/6] lg:aspect-[12/3]"
                    }`}
                  >
                    {hasImage ? (
                      <Link
                        href={item.productLink ? toRelativePath(item.productLink) : "#"}
                        className="block w-full h-full relative cursor-pointer"
                      >
                        {mobileImg && (
                          <Image
                            src={mobileImg}
                            alt={siteMeta.siteName || ""}
                            fill
                            sizes="100vw"
                            className={`object-contain object-center ${desktopImg ? "block lg:hidden" : "block"}`}
                            priority={index === 0}
                          />
                        )}
                        {desktopImg && (
                          <Image
                            src={desktopImg}
                            alt={siteMeta.siteName || ""}
                            fill
                            sizes="100vw"
                            className={`object-contain object-center ${mobileImg ? "hidden lg:block" : "block"}`}
                            priority={index === 0}
                          />
                        )}
                      </Link>
                    ) : (
                      <Skeleton className="w-full h-full rounded-lg" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Dots */}
            {items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => instanceRef.current?.moveToIdx(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`size-2 lg:size-3 rounded-full transition-all duration-300 ease-out shadow-lg ${
                      activeIndex === i ? "bg-amber-500 scale-110" : "bg-white/70 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};
