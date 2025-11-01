'use client';

import { useQuery } from '@tanstack/react-query';
import { getProduct, ProductResponse } from '@/actions/product';


export const useProduct = (productId: string) => {
  return useQuery<ProductResponse>({
    queryKey: ['product', productId], // cache key includes productId
    queryFn: () => getProduct(productId),
    staleTime: 60 * 60 * 1000, // 1 day cache
    gcTime:60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
