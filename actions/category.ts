import { dbCategory, dbProduct } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

export type CategoriesResponse = {
  data: dbCategory[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type CategoryResponse = {
  category: dbCategory;
  data: dbProduct[];
  page?: number;
  perPage?: number;
  total: number;
  totalPages?: number;
};

export const getCategories = async (page?: number): Promise<CategoriesResponse> => {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_ADMIN_URL! || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/category`);

    if (page) {
      url.searchParams.set("page", page.toString());
    }

    const res = await fetchWithAdminAuth(url.toString());

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

export const getCategoryProducts = async (
  categoryUrl: string,
  page?: number,
  sortBy?: "price" | "createdAt",
  sortOrder?: "asc" | "desc",
  productName?: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<CategoryResponse> => {
  try {
    let url = `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/category/${categoryUrl}`;

    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (productName) params.append("productName", encodeURIComponent(productName));
    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

    if ([...params].length > 0) url += `?${params.toString()}`;

    const res = await fetchWithAdminAuth(url);
    if (!res.ok) {
      return {
        category: null as any,
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
      category: null as any,
      data: [],
      page: page || 1,
      perPage: 20,
      total: 0,
      totalPages: 0,
    };
  }
};
