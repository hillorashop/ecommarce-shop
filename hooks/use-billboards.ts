"use client";

import { useQuery } from "@tanstack/react-query";
import { dbBillboard } from "@/types/type";
import { getBillboards } from "@/actions/billboard";


export type BillboardsResponse = {
  data: dbBillboard[];
};

/* ✅ Custom hook for billboards */
export function useBillboards() {
  return useQuery<BillboardsResponse, Error>({
    queryKey: ["billboards"], // unique cache key
    queryFn: getBillboards,   // fetch function
    staleTime: 60 * 60 * 1000,      // cache validity
    gcTime: 60 * 60 * 1000,         // garbage collection time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
