
import { dbCategory } from "@/types/type";

export type CategoriesResponse = {
  data: dbCategory[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
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
