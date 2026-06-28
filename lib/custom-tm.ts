import { io, Socket } from "socket.io-client";
import { generateEventId, getAllCookies, getClientId, getDocumentInfo, getPageInfo, getSessionId, getUserInfo } from "./analytics-core";
import { getClientIp } from "./get-ip";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_EVENTS_SERVER_URL!, {
      transports: ["websocket"],
    });

        getClientIp();
  }
  return socket;
};



interface EventPayload {
  [key: string]: any;
}

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
      performance: {
        loadTime: performance.timing ? 
          performance.timing.loadEventEnd - performance.timing.navigationStart : 
          undefined,
        domReady: performance.timing ?
          performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart :
          undefined,
      }
    }
  };


  socket.emit("event", {
    event: eventName,
    ...enrichedPayload
  });
};


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
