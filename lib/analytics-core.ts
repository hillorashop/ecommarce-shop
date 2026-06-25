import { getClientIpSync } from "./get-ip";


export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  if (typeof document === 'undefined') return cookies;
  
  document.cookie.split(';').forEach(cookie => {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key && valueParts.length) {
      cookies[key] = decodeURIComponent(valueParts.join('='));
    }
  });
  return cookies;
};

export const getPageInfo = () => {
  if (typeof window === 'undefined') return {};
  
  return {
    url: window.location.href,
    path: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    title: document.title,
    referrer: document.referrer,
  };
};

export const getUserInfo = (): Record<string, unknown> => {
  if (typeof window === 'undefined') return {};
   const { ip, country } = getClientIpSync();
  return {
    ip,
    country, 
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: [...navigator.languages],
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
  };
};

export const getDocumentInfo = () => {
  if (typeof document === 'undefined') return {};
  
  return {
    referrer: document.referrer,
    domain: document.domain,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    documentTitle: document.title,
    characterSet: document.characterSet,
    contentType: document.contentType,
  };
};

export const getClientId = (): string => {
  if (typeof window === 'undefined') return '';
  
  const cookieMatch = document.cookie.match(/_client_id=([^;]+)/);
  if (cookieMatch) return cookieMatch[1];
  
  let clientId = localStorage.getItem('_client_id');
  if (clientId) return clientId;
  
  clientId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  document.cookie = `_client_id=${clientId}; max-age=31536000; path=/; SameSite=Lax`;
  localStorage.setItem('_client_id', clientId);
  
  return clientId;
};

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('_session_id');
  if (!sessionId) {
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    sessionStorage.setItem('_session_id', sessionId);
  }
  return sessionId;
};

export const generateEventId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};