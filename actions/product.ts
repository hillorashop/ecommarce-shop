import { dbProduct, dbCategory, dbReview, UnitPricing } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type dbProductwihtoutAll = {
    id: string;
    productId: string;
    productUrl: string;
    name: string;
    productImage: string;
    price: number;
    categoryId: string;
    discountPrice?: number;
    kgUnit?:     Record<number, UnitPricing>;
    piecesUnit?: Record<number, UnitPricing>;
    gramUnit?:   Record<number, UnitPricing>;
    productType?: "BEST_SELLING" | "ALL_PRODUCT" | null;
    inStocks: number;
    freeDelivery?: boolean | null;
    reviews: dbReview[];    
};

export type ProductsResponse = {
  data: dbProductwihtoutAll[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export const getProducts = async (
  page?: number,
  sortBy?: "price" | "category" | "createdAt",
  sortOrder?: "asc" | "desc",
  productName?: string,
  minPrice?: number,
  maxPrice?: number,
  categoryIds?: string[] 
): Promise<ProductsResponse> => {
  let url = `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/products`;

  const params = new URLSearchParams();

  if (page) params.append("page", page.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (productName) params.append("productName", encodeURIComponent(productName));
  if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
  if (categoryIds && categoryIds.length > 0)
    params.append("categoryIds", categoryIds.join(","));

  if ([...params].length > 0) url += `?${params.toString()}`;

  try {
    const res = await fetchWithAdminAuth(url);
    if (!res.ok) {
      return {
        data: [],
        page: page || 1,
        perPage: 20,
        total: 0,
        totalPages: 0,
      };
    }
    return await res.json();
  } catch {
    return {
      data: [],
      page: page || 1,
      perPage: 20,
      total: 0,
      totalPages: 0,
    };
  }
};

export type ProductResponse = {
  data: dbProduct & {
    category: dbCategory;
  };
};

export const getProduct = async (productUrl: string): Promise<ProductResponse> => {
  try {
    const res = await fetchWithAdminAuth(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/products/${productUrl}`);
    if (!res.ok) return { data: null as any };
    return res.json();
  } catch {
    return { data: null as any };
  }
};

export type BestSellingProductResponse = {
  data: dbProductwihtoutAll[];
  total: number;
};

export const getBestSellingProducts = async (): Promise<BestSellingProductResponse> => {
  try {
    const res = await fetchWithAdminAuth(`${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/products/best-selling-products`);
    if (!res.ok) return { data: [], total: 0 };
    return res.json();
  } catch {
    return { data: [], total: 0 };
  }
};
