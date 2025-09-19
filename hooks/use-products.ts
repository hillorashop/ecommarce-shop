import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsResponse } from "@/actions/product";
import { ONE_DAY } from "@/data";

interface UseProductsOptions {
  page?: number;
  sortBy?: "price" | "category" | "createdAt";
  sortOrder?: "asc" | "desc";
  productName?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryIds?: string[];
}

export const useProducts = (options: UseProductsOptions = {}) => {
  // Set defaults inside the hook
  const page = options.page ?? 1;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "asc";
  const productName = options.productName ?? "";
  const minPrice = options.minPrice ?? undefined; // undefined = no filter
  const maxPrice = options.maxPrice ?? undefined;
  const categoryIds = options.categoryIds ?? [];

  // Build a stable query key
  const queryKey = [
    "products",
    page,
    sortBy,
    sortOrder,
    productName,
    minPrice,
    maxPrice,
    categoryIds.join(","),
  ];

  return useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: () =>
      getProducts(page, sortBy, sortOrder, productName, minPrice, maxPrice, categoryIds),
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
