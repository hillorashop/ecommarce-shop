import { dbDeliveryCharge } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type DeliveryChargeResponse = {
  data: dbDeliveryCharge | null;
  success?: boolean;
};

export const getDeliveryCharges = async (): Promise<DeliveryChargeResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/delivery-charges`
    );

    if (!res.ok) return { data: null, success: false };
    return await res.json();
  } catch {
    return { data: null, success: false };
  }
};
