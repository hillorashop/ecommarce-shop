import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductsResponse } from "@/actions/product";
import { ONE_DAY, TWODAY } from "@/data";

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
  return useQuery<ProductsResponse, Error>({
    queryKey: ["products", options], // cache key depends on filters
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
    staleTime:ONE_DAY ,    
    gcTime: ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,     

  });
};
