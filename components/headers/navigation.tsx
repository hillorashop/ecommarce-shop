"use client"

import { navLinks } from "@/data"
import { ShoppingCart, Truck, User2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { BiCategory } from "react-icons/bi"
import { useCart, useOpenStore } from "@/hooks/use-store"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"




export function Navigation() {
    const [headerHidden, setHeaderHidden] = useState(false);
  const router = useRouter()
  const { setOpen } = useOpenStore()
  const { cartItems} = useCart();
  const {user}= useUser()

   

    useEffect(() => {
    const handleScroll = () => {
      setHeaderHidden(window.scrollY > 50); // header hidden after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <motion.div
  animate={{ top: headerHidden ? 0 : 110 }} 
      transition={{ duration: 0.4, ease: "easeInOut" }}
  className="fixed top-[110px] left-0 right-0 z-40 backdrop-blur-lg border-b shadow-sm hidden lg:block"
>
      <div className="px-4 sm:px-6 lg:px-8 py-2 max-w-[120rem] mx-auto">
        <div className="flex items-center justify-between">

    <Link href={'/categories'} className="flex gap-x-2  items-center text-gray-600 font-semibold hover:underline text-base cursor-pointer uppercase">
         <BiCategory className="size-4" />
      Categories
    </Link>
 
 


          <nav className="flex space-x-8 uppercase">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-700 hover:text-primary font-medium hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-6 font-semibold ">
            <button
    onClick={() => setOpen(true)} // ✅ open cart sheet
    className="relative text-center flex flex-col gap-y-1 items-center cursor-pointer hover:scale-110 transition-all"
  >
    <ShoppingCart className="size-6" />
    {cartItems && cartItems.length > 0 && (
      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs flex items-center justify-center p-0">
        {cartItems.length}
      </Badge>
    )}
    <span className="block text-xs">Cart</span>
  </button>

  {/* 🚚 Track Order Button */}
  <button
    onClick={() => router.push('/tracking')} 
    className="relative text-center flex flex-col gap-y-1 items-center cursor-pointer hover:scale-110 transition-all"
  >
    <Truck className="size-6" />
    <span className="block text-xs">Track Order</span>
  </button>

    {user ? (
      <Link href={'/profile'} className="flex flex-col items-center hover:scale-105 transition-all">
<Avatar>
  {user?.image && (
    <AvatarImage src={user.image} alt={user?.name || "User"} className="object-cover"/>
  )}
  <AvatarFallback className="bg-purple-600 text-white">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>

<p className="text-xs font-semibold text-muted-foreground">{user.email}</p>
    </Link>)
       : (
      <Link
              href={"/sign-up"}
              className="text-center flex flex-col gap-y-1 items-center hover:scale-105 transition-all uppercase"
            >
              <User2 />
              <span className="text-xs block">Sign Up</span>
            </Link>
    )}

    
      
          </div>
        </div>
      </div>
    </motion.div>
  )
}
