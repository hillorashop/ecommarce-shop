'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { dbProduct } from "@/types/type";
import { Card } from "@/components/ui/card";
import {siteMeta } from "@/data";
import { AnimatePresence, motion } from "framer-motion";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { getLogos, LogoResponse } from "@/actions/business-info";



export function Header() {
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState<dbProduct[]>([]);
  const { data: products } = useProducts();
  const [showHeader, setShowHeader] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
const { data: logos, isLoading: logosLoading } = useCustomQuery<LogoResponse>(
    ["get-logos"],
    () => getLogos()
)

  const headerLogo =
    logos?.data?.primaryLogo || logos?.data?.secondaryLogo || "/logo.svg";

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <AnimatePresence>
      {showHeader && (
        <motion.header
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-white shadow-sm overflow-hidden"
        >
       
          <div className="max-w-7xl mx-auto border-b">
            <div className="backdrop-blur-lg px-8">
          <div className="flex items-center justify-between h-16 gap-8 relative">

<div className="">
       {!logosLoading && (
  <Image
  onClick={()=> router.push("/")}
    src={headerLogo}
    width={190}
    height={80}
    alt={siteMeta.siteName || ""}
    className="object-contain cursor-pointer"
  />
  )}

</div>

  {/* Search (center) */}
  <div className="flex-1 flex justify-center relative" ref={containerRef}>
    <div className="w-full max-w-3xl relative">
      <Input
        type="text"
        placeholder="Search your product"
        className="w-full pl-4 pr-12 py-3 text-base"
        value={productName}
        onChange={(e) => {
          const value = e.target.value;
          setProductName(value);
          if (value.trim() === "") {
            setSearchResults([]);
            return;
          }
          const filtered = products?.data?.filter((p) =>
            p.name.toLowerCase().includes(value.trim().toLowerCase())
          );
          setSearchResults(filtered as dbProduct[]);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.replace(`/products?productName=${encodeURIComponent(productName)}`);
          }
        }}
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2"
        type="button"
        onClick={() => {
          router.replace(`/products?productName=${encodeURIComponent(productName)}`);
        }}
      >
        <Search className="h-6 w-6 text-gray-400" />
      </button>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-auto z-50 space-y-2 py-2 bg-white shadow-md rounded-md px-2">
          {searchResults.map((product) => {
            const hasDiscount =
              product.discountPrice &&
              product.discountPrice < product.price;

            return (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-md transition flex flex-row items-center gap-4 p-2"
                onClick={() => {
                  setProductName(product.name);
                  setSearchResults([]);
                  router.replace(`/products/${product.productUrl}`);
                }}
              >
                <div className="w-14 h-14 flex-shrink-0 relative">
                  <Image
                    src={product.productImage || `${siteMeta.siteName}`}
                    alt={product.name || ""}
                    width={56}
                    height={56}
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-baseline gap-2 text-sm font-semibold">
                    {hasDiscount ? (
                      <>
                        <span>BDT {product.discountPrice}</span>
                        <span className="text-muted-foreground line-through text-xs">BDT {product.price}</span>
                      </>
                    ) : (
                      <span className="text-gray-800">BDT {product.price}</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  </div>
</div>

            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}