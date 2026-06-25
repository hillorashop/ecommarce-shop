const DEFAULT_EXP_DAYS = 90;

const CLICK_IDS = [
  // Google
  "gclid",       // Google Ads click ID
  "gbraid",      // Google Ads iOS app-to-web attribution  
  "wbraid",      // Google Ads web-to-app / privacy-safe attribution
  "dclid",       // ✅ ADD — Google Display & Video 360 click ID
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

  // ✅ ADD these:
  "irclickid",   // Impact (affiliate network) — common in mixed setups
  "awc",         // Awin affiliate click ID
];

function setCookie(name: string, value: string, days = DEFAULT_EXP_DAYS) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 86400000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function initClickIdCookiesFromParams(params: URLSearchParams) {
  if (typeof window === "undefined") return;

  CLICK_IDS.forEach((id) => {
    const value = params.get(id);
    if (value) {
      setCookie(id, value);
    }
  });
}