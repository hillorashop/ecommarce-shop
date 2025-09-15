'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct, ProductResponse } from '@/actions/product';
import { ONE_DAY } from '@/data';

export const useProduct = (productId: string) => {
  return useQuery<ProductResponse>({
    queryKey: ['product', productId], // cache key includes productId
    queryFn: () => getProduct(productId),
    staleTime: ONE_DAY, // 1 day cache
    gcTime:ONE_DAY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
