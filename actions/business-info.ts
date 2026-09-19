import { dbAbout, dbContactInfo, dbPrivacy, dbReturnPolicy } from "@/types/type";

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


export type AboutResponse = {
  data: dbAbout | null;
};

export const getAboutInfo = async (): Promise<AboutResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/about`
  );

  if (!res.ok) throw new Error("Failed to load about info");

  return await res.json();
};


export type PrivacyPolicyResponse = {
  data: dbPrivacy | null;
};

export const getPrivacyPolicy = async (): Promise<PrivacyPolicyResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/privacy-policy`
  );

  if (!res.ok) throw new Error("Failed to load privacy policy");

  return await res.json();
};


export type ReturnPolicyResponse = {
  data: dbReturnPolicy | null;
};

export const getReturnPolicy = async (): Promise<ReturnPolicyResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/return-policy`
  );

  if (!res.ok) throw new Error("Failed to load return policy");

  return await res.json();
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
};

export const getLogos = async (): Promise<LogoResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/logos`
  );

  if (!res.ok) throw new Error("Failed to load logos");

  return await res.json();
};