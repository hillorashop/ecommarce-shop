import { dbProduct, dbCategory, dbReview } from "@/types/type";

export type dbProductwihtoutAll = {

    id: string;
    productId:string;
    productUrl:string;
    name: string;
    productImage: string;
    price: number;
    discountPrice?: number;
    packageQuantity: string;
    packageQuantityType: string;
    inStocks: number;
    reviews: dbReview[];    
  
}

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
  categoryIds?: string[] // new optional filter
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

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to load Products");

  return await res.json();
};

export type ProductResponse = {
  data: dbProduct & {
    category: dbCategory;
  };
};

export const getProduct = async (productUrl: string): Promise<ProductResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/products/${productUrl}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};