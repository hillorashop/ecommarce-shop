import { dbCouponCode } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type CouponCodesResponse = {
  data: dbCouponCode[];
  total: number;
};

export const getCouponCodes = async (): Promise<CouponCodesResponse> => {
  const res = await fetchWithAdminAuth(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/coupon-codes`
  );

  if (!res.ok) throw new Error("Failed to load coupon codes");

  return await res.json();
};