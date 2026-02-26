import { dbContactInfo } from "@/types/type";

export type BusinessResponse = {
  data: dbContactInfo | null;
};

export const getBusinessInfo = async (): Promise<BusinessResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/business-info`
  );

  if (!res.ok) throw new Error("Failed to load business info");

  return await res.json();
};