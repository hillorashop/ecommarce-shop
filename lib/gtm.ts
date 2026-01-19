declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

interface GTMEventData {
  [key: string]: any;
}

const normalizeEcommerce = (ecommerce: any) => {
  if (!ecommerce) return ecommerce;

  return {
    ...ecommerce,
    value: ecommerce.value !== undefined ? Number(ecommerce.value) : undefined,
    items: Array.isArray(ecommerce.items)
      ? ecommerce.items.map((item: any) => ({
          ...item,
          price: item.price !== undefined ? Number(item.price) : undefined,
          discount:
            item.discount !== undefined ? Number(item.discount) : 0,
          quantity:
            item.quantity !== undefined ? Number(item.quantity) : 1,
        }))
      : ecommerce.items,
  };
};

export const pushToDataLayer = (
  eventName: string,
  ecommerceData?: GTMEventData
): void => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({ ecommerce: null });

  window.dataLayer.push({
    event: eventName,
    ecommerce: normalizeEcommerce(ecommerceData),
  });
};
