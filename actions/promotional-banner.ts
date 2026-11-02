import { dbPromotionalBanner } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type PromotionalBannerResponse = {
  status?: number;
  message?: string;
  data?: dbPromotionalBanner | null;
  total?: number;
  success?: boolean;
};

export const getPromotionalBanner = async (): Promise<PromotionalBannerResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/promotional-banners`
    );

    if (!res.ok) return { data: null, status: res.status, success: false };
    return await res.json();
  } catch {
    return { data: null, status: 500, success: false };
  }
};
