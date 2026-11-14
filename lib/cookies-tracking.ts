const DEFAULT_EXP_DAYS = 90;

export const CLICK_IDS = [
  // Google
  "gclid",       // Google Ads click ID
  "gbraid",      // Google Ads iOS app-to-web attribution  
  "wbraid",      // Google Ads web-to-app / privacy-safe attribution
  "dclid",       // Google Display & Video 360 click ID
  "uuid",
  // Microsoft
  "msclkid",     // Microsoft Ads click ID

  // Meta
  "fbclid",      // Meta (Facebook/Instagram) click ID

  // TikTok
  "ttclid",      // TikTok Ads click ID

  // X (Twitter)
  "twclid",      // X Ads click ID

  // LinkedIn
  "li_fat_id",   // LinkedIn First-party Ad Tracking ID

  // Reddit
  "rdt_cid",     // Reddit Ads click ID

  // Pinterest
  "epik",        // Pinterest Enhanced Match click ID

  // Snapchat
  "ScCid",       // Snapchat click ID (official casing)
  "sccid",       // Snapchat click ID (lowercase fallback)

  // Quora
  "qclid",       // Quora Ads click ID

  // Affiliate networks
  "irclickid",   // Impact affiliate click ID
  "awc",         // Awin affiliate click ID
];

export function setCookie(name: string, value: string, days = DEFAULT_EXP_DAYS) {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 86400000);

  try {
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  } catch {}

  // LocalStorage fallback protects attribution against Safari ITP 24h cookie wipe
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`_track_${name}`, value);
    }
  } catch {}
}

export function getTrackingCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  try {
    const row = document.cookie
      .split("; ")
      .find((r) => r.startsWith(`${name}=`));
    if (row) {
      const rawVal = row.slice(name.length + 1);
      if (rawVal) return decodeURIComponent(rawVal);
    }
  } catch {}

  return null;
}

export function getTrackingValue(
  name: string,
  searchParams?: URLSearchParams | null
): string | null {
  if (typeof window === "undefined") return null;

  // 1. Direct URL search parameter (instant, zero race condition)
  if (searchParams) {
    const fromParams = searchParams.get(name);
    if (fromParams) return fromParams;
  }
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get(name);
    if (fromUrl) return fromUrl;
  } catch {}

  // 2. Cookie storage
  const fromCookie = getTrackingCookie(name);
  if (fromCookie) return fromCookie;

  // 3. LocalStorage fallback (resilient across sessions & Safari ITP)
  try {
    if (typeof localStorage !== "undefined") {
      const fromStorage = localStorage.getItem(`_track_${name}`);
      if (fromStorage) return fromStorage;
    }
  } catch {}

  return null;
}

export function initClickIdCookiesFromParams(params?: URLSearchParams | null) {
  if (typeof window === "undefined") return;

  const effectiveParams =
    params || new URLSearchParams(window.location.search);

  CLICK_IDS.forEach((id) => {
    const value = effectiveParams.get(id);
    if (value) {
      setCookie(id, value);
    }
  });
}