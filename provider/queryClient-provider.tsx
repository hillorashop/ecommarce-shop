"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { useEffect, useState } from "react";
import FirstTimeDataToast from "./first-time-data-toast";

interface Props {
  children: React.ReactNode;
}

// ✅ Create a single QueryClient outside the component (no hooks needed)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export const ReactQueryClientProvider = ({ children }: Props) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: 60 * 60 * 1000,
    });

    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
        <FirstTimeDataToast/>
      </HydrationBoundary>
    </QueryClientProvider>
  );
};
