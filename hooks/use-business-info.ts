import { BusinessResponse, getBusinessInfo } from "@/actions/business-info";
import { useQuery } from "@tanstack/react-query";




export function useBusinessInfo() {
  return useQuery<BusinessResponse, Error>({
    queryKey: ["business-info"], 
    queryFn: () => getBusinessInfo(),
    staleTime: 60 * 60 * 1000,  
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,   

  });
}
