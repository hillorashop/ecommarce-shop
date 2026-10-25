import { useQuery, QueryFunction, QueryKey, UseQueryResult, UseQueryOptions } from "@tanstack/react-query";

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
    staleTime: 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    ...options, 
  });
};

