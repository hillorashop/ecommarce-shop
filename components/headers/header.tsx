'use client';

import { MessageSquare, Phone, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import { dbProduct } from "@/types/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteMeta } from "@/data";
import { AnimatePresence, motion } from "framer-motion";




export function Header() {
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState<dbProduct[]>([]);
  const { data: products, isLoading } = useProducts();
    const [showHeader, setShowHeader] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);


useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setShowHeader(false); // hide header
    } else {
      setShowHeader(true); // show header only at top
    }
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
          exit={{ y: -120, opacity: 0 }} // move up and hide
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 z-50 hidden lg:block bg-white shadow-sm"
        >

      <div className="max-w-[120rem] mx-auto border-b">
        <div className="backdrop-blur-lg px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src={"/logo.svg"}
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
                onClick={() =>{
                  router.replace(`/products?productName=${encodeURIComponent(productName)}`)
               
              }}
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>

              {/* Search Results as Cards */}
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
      {/* Product Image */}
      <div className="w-16 h-16 flex-shrink-0 overflow-hidden relative">
        <Image
          src={product.productImage || `${siteMeta.siteName}`}
          alt={product.name}
          width={64}
          height={64}
          className="object-cover rounded"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        
        <div className="flex items-baseline gap-2 text-sm font-semibold">
          {hasDiscount ? (
            <>
              <span className="">BDT {product.discountPrice}</span>
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

            {/* Hotline Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray p-2 rounded-lg shadow-sm text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <a
                  href="https://wa.me/8801516194716?text=হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold hover:underline "
                >
                  WhatsApp: +8801516194716
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-purple-600" />
      <a className="text-purple-600 font-semibold" href="tel:01519558558">
      হট লাইন: 01519558558
    </a>
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
