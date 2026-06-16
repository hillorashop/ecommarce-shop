"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Home, ShoppingBasket, Truck, LogIn } from "lucide-react";
import { BiCategory } from "react-icons/bi";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  Icon?: LucideIcon | IconType;
  href: string;
  label: string;
  isUser?: boolean;
};

export const StyleMobileFooterNavbar = () => {
  const [active, setActive] = useState("home");
  const { user } = useUser();
  const pathname = usePathname();

  const getActiveFromPath = (path: string) => {
    if (path === "/") return "home";
    if (path === "/categories") return "categories";
    if (path === "/products") return "products";
    if (path === "/tracking") return "tracking";
    if (path === "/profile" || path === "/sign-up" || path === "/sign-in") return "user";
    return "home";
  };

  useEffect(() => {
    setActive(getActiveFromPath(pathname));
  }, [pathname]);

  const navItems: NavItem[] = [
    { id: "categories", Icon: BiCategory, href: "/categories", label: "Categories" },
    { id: "products", Icon: ShoppingBasket, href: "/products", label: "Products" },
    { id: "home", Icon: Home, href: "/", label: "Home" },
    { id: "tracking", Icon: Truck, href: "/tracking", label: "Tracking" },
    {
      id: "user",
      href: user ? "/profile" : "/sign-up",
      label: user ? "Profile" : "Sign Up",
      isUser: true,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden backdrop-blur-lg shadow-sm">
      <div className="flex items-center w-full border border-neutral-100 px-1 py-0.5 gap-2 bg-white/80">
        {navItems.map((item) => {
          const isActive = item.id === active;

          if (item.isUser) {
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActive(item.id)}
                className="relative flex flex-col items-center focus:outline-none w-full"
                style={{ minWidth: 48 }}
              >
                <div className="relative flex items-center justify-center w-11 h-11">
                  {user ? (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full bg-yellow-400"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          style={{
                            boxShadow: "0 4px 18px rgba(255, 255, 0, 0.5)",
                          }}
                        />
                      )}
                      <Avatar className="w-11 h-11 relative z-10">
                        {user?.image && (
                          <AvatarImage 
                            src={user.image} 
                            alt={user?.name || "User"} 
                            className="object-cover" 
                          />
                        )}
                        <AvatarFallback className="bg-yellow-400 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </>
                  ) : (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full bg-yellow-400"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          style={{
                            boxShadow: "0 4px 18px rgba(255, 255, 0, 0.5)",
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <LogIn className={cn(
                          "w-6 h-6",
                          isActive ? "text-white" : "text-black"
                          )} />
                      </div>
                    </>
                  )}
                </div>
                <div className="h-4 flex items-center justify-center mt-1">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.span
                        key={item.id + "-label"}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="text-xs font-semibold text-yellow-500 tracking-wide whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    ) : (
                      <span className="text-xs font-semibold text-black tracking-wide whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          }

          const Icon = item.Icon!;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActive(item.id)}
              className="relative flex flex-col items-center focus:outline-none w-full"
              style={{ minWidth: 48 }}
            >
              <div className="relative flex items-center justify-center w-11 h-11">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-yellow-400"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    style={{
                      boxShadow: "0 4px 18px rgba(255, 255, 0, 0.5)",
                    }}
                  />
                )}

                {!isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-0 hover:opacity-100"
                    transition={{ duration: 0.15 }}
                  />
                )}

                <motion.div
                  className="relative z-10"
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
                >
                  <Icon
                    style={{ width: 20, height: 20 }}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    className={isActive ? "text-white" : "text-black"}
                  />
                </motion.div>

                <motion.span
                  className="absolute inset-0 rounded-full bg-yellow-300/40"
                  initial={{ scale: 0, opacity: 1 }}
                  whileTap={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              <div className="h-4 flex items-center justify-center mt-1">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.span
                      key={item.id + "-label"}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="text-xs font-semibold text-yellow-500 tracking-wide whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  ) : (
                    <span className="text-xs font-semibold text-black tracking-wide whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};