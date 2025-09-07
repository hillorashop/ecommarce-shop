import { useQuery } from "@tanstack/react-query";
import { CategoriesResponse, getCategories } from "@/actions/category";
import { ONE_DAY, THREEDAY } from "@/data";

/* ✅ Custom hook for categories */
export function useCategories(page?: number) {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories", page], // cache key depends on page
    queryFn: () => getCategories(page),
    staleTime: THREEDAY,  
    gcTime: THREEDAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,   

  });
}
