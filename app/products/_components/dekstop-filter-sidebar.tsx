"use client";

import { Filter } from "./filter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  sortBy: "price" | "category" | "createdAt";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "price" | "category" | "createdAt",
    sortOrder: "asc" | "desc"
  ) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  categoryIds?: string[];
  onCategoryChange?: (ids: string[]) => void;
  onReset: () => void;
}

export function DekstopFilterSideBar({
  sortBy,
  sortOrder,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
  categoryIds,
  onCategoryChange,
  onReset
}: Props) {
  const [headerHidden, setHeaderHidden] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);

  // Update top when scrolling
  useEffect(() => {
    const handleScroll = () => setHeaderHidden(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate left offset to match centered container
  useEffect(() => {
    const updateOffset = () => {
      const containerWidth = Math.min(window.innerWidth, 1920); // max-w-[120rem] = 1920px
      const sidebarWidth = 224; // w-56 = 14rem = 224px
      const left = (window.innerWidth - containerWidth) / 2;
      setLeftOffset(left);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  return (
    <div className="max-w-[120rem] mx-auto relative flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ top: headerHidden ? 0 : 140 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="hidden lg:block sticky top-[162px] w-56 xl:w-64 h-[calc(100vh-162px)] overflow-y-auto shadow-md bg-gray-100 p-4 space-y-4"
      >
        <Filter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          onCategoryChange={onCategoryChange}
          onPriceChange={onPriceChange}
          categoryIds={categoryIds}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onReset={onReset}
        />
      </motion.aside>
      </div>
  );
}
