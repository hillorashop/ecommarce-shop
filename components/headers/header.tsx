'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { dbProduct } from "@/types/type";
import { Card } from "@/components/ui/card";
import { siteMeta } from "@/data";
import { AnimatePresence, motion } from "framer-motion";

const emergency_contact = [
  {
    href: "https://wa.me/8801516194716?text=হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।",
    Icon: "/icons/whatsapp.svg",
    bg: "#16a34a",
  },
  {
    href: "https://m.me/yourpageusername?ref=order_now",
    Icon: "/icons/messenger.svg.webp",
    bg: "#be123c",
  },
];

export function Header() {
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState<dbProduct[]>([]);
  const { data: products } = useProducts();
  const [showHeader, setShowHeader] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide header on scroll down
  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY === 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search results when clicking outside
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
          exit={{ y: -128, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-white shadow-sm"
        >
          <div className="max-w-[120rem] mx-auto border-b">
            <div className="backdrop-blur-lg px-8">
              <div className="relative flex items-center justify-between h-28 gap-8">

                {/* Logo (absolute, won’t affect layout) */}
                <div className="absolute -left-14 top-1/2 -translate-y-1/2 w-60 h-80">
                  <Image
                    src="/logo.svg"
                    alt={siteMeta.siteName}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Search (pushed right with margin so it doesn’t overlap logo) */}
                <div className="ml-48 flex-1 max-w-3xl relative" ref={containerRef}>
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
                        p.name.toLowerCase().includes(value.toLowerCase())
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
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-auto z-50 space-y-2 py-2 bg-white shadow-md rounded-lg">
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
                              router.replace(`/products/${product.id}`);
                            }}
                          >
                            <div className="w-14 h-14 flex-shrink-0 relative">
                              <Image
                                src={product.productImage || `${siteMeta.siteName}`}
                                alt={product.name}
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

                {/* Emergency Contact */}
                <div className="flex flex-col items-end gap-1 max-w-sm">
                  <p className="text-sm text-muted-foreground font-semibold text-right leading-snug">
                    জরুরি প্রয়োজনীয় পণ্য বা অর্ডার সম্পর্কিত তথ্যের জন্য সরাসরি আমাদেরকে মেসেজ করুন অথবা কল করুন{" "}
                    <span className="font-bold">+8801519558558</span>
                  </p>
                  <div className="flex items-center gap-6">
                    {emergency_contact.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center w-12 h-12"
                      >
                        <Image
                          src={s.Icon}
                          alt={siteMeta.siteName}
                          width={32}
                          height={32}
                          className="rounded-full overflow-hidden z-10"
                        />
                        <div
                          className="absolute inset-0 border-2 rounded-full animate-ping"
                          style={{ borderColor: s.bg }}
                        />
                      </a>
                    ))}
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
