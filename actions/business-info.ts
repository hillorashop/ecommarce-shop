import { dbAbout, dbContactInfo, dbPrivacy, dbReturnPolicy } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type BusinessResponse = {
  data: dbContactInfo | null;
  success?: boolean;
};

export const getBusinessInfo = async (): Promise<BusinessResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/business-info`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return { data: null, success: false };
    return await res.json();
  } catch {
    return { data: null, success: false };
  }
};

export type AboutResponse = {
  data: dbAbout | null;
  success?: boolean;
};

export const getAboutInfo = async (): Promise<AboutResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/about`
    );

    if (!res.ok) return { data: null, success: false };
    return await res.json();
  } catch {
    return { data: null, success: false };
  }
};

export type PrivacyPolicyResponse = {
  data: dbPrivacy | null;
  success?: boolean;
};

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/privacy-policy`
    );

    if (!res.ok) return { data: null, success: false };
    return await res.json();
  } catch {
    return { data: null, success: false };
  }
};

export type ReturnPolicyResponse = {
  data: dbReturnPolicy | null;
  success?: boolean;
};

export const getReturnPolicy = async (): Promise<ReturnPolicyResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/return-policy`
    );

    if (!res.ok) return { data: null, success: false };
    return await res.json();
  } catch {
    return { data: null, success: false };
  }
};

export type LogoData = {
  primaryLogo: string;
  secondaryLogo?: string;
  favicon: string;
};

export type LogoResponse = {
  status: number;
  message: string;
  data: LogoData;
  success?: boolean;
};

export const getLogos = async (): Promise<LogoResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/logos`
    );

    if (!res.ok) return { status: res.status, message: "Failed to load logos", data: { primaryLogo: "", favicon: "" }, success: false };
    return await res.json();
  } catch {
    return { status: 500, message: "Failed to load logos", data: { primaryLogo: "", favicon: "" }, success: false };
  }
};
