"use client";

import { useState } from "react";

import { HeadingTitle } from "@/components/heading-title";

import { CategoryProductsContent } from "./category-product-content";
import { CategoryDekstopFilterSideBar } from "./category-dekstop-filter-sidebar";
import { CategoryMobileFilterSideBar } from "./category-mobile-filter-sidebar";




interface Props {
  categoryUrl:string
  categoryName:string;
}

export const CategoryState = ({categoryUrl, categoryName}:Props) => {

  const [sortBy, setSortBy] = useState<"price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");


  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);




    const resetFilters = () => {
    setSortBy("createdAt");
    setSortOrder("desc");
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };


  return (
    <div className="lg:flex lg:gap-6 w-full">
      <CategoryMobileFilterSideBar
          sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        onReset={resetFilters}
      />
      <CategoryDekstopFilterSideBar
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
        }}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
        }}
        onReset={resetFilters}
      />

      <div className="flex-1 min-h-screen py-10 lg:overflow-y-scroll">
        <div className="space-y-8 px-4 ">
          <HeadingTitle title={`${categoryName}`} />
          <CategoryProductsContent
            sortBy={sortBy}
            sortOrder={sortOrder}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categoryUrl={categoryUrl}
          />
        </div>
      </div>
    </div>
  );
};
