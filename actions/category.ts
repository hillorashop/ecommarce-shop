
import { dbCategory, dbProduct } from "@/types/type";

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
  const url = new URL(`${process.env.NEXT_PUBLIC_ADMIN_URL! || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/category`);

  if (page) {
    url.searchParams.set("page", page.toString());
  }

  const res = await fetch(url.toString());

  if (!res.ok) throw new Error("Failed to load categories");
  return await res.json();
};


export const getCategoryProducts = async (
  categoryUrl: string,
  page?: number,
  sortBy?: "price" |  "createdAt",
  sortOrder?: "asc" | "desc",
  productName?: string,
  minPrice?: number,
  maxPrice?: number,
): Promise<CategoryResponse> => {

  let url = `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/category/${categoryUrl}`

    const params = new URLSearchParams();

  if (page) params.append("page", page.toString());
  if (sortBy) params.append("sortBy", sortBy);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (productName) params.append("productName", encodeURIComponent(productName));
  if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

    if ([...params].length > 0) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch category");
  return res.json();
};

