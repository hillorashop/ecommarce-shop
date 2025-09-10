"use client";

import { useState } from "react";
import { Search, Menu, ShoppingCart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navLinks, siteMeta } from "@/data";
import Link from "next/link";
import Image from "next/image";

import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { dbProduct } from "@/types/type";
import { useProducts } from "@/hooks/use-products";
import { Card } from "../ui/card";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback,  AvatarImage } from "../ui/avatar";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState<dbProduct[]>([]);
  const router = useRouter();
 
   const { data: products, isLoading } = useProducts();
   const {user} = useUser()



  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b shadow-sm lg:hidden">
      <div className="px-6">
        <div className="flex items-center justify-between h-14 relative">
          {/* === Hamburger Menu === */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2">
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[80%] max-w-sm overflow-y-auto px-2"
            >
              <SheetHeader className="p-0 relative mb-14">
                <SheetTitle className="sr-only"> Mobile Header</SheetTitle>
                <Image
                  src={"/logo.svg"}
                  alt={`${siteMeta.siteName}`}
                  width={130}
                  height={60}
                  className="object-contain overflow-hidden absolute -top-2 -left-6"
                />
              </SheetHeader>

              <div className="space-y-6">
                {/* === Menu Section === */}
                <div>
                  <h3 className="font-semibold text-white mb-3 w-full bg-primary p-2">
                    Menu
                  </h3>
                  <div className="space-y-2 px-4">
                    {navLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.href}
                         onClick={() => setIsOpen(false)}
                        className="block w-full text-left text-gray-700 hover:text-primary py-2 rounded-md transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                    <Link
                      href="/tracking"
                        onClick={() => setIsOpen(false)}
                      className="block w-full text-left text-gray-700 hover:text-primary py-2 rounded-md transition-colors"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>

                {/* === Account Section === */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-white mb-3 p-2 w-full bg-primary ">
                    Account
                  </h3>
                  <div className="space-y-2 px-4 mt-6">
                    {user ?  <Link href={'/profile'} className="flex flex-wrap gap-x-2 items-center"  onClick={() => setIsOpen(false)}>
               <Avatar>
  {user?.image && (
    <AvatarImage src={user.image} alt={user?.name || "User"} className="object-cover"/>
  )}
  <AvatarFallback className="bg-purple-600 text-white">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>
  <p className="xs text-muted-foreground font-semibold">{user.email}</p>
  </Link> : (
              <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left text-gray-700 hover:text-primary py-2 rounded-md transition-colors"
                    >
                      Sign Up
                    </Link>
  )}
                    
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* === Logo === */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">

            <Image
              src="/logo.svg"
              alt={`${siteMeta.siteName}`}
              width={200}
              height={80}
              onClick={()=> router.push("/")}
              className="object-contain overflow-hidden"
            />
          </div>

          {/* === Cart + Search Button === */}
          <div className="flex items-center gap-x-2">
        

            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              onClick={() => setShowSearch(true)}
            >
              <Search className="size-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* === Fullscreen Search Overlay === */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white/95  flex items-center px-4"
          >
  <div className="relative w-full max-w-sm">
  <Input
    type="text"
    placeholder="Search product..."
    className="pr-10 h-10" // add right padding so text doesn't overlap button
    autoFocus
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
  <Button
    variant="ghost"
    size="icon"
    className="absolute right-1 top-1/2 -translate-y-1/2"
    type="button"
      onClick={() => {
        router.replace(`/products?productName=${encodeURIComponent(productName)}`)
      
            }
  }
  >
    <Search className="size-5" />
  </Button>

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

        
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setShowSearch(false)}
            >
              <X className="size-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
