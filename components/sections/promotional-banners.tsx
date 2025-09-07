"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function PromotionalBanners() {
  return (
    <div className="py-12 bg-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* === Left Hero Banner === */}
          <motion.div
            className="w-full relative aspect-[11/7] lg:aspect-[9/7] rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: false }}
          >
            <Link href="/category/masala" className="block w-full h-full relative">
              <Image
                src="/banners/masala.jpg"
                alt="Masala Banner"
                fill
                className="object-cover object-center"
              />
            </Link>
          </motion.div>

          {/* === Right Column: Two stacked banners === */}
          <div className="col-span-1 md:col-span-2 grid grid-rows-2 gap-6">

            {/* Top Banner */}
            <motion.div
              className="w-full relative aspect-[18/4] lg:aspect-[32/6]  rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: false }}
            >
              <Link href="/category/all-masala" className="block w-full h-full relative">
                <Image
                  src="/banners/all-masala.jpg"
                  alt="All Masala Banner"
                  fill
                  className="object-cover object-center"
                />
              </Link>
            </motion.div>

            {/* Bottom Banner */}
            <motion.div
              className="w-full relative aspect-[18/4]  lg:aspect-[32/6]  rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: false }}
            >
              <Link href="/category/organic" className="block w-full h-full relative">
                <Image
                  src="/banners/tomato.jpg"
                  alt="Organic Products Banner"
                  fill
                  className="object-cover object-center"
                />
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
