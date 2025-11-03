declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

interface GTMEventData {
  [key: string]: any;
}

export const pushToDataLayer = (eventName: string, data?: GTMEventData): void => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...data,
    });
  }
};
