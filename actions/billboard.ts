import { dbBillboard } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type BillboardsResponse = {
  data: dbBillboard[];
  success?: boolean;
};

export const getBillboards = async (): Promise<BillboardsResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/billboards`
    );

    if (!res.ok) return { data: [], success: false };
    return await res.json();
  } catch {
    return { data: [], success: false };
  }
};
