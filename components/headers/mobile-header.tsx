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
import {  emergency_contact, mobileNavLinks, siteMeta } from "@/data";
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
import { Badge } from "../ui/badge";
import { useCart, useOpenStore } from "@/hooks/use-store";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [productName, setProductName] = useState("");
  const [searchResults, setSearchResults] = useState<dbProduct[]>([]);
  const router = useRouter();
 
   const { data: products, isLoading } = useProducts();
   const {user} = useUser()
     const { setOpen } = useOpenStore();
  const { cartItems } = useCart();

 const contact = [
    
  {
    href: "https://wa.me/8801516194716?text=হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।",
    Icon: "/icons/whatsapp.svg",
    bg: "#16a34a",
  },
  {
    href: "https://m.me/hillorashop?ref=order_now",
    Icon: "/icons/messenger.svg.webp",
    bg: "#be123c",
  },
];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b shadow-sm lg:hidden">
           <div className="bg-black text-primary p-2 text-center">
<p className="font-semibold text-sm leading-6">
  যে কোন পণ্য অর্ডার করুন Call or WhatsApp <br />

<span className="flex items-center w-full gap-x-2 justify-center">
    <span className="flex items-center gap-2">
    <Image
      src="/icons/call.svg"
      alt="Call"
      width={18}
      height={18}
      className="inline-block"
    />
    01519558558
  </span>

  <span className="flex items-center gap-2 ">
    <Image
      src="/icons/whatsapp.svg"
      alt="WhatsApp"
      width={18}
      height={18}
      className="inline-block"
    />
    01581847235
  </span>
</span>

</p>

        </div>

      <div className="px-6">
        
        <div className="flex items-center justify-between h-14 relative">

          <div className="flex items-center gap-x-2">
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
        
                <div>
                  <h3 className="font-semibold text-white mb-3 w-full bg-primary p-2">
                    Menu
                  </h3>
                  <div className="space-y-2 px-4 uppercase">
                    {mobileNavLinks.map((link, idx) => (
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
                      className="block w-full text-left text-gray-700 hover:text-primary py-2 rounded-md transition-colors uppercase"
                    >
                      Sign Up
                    </Link>
  )}
                    
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

      
          <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2">

            <Image
              src="/logo.svg"
              alt={`${siteMeta.siteName}`}
              width={250}
              height={150}
              onClick={()=> router.push("/")}
              className="object-contain overflow-hidden"
            />
          </div>
          </div>
     
 <div className="absolute left-1/2 top-1/2 -translate-x-1/4 -translate-y-1/2">
 <div className="flex items-center gap-4 w-full ">
              {contact.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center w-6 h-6"
                >
                  <Image
                    src={s.Icon}
                    alt={siteMeta.siteName}
                    width={18}
                    height={18}
                    className="rounded-full overflow-hidden z-10"
                  />
                  <div
                    className="absolute inset-1 border rounded-full animate-ping duration-200"
                    style={{ borderColor: s.bg }}
                  />
                      <div
                    className="absolute -inset-0.5 border rounded-full animate-ping duration-100"
                    style={{ borderColor: s.bg }}
                  />
                </a>
              ))}
    </div>
 </div>

  

          <div className="flex items-center gap-x-2">
        
            <Button
              variant="ghost"
              size="icon"
              className="p-2"
              onClick={() => setShowSearch(true)}
            >
              <Search className="size-6" />
            </Button>

                               <button onClick={() => setOpen(true)} className="relative">
              <ShoppingCart className="size-6 " />
              {cartItems && cartItems.length > 0 && (
                <Badge className="absolute -top-1 bg-gray-800 -right-2 size-4 rounded-full text-xs flex items-center justify-center p-0">
                  {cartItems.length}
                </Badge>
              )}
            </button>
          </div>

        </div>

      </div>

 
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white/95  flex items-center px-4 z-50"
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
        router.replace(`/products/${product.productUrl}`);
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
