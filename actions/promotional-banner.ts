import { dbPromotionalBanner } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type PromotionalBannerResponse = {
  status?: number;
  message?: string;
  data?: dbPromotionalBanner | null;
  total?: number;
};

export const getPromotionalBanner = async (): Promise<PromotionalBannerResponse> => {
  const res = await fetchWithAdminAuth(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/promotional-banners`
  );

  if (!res.ok) throw new Error("Failed to load promotional banners");
  return await res.json();
};
