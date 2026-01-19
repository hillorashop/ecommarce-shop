declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

interface GTMEventData {
  [key: string]: any;
}

export const pushToDataLayer = (
  eventName: string,
  ecommerceData?: GTMEventData
): void => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: eventName,
    ecommerce: ecommerceData,
  });
};
