import { useQuery } from "@tanstack/react-query";
import { CategoriesResponse, getCategories } from "@/actions/category";


/* ✅ Custom hook for categories */
export function useCategories(page?: number) {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories", page], // cache key depends on page
    queryFn: () => getCategories(page),
    staleTime: 60 * 60 * 1000,  
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,   

  });
}
