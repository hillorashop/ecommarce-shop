"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteMeta } from "@/data";

export function PromotionalBanners() {
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
            <Link href="/products" className="block w-full h-full relative">
              <Image
                src="/banners/hillora-banner.jpg"
                alt={siteMeta.siteName}
                width={600}
                height={900} // increased height
                className="w-full h-full object-contain object-center"
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
              <Link href="/products" className="block w-full h-full relative">
                <Image
                  src="/banners/hillora-red-chilli.jpg"
                  alt={siteMeta.siteName}
                  width={1200}
                  height={300}
                  className="w-full h-auto object-contain"
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
              <Link href="/products" className="block w-full h-full relative">
                <Image
                  src="/banners/hillora-turmeric-powder.jpg"
                  alt={siteMeta.siteName}
                  width={1200}
                  height={300}
                  className="w-full h-auto object-contain"
                />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
