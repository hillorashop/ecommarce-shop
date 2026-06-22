// hooks/use-blogs.ts

import { useQuery } from "@tanstack/react-query";
import { BlogResponse, SingleBlogResponse, getBlogs, getBlogByUrl, } from "@/actions/blog";

export function useBlogs(page?: number) {
  return useQuery<BlogResponse, Error>({
    queryKey: ["blogs", page],
    queryFn: () => getBlogs(page),
    staleTime: 60 * 60 * 1000,  // 1 hour
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useBlogByUrl(url: string) {
  return useQuery<SingleBlogResponse, Error>({
    queryKey: ["blog", url],
    queryFn: () => getBlogByUrl(url),
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!url,
  });
}

// Optional: Hook for filtered blogs
interface UseFilteredBlogsOptions {
  page?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

// export function useFilteredBlogs(options: UseFilteredBlogsOptions) {
//   const {
//     page = 1,
//     search = "",
//     sortBy = "createdAt",
//     sortOrder = "desc",
//   } = options;

//   return useQuery<BlogResponse, Error>({
//     queryKey: ["blogs", page,  search, sortBy, sortOrder],
//     queryFn: () => getFilteredBlogs(page, search, sortBy, sortOrder),
//     staleTime: 60 * 60 * 1000,
//     gcTime: 60 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
// }