"use client";

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

const toRelativePath = (url: string) => {
  if (!url) return "/products";
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

export function PromotionalBanners({ initialBanner }: Props) {
  const { data: bannerRes } = useCustomQuery<PromotionalBannerResponse>(
    ["promotional-banner"],
    () => getPromotionalBanner()
  );

  // Supports both single object data or array data
  const rawData: any = bannerRes?.data ?? initialBanner;
  const activeBanner: dbPromotionalBanner | undefined = Array.isArray(rawData) ? rawData[0] : rawData;

  const leftImage = activeBanner?.leftLargeImage || "/banners/hillora-banner.jpg";
  const leftLink = toRelativePath(activeBanner?.leftLargeLink || "/products");

  const topRightImage = activeBanner?.topRightImage || "/banners/hillora-red-chilli.jpg";
  const topRightLink = toRelativePath(activeBanner?.topRightLink || "/products");

  const bottomRightImage =
    activeBanner?.bottomRightImage || "/banners/hillora-turmeric-powder.jpg";
  const bottomRightLink = toRelativePath(activeBanner?.bottomRightLink || "/products");

  return (
    <div className="py-4 md:py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* === Left Hero Banner === */}
          <motion.div
            className="relative w-full md:w-1/3 overflow-hidden flex"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Link href={leftLink} className="block w-full h-full relative">
              <Image
                src={leftImage}
                alt={activeBanner?.title || siteMeta.siteName || "Promotional Banner"}
                width={600}
                height={900}
                className="w-full h-full object-contain object-center rounded-sm"
                priority
              />
            </Link>
          </motion.div>

          {/* === Right Column: Two stacked banners === */}
          <div className="flex flex-col gap-4 md:w-2/3">
            {/* Top Banner */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: false }}
            >
              <Link href={topRightLink} className="block w-full h-full relative">
                <Image
                  src={topRightImage}
                  alt={activeBanner?.title || siteMeta.siteName || "Promotional Banner"}
                  width={1200}
                  height={300}
                  className="w-full h-auto object-contain rounded-sm"
                />
              </Link>
            </motion.div>

            {/* Bottom Banner */}
            <motion.div
              className="relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
            >
              <Link href={bottomRightLink} className="block w-full h-full relative">
                <Image
                  src={bottomRightImage}
                  alt={activeBanner?.title || siteMeta.siteName || "Promotional Banner"}
                  width={1200}
                  height={300}
                  className="w-full h-auto object-contain rounded-sm"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
