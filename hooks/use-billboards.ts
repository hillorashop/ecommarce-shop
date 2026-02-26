"use client";

import { useQuery } from "@tanstack/react-query";
import { dbBillboard } from "@/types/type";
import { getBillboards } from "@/actions/billboard";


export type BillboardsResponse = {
  data: dbBillboard[];
};


export function useBillboards() {
  return useQuery<BillboardsResponse, Error>({
    queryKey: ["billboards"], 
    queryFn: getBillboards,   
    staleTime: 60 * 60 * 1000,      
    gcTime: 60 * 60 * 1000,        
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
