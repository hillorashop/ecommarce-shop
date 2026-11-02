import { dbCouponCode } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type CouponCodesResponse = {
  data: dbCouponCode[];
  total: number;
  success?: boolean;
};

export const getCouponCodes = async (): Promise<CouponCodesResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/coupon-codes`
    );

    if (!res.ok) return { data: [], total: 0, success: false };
    return await res.json();
  } catch {
    return { data: [], total: 0, success: false };
  }
};
