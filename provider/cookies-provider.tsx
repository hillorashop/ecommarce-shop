"use client";

import { useEffect } from "react";
import { initClickIdCookies } from "@/lib/cookies-tracking";

interface Props {
  children: React.ReactNode;
}

export const CookiesProvider = ({ children }: Props) => {
  useEffect(() => {
    initClickIdCookies();
  }, []);

  return <>{children}</>;
};