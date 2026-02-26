"use client";

import { useUser } from "@/contexts/UserContext";
import {Home, ShoppingBasket, Truck, User } from "lucide-react";
import Link from "next/link";
import { BiCategory } from "react-icons/bi"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


export const navLinks = [
  { Icon: BiCategory, href: "/categories", label:"Categories" },
{ Icon: ShoppingBasket, href: "/products", label:"Products" },
 { Icon: Home, href: "/" , label:"Home"},
  { Icon: Truck, href: "/tracking", label:"Tracking" },
 
];

export const MobileFooterNavbar = () => {
    const {user} = useUser()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg shadow-sm lg:hidden">
            <div className="px-6 ">
                <div className="h-14 relative flex justify-between items-center">
                {navLinks.map(({href, Icon, label}, i)=> (
                    <Link href={href} key={i} className="flex flex-col  items-center">
                        <Icon className="size-6 text-black"/>
                        <p className="text-xs font-semibold text-black">{label}</p>
                    </Link>
                ))}

 

            {user ?  <Link href={'/profile'}>
               <Avatar>
  {user?.image && (
    <AvatarImage src={user.image} alt={user?.name || "User"} className="object-cover"/>
  )}
  <AvatarFallback className="bg-purple-600 text-white">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>
  </Link>
 : (

   <Link href={"/sign-up"} className="flex flex-col  items-center">
                        <User className="size-6 text-black"/>
                           <p className="text-xs font-semibold text-black">Sign Up</p>
                    </Link>
                )}
               
                </div>
            </div>
        </div>
    )
}