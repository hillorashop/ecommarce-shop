"use client";


import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CategoryFilter } from "./category-filter";

interface Props {
  sortBy: "price" | "createdAt";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "price" |  "createdAt",
    sortOrder: "asc" | "desc"
  ) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (min: number, max: number) => void;
  onReset: () => void;
}

export function CategoryDekstopFilterSideBar({
  sortBy,
  sortOrder,
  onSortChange,
  minPrice,
  maxPrice,
  onPriceChange,
 

  onReset
}: Props) {
  const [headerHidden, setHeaderHidden] = useState(false);
  const [leftOffset, setLeftOffset] = useState(0);

 
  useEffect(() => {
    const handleScroll = () => setHeaderHidden(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const updateOffset = () => {
      const containerWidth = Math.min(window.innerWidth, 1920);
      const sidebarWidth = 224;
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
        <CategoryFilter
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
          onPriceChange={onPriceChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onReset={onReset}
        />
      </motion.aside>
      </div>
  );
}
