"use client";

import { useUser } from "@/contexts/UserContext";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const LogOutButton = () => {
  const { setUser } = useUser();
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/user/logout`, {
        method: "POST",
        credentials: "include", // send cookies
      });

      setUser(null); 
    router.push("/")
    router.refresh()
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Button
      onClick={handleLogout}
      className="flex items-center gap-x-2"
    >    
    <LogOut className="size-4"/>
      Logout
    </Button>
  );
};
