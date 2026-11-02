import { useQuery, QueryFunction, QueryKey, UseQueryResult, UseQueryOptions } from "@tanstack/react-query";

/**
 * Standard client cache times (in milliseconds).
 * Aligned with the 6-hour backend Redis cache TTL.
 */
export const CLIENT_CACHE_TIME = {
  // 6 hours: Global max memory & persistence lifetime (matching Redis TTL)
  SIX_HOURS: 6 * 60 * 60 * 1000,
  // 1 hour: Semi-static content (About, Policies, Blogs)
  ONE_HOUR: 60 * 60 * 1000,
  // 5 minutes: Gold standard for e-commerce browsing (instant 0ms navigation, fresh within 5 mins)
  FIVE_MINUTES: 5 * 60 * 1000,
  // 1 minute: Real-time transactional / user data
  ONE_MINUTE: 60 * 1000,
} as const;

export const DEFAULT_STALE_TIME = CLIENT_CACHE_TIME.FIVE_MINUTES;   // 5 minutes fresh in browser
export const DEFAULT_GC_TIME = CLIENT_CACHE_TIME.SIX_HOURS;         // 6 hours in memory / cache

export const useCustomQuery = <
  TQueryFnData = unknown,
  TError = Error
>(
  queryKey: QueryKey,
  queryFunction: QueryFunction<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TQueryFnData, QueryKey>,
    "queryKey" | "queryFn"
  > & { initialData?: TQueryFnData }
): UseQueryResult<TQueryFnData, TError> => {
  return useQuery<TQueryFnData, TError>({
    queryKey,
    queryFn: queryFunction,
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options, 
  });
};

