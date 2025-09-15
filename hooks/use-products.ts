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
  // Build a stable query key instead of passing the whole object
  const queryKey = [
    "products",
    options.page ?? 1,
    options.sortBy ?? null,
    options.sortOrder ?? null,
    options.productName ?? null,
    options.minPrice ?? null,
    options.maxPrice ?? null,
    options.categoryIds?.join(",") ?? null,
  ];

  return useQuery<ProductsResponse, Error>({
    queryKey,
    queryFn: () =>
      getProducts(
        options.page,
        options.sortBy,
        options.sortOrder,
        options.productName,
        options.minPrice,
        options.maxPrice,
        options.categoryIds
      ),
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
