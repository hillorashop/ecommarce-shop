import { io, Socket } from "socket.io-client";
import { generateEventId, getAllCookies, getClientId, getDocumentInfo, getPageInfo, getSessionId, getUserInfo } from "./analytics-core";

const normalizeEcommerce = (ecommerce: any) => {
  if (!ecommerce) return ecommerce;

  return {
    ...ecommerce,
    value: ecommerce.value !== undefined ? Number(ecommerce.value) : undefined,
    items: Array.isArray(ecommerce.items)
      ? ecommerce.items.map((item: any) => ({
          ...item,
          price: item.price !== undefined ? Number(item.price) : undefined,
          discount: item.discount !== undefined ? Number(item.discount) : 0,
          quantity: item.quantity !== undefined ? Number(item.quantity) : 1,
        }))
      : ecommerce.items,
  };
};

export const trackEcommerceEvent = (
  eventName: string,
  ecommerce?: any,
  extra?: Record<string, any>
): void => {
  const normalized = normalizeEcommerce(ecommerce);

  emitEvent(eventName, {
    ecommerce: normalized,
    event_category: 'ecommerce',
    event_label: eventName,
    ...extra,
  });
};


export const trackPageView = (pageName?: string, additionalData?: Record<string, any>) => {
  emitEvent('page_view', {
    page_name:  document.title || pageName,
    page_path: window.location.pathname,
    page_url: window.location.href,
    ...additionalData
  });
};


let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_EVENTS_SERVER_URL!, {
      transports: ["websocket"],
    });
  }
  return socket;
};



interface EventPayload {
  [key: string]: any;
}

// Cache the performance context once per session to avoid redundant calculations
let _perfContext: { loadTime?: number; domReady?: number } | null = null;

const getPerfContext = () => {
  if (_perfContext) return _perfContext;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    _perfContext = {
      loadTime: nav ? Math.round(nav.loadEventEnd - nav.startTime) : undefined,
      domReady: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : undefined,
    };
  } catch {
    _perfContext = {};
  }
  return _perfContext;
};

export const emitEvent = (eventName: string, payload?: EventPayload): void => {
  if (typeof window === "undefined") return;

  const socket = getSocket();
  const eventId = generateEventId();
  
  const enrichedPayload = {
    ...payload,
    _context: {
      page: getPageInfo(),
      user: getUserInfo(),
      document: getDocumentInfo(),
      cookies: getAllCookies(),
      eventId: eventId,
      clientId: getClientId(),
      sessionId: getSessionId(),
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      performance: getPerfContext(),
    }
  };

  socket.emit("event", {
    event: eventName,
    ...enrichedPayload
  });
};


