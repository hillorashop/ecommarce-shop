import { dbOrder } from "@/types/type";

export type orderInput = {     
  paymentMethod: string;
  name: string;
  mobileNumber: string;
  address: string;
  total: number;
  totalDiscount: number;
  transactionId?: string | null;
  userId?: string | null;
  orderItems:orderInputItems[]
};

export type orderInputItems = {
  productId:string
  quantity:number
}
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




export const postOrder = async (order: orderInput): Promise<OrderResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/order/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to submit order: ${errorText}`);
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

    const res = await fetch(url.toString(), {
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
