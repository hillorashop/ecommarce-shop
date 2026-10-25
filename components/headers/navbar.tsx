"use client";

import { Header } from "@/components/headers/header";
import { Navigation } from "@/components/headers/navigation";
import { MobileHeader } from "./mobile-header";
import { LogoData } from "@/actions/business-info";

interface NavbarProps {
  initialLogos?: LogoData | null;
}

export const Navbar = ({ initialLogos }: NavbarProps) => {
  return (
    <>
      <MobileHeader initialLogos={initialLogos} />
      <Header initialLogos={initialLogos} />
      <Navigation />
    </>
  );
};