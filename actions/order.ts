import { dbOrder } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type orderInput = {
  existingOrderId?: string | null;
  status?: "PENDING" | "FAILED" | string;
  paymentMethod?: string;
  name: string;
  mobileNumber: string;
  address?: string;
  total?: number;
  totalDiscount?: number;
  transactionId?: string | null;
  userId?: string | null;

  shippingMethod?: string | null;
  shippingCost?: number | null;

  couponCode?: string | null;
  couponDiscount?: number | null;

  email?: string | null;
  orderFor?: string | null;
  zilla?: string | null;
  thana?: string | null;
  specialNote?: string | null; 

  fbc?: string | null;
  fbp?: string | null;
  ttpCookie?: string | null;
  ttclidValue?: string | null;
  gclid?: string | null;
  
  li_fat_id?: string | null;
  gbraid?: string | null;
  wbraid?: string | null;
  dclid?: string | null;
  uuid?: string | null;
  msclkid?: string | null;
  fbclid?: string | null;
  twclid?: string | null;
  rdt_cid?: string | null;
  epik?: string | null;
  ScCid?: string | null;
  sccid?: string | null;
  qclid?: string | null;
  irclickid?: string | null;
  awc?: string | null;

  orderItems: orderInputItems[];
};

export type orderInputItems = {
  productId: string;
  quantity: number;
  variant?: string | null;
  price?: number | null;
};
export type OrderResponse = {
  data:dbOrder;
};

export type GetOrdersResponse = {
  data: dbOrder[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};




export class OrderSubmissionError extends Error {
  errorCode?: string;
  blockedType?: "IP" | "PHONE";
  expiresAt?: string | null;

  constructor(message: string, errorCode?: string, blockedType?: "IP" | "PHONE", expiresAt?: string | null) {
    super(message);
    this.name = "OrderSubmissionError";
    this.errorCode = errorCode;
    this.blockedType = blockedType;
    this.expiresAt = expiresAt;
  }
}

export const postOrder = async (order: orderInput): Promise<OrderResponse> => {
  const res = await fetchWithAdminAuth(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/order/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    let errorMsg = "Failed to submit order";
    let errorCode: string | undefined;
    let blockedType: "IP" | "PHONE" | undefined;
    let expiresAt: string | null | undefined;

    try {
      const errJson = await res.json();
      errorMsg = errJson.message || errJson.error || errorMsg;
      errorCode = errJson.error;
      blockedType = errJson.blockedType;
      expiresAt = errJson.expiresAt;
    } catch {
      const errorText = await res.text();
      errorMsg = errorText || errorMsg;
    }

    throw new OrderSubmissionError(errorMsg, errorCode, blockedType, expiresAt);
  }

  return await res.json();
};


export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/order/get-order`
  );
  url.searchParams.set("orderId", orderId);

  const res = await fetchWithAdminAuth(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return await res.json();
};

export const getOrders = async (
  page = 1,
  pageSize:number,
  userId?: string
): Promise<GetOrdersResponse> => {
  try {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/order/get-order`
    );

    url.searchParams.set("page", page.toString());
    url.searchParams.set("pageSize", pageSize.toString());
    if (userId) {
      url.searchParams.set("userId", userId);
    }

    const res = await fetchWithAdminAuth(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ensures fresh data every time
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data: GetOrdersResponse = await res.json();
    return data;
  } catch (error) {
    console.error("getOrders API error:", error);
    throw error;
  }
};
