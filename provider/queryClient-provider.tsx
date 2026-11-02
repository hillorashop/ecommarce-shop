"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME, CLIENT_CACHE_TIME } from "@/hooks/use-query";

// Lazy-load the toast — it only shows once per user lifetime
const FirstTimeDataToast = dynamic(() => import("./first-time-data-toast"), {
  ssr: false,
});

interface Props {
  children: React.ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME,
        gcTime: DEFAULT_GC_TIME,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
}

export const ReactQueryClientProvider = ({ children }: Props) => {
  // Create the client inside useState so it is created once per component
  // mount (not shared across SSR requests)
  const [queryClient] = useState(() => makeQueryClient());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const persister = createAsyncStoragePersister({
      storage: window.localStorage,
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: CLIENT_CACHE_TIME.SIX_HOURS,
    });
  }, [queryClient]);

  // Render children immediately — no blank-screen flash while persister loads.
  // React Query merges cached data as it becomes available.
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <FirstTimeDataToast />
    </QueryClientProvider>
  );
};
