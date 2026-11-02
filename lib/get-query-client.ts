import { QueryClient } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from "@/hooks/use-query";

export function getQueryClient() {
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
