import { useQuery } from "@tanstack/react-query";
import { CategoriesResponse, CategoryResponse, getCategories, getCategoryProducts } from "@/actions/category";



export function useCategories(page?: number) {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories", page], 
    queryFn: () => getCategories(page),
    staleTime: 60 * 60 * 1000,  
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,   

  });
}



interface UseProductsOptions {
  categoryUrl: string;
  page?: number;
  sortBy?: "price" |  "createdAt";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
  productName?:string;
  
}

export const useCategoryProducts = (options: UseProductsOptions) => {
  const categoryUrl = options.categoryUrl?? "";
  const page = options.page;
  const sortBy = options.sortBy ?? "createdAt";
  const sortOrder = options.sortOrder ?? "desc";
  const productName= options.productName;
  const minPrice = options.minPrice ?? undefined; 
  const maxPrice = options.maxPrice ?? undefined;



  const queryKey = [
   "products",
    categoryUrl,
    page,
    sortBy,
    sortOrder,
    productName,
    minPrice,
    maxPrice,
    
  ];

  return useQuery<CategoryResponse, Error>({
    queryKey,
    queryFn: () =>
      getCategoryProducts(categoryUrl, page, sortBy, sortOrder, productName, minPrice, maxPrice),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
