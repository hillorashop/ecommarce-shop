import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsResponse } from "@/actions/product";


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

  const page = options.page;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";
  const productName = options.productName ?? "";
  const minPrice = options.minPrice ?? undefined; 
  const maxPrice = options.maxPrice ?? undefined;
  const categoryIds = options.categoryIds ?? [];


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
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
