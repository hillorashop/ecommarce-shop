"use client";

import { useQuery } from "@tanstack/react-query";
import { dbBillboard } from "@/types/type";
import { getBillboards } from "@/actions/billboard";
import { ONE_DAY, THREEDAY } from "@/data";

export type BillboardsResponse = {
  data: dbBillboard[];
};

/* ✅ Custom hook for billboards */
export function useBillboards() {
  return useQuery<BillboardsResponse, Error>({
    queryKey: ["billboards"], // unique cache key
    queryFn: getBillboards,   // fetch function
    staleTime: ONE_DAY,      // cache validity
    gcTime: ONE_DAY,         // garbage collection time
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
