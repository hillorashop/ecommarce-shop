"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteMeta } from "@/data";
import { useCustomQuery } from "@/hooks/use-query";
import {
  getPromotionalBanner,
  PromotionalBannerResponse,
} from "@/actions/promotional-banner";
import { dbPromotionalBanner } from "@/types/type";

const toRelativePath = (url?: string | null) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return url;
  }
};

interface Props {
  initialBanner?: dbPromotionalBanner | null;
}

function BannerLink({
  href,
  children,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <div className={className}>{children}</div>;
}

export function PromotionalBanners({ initialBanner }: Props) {
  const { data: bannerRes } = useCustomQuery<PromotionalBannerResponse>(
    ["promotional-banner"],
    () => getPromotionalBanner()
  );

  // Supports both single object data or array data
  const rawData: any = bannerRes?.data ?? initialBanner;
  const activeBanner: dbPromotionalBanner | undefined = Array.isArray(rawData) ? rawData[0] : rawData;

  const leftImage = activeBanner?.leftLargeImage?.trim();
  const leftLink = toRelativePath(activeBanner?.leftLargeLink);

  const topRightImage = activeBanner?.topRightImage?.trim();
  const topRightLink = toRelativePath(activeBanner?.topRightLink);

  const bottomRightImage = activeBanner?.bottomRightImage?.trim();
  const bottomRightLink = toRelativePath(activeBanner?.bottomRightLink);

  const hasLeft = Boolean(leftImage);
  const hasTopRight = Boolean(topRightImage);
  const hasBottomRight = Boolean(bottomRightImage);
  const hasRight = hasTopRight || hasBottomRight;

  if (!hasLeft && !hasRight) {
    return null;
  }

  const bannerTitle = activeBanner?.title || siteMeta.siteName || "Promotional Banner";

  return (
    <div className="py-4 md:py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* === Left Hero Banner === */}
          {hasLeft && leftImage && (
            <motion.div
              className={`relative overflow-hidden flex ${hasRight ? "w-full md:w-1/3" : "w-full"}`}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: false }}
            >
              <BannerLink href={leftLink} className="block w-full h-full relative">
                <Image
                  src={leftImage}
                  alt={bannerTitle}
                  width={600}
                  height={900}
                  className="w-full h-full object-contain object-center rounded-sm"
                  priority
                />
              </BannerLink>
            </motion.div>
          )}

          {/* === Right Column: Two stacked banners === */}
          {hasRight && (
            <div className={`flex flex-col gap-4 ${hasLeft ? "w-full md:w-2/3" : "w-full"}`}>
              {/* Top Banner */}
              {hasTopRight && topRightImage && (
                <motion.div
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, y: -50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: false }}
                >
                  <BannerLink href={topRightLink} className="block w-full h-full relative">
                    <Image
                      src={topRightImage}
                      alt={bannerTitle}
                      width={1200}
                      height={300}
                      className="w-full h-auto object-contain rounded-sm"
                    />
                  </BannerLink>
                </motion.div>
              )}

              {/* Bottom Banner */}
              {hasBottomRight && bottomRightImage && (
                <motion.div
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: false }}
                >
                  <BannerLink href={bottomRightLink} className="block w-full h-full relative">
                    <Image
                      src={bottomRightImage}
                      alt={bannerTitle}
                      width={1200}
                      height={300}
                      className="w-full h-auto object-contain rounded-sm"
                    />
                  </BannerLink>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
