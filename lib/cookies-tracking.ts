const DEFAULT_EXP_DAYS = 90;

const CLICK_IDS = [
  "gclid",      // Google Ads click ID
  "gbraid",     // Google Ads iOS app-to-web attribution
  "wbraid",     // Google Ads web-to-app / privacy-safe attribution

  "msclkid",    // Microsoft Ads click ID

  "ttclid",     // TikTok Ads click ID

  "twclid",     // X (Twitter) Ads click ID

  "li_fat_id",  // LinkedIn Ads click ID

  "rdt_cid",    // Reddit Ads click ID

  "epik",       // Pinterest Ads click ID

  "ScCid",      // Snapchat Ads click ID (official casing)
  "sccid",      // Snapchat Ads click ID (alternative casing)

  "qclid",      // Quora Ads click ID
];

function setCookie(name: string, value: string, days = DEFAULT_EXP_DAYS) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 86400000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function initClickIdCookies() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);

  CLICK_IDS.forEach((id) => {
    const value = params.get(id);

    if (value) {
      setCookie(id, value);
    }
  });
}