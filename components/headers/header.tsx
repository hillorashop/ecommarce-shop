'use client';

import { MessageSquare, Phone, Search } from "lucide-react";
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

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY === 0);
    };
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
          exit={{ y: -124, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-white shadow-sm"
        >
          <div className="max-w-[120rem] mx-auto border-b">
            <div className="backdrop-blur-lg px-4">
              <div className="flex items-center justify-between  h-24">
                
                {/* Logo */}
                <div className="flex-shrink-0">
                  <Image
                    src="/logo.svg"
                    alt={siteMeta.siteName}
                    width={230}
                    height={120}
                    className="object-contain overflow-hidden"
                  />
                </div>

                {/* Search */}
                <div className="flex-1 max-w-2xl mx-4 relative" ref={containerRef}>
                  <Input
                    type="text"
                    placeholder="Search your product"
                    className="w-full pl-4 pr-12 py-2"
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    type="button"
                    onClick={() => {
                      router.replace(`/products?productName=${encodeURIComponent(productName)}`);
                    }}
                  >
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-auto z-50 space-y-2 py-2">
                      {searchResults.map((product) => {
                        const hasDiscount =
                          product.discountPrice !== undefined &&
                          product.discountPrice !== null &&
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
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden relative">
                              <Image
                                src={product.productImage || `${siteMeta.siteName}`}
                                alt={product.name}
                                width={64}
                                height={64}
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
                <div className="flex flex-col items-center gap-x-4">
                  <p className="text-xs text-muted-foreground font-semibold text-center max-w-lg">
                    জরুরি প্রয়োজনীয় পণ্য বা অর্ডার সম্পর্কিত তথ্যের জন্য সরাসরি আমাদেরকে মেসেজ করুন অথবা কল করুন +8801519558558।
                  </p>

                  <div className="flex items-center justify-center gap-x-8 mt-2">
                    {emergency_contact.map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative flex items-center justify-center w-10 h-10"
                      >
                        <Image
                          src={s.Icon}
                          alt={siteMeta.siteName}
                          width={28}
                          height={28}
                          className="rounded-full overflow-hidden z-10"
                        />
                        {/* Ping animation */}
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
