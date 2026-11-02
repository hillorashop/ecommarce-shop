import { dbOrder } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type orderInput = {
  existingOrderId?: string | null;
  status?: "PENDING" | "FAILED" | string;
  paymentMethod?: string;
  name: string;
  mobileNumber: string;
  address?: string;
  transactionId?: string | null;
  userId?: string | null;

  shippingMethod?: string | null;
  couponCode?: string | null;

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
};
export type OrderResponse = {
  data: dbOrder | null;
  success?: boolean;
  status?: number;
  message?: string;
  error?: string;
  errorCode?: string;
  blockedType?: "IP" | "PHONE";
  expiresAt?: string | null;
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

export const postOrder = async (order: orderInput): Promise<OrderResponse> => {
  try {
    const res = await fetchWithAdminAuth(
      `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/order/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg =
        json?.message || json?.error || "Failed to submit order";
      const errorCode = json?.error || (res.status === 403 ? "ORDER_BLOCKED" : "ORDER_FAILED");
      const blockedType = json?.blockedType;
      const expiresAt = json?.expiresAt;

      return {
        success: false,
        status: res.status,
        data: null,
        message: errorMsg,
        error: errorCode,
        errorCode,
        blockedType,
        expiresAt,
      };
    }

    return {
      success: true,
      status: 200,
      data: json?.data || json,
      message: json?.message || "Order placed successfully",
    };
  } catch (err: any) {
    console.error("postOrder error:", err);
    return {
      success: false,
      status: 500,
      data: null,
      message: err?.message || "Network error. Please try again.",
      error: "NETWORK_ERROR",
    };
  }
};

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
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
      return {
        success: false,
        status: res.status,
        data: null,
        message: "Failed to fetch order",
      };
    }

    const json = await res.json().catch(() => null);
    return {
      success: true,
      status: 200,
      data: json?.data || json,
    };
  } catch (error: any) {
    console.error("getOrderById error:", error);
    return {
      success: false,
      status: 500,
      data: null,
      message: error?.message || "Failed to fetch order",
    };
  }
};

export const getOrders = async (
  page = 1,
  pageSize: number,
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
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: [],
        pagination: { totalOrders: 0, totalPages: 0, currentPage: page, pageSize },
      };
    }

    const data: GetOrdersResponse = await res.json();
    return data;
  } catch (error) {
    console.error("getOrders API error:", error);
    return {
      data: [],
      pagination: { totalOrders: 0, totalPages: 0, currentPage: page, pageSize },
    };
  }
};
