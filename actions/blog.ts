// actions/blog.ts

import { dbBlog } from "@/types/type";

export type BlogResponse = {
  data: dbBlog[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type SingleBlogResponse = {
  data: dbBlog;
};

export const getBlogs = async (page?: number): Promise<BlogResponse> => {
  const url = new URL(`${process.env.NEXT_PUBLIC_ADMIN_URL! || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/blogs`);

  if (page) {
    url.searchParams.set("page", page.toString());
  }

  const res = await fetch(url.toString());

  console.log(res)

  if (!res.ok) throw new Error("Failed to load blogs");
  return await res.json();
};

export const getBlogByUrl = async (blogUrl: string): Promise<SingleBlogResponse> => {
  const url = `${process.env.NEXT_PUBLIC_ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/blogs/${blogUrl}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch blog");
  return res.json();
};

// // Optional: For filtering blogs with additional parameters
// export type FilteredBlogsResponse = {
//   data: dbBlog[];
//   page: number;
//   perPage: number;
//   total: number;
//   totalPages: number;
// };

// export const getFilteredBlogs = async (
//   page?: number,
//   search?: string,
//   sortBy?: "createdAt" | "updatedAt" | "title",
//   sortOrder?: "asc" | "desc"
// ): Promise<FilteredBlogsResponse> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_ADMIN_URL! || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/blog`);

//   const params = new URLSearchParams();

//   if (page) params.append("page", page.toString());
//   if (search) params.append("search", encodeURIComponent(search));
//   if (sortBy) params.append("sortBy", sortBy);
//   if (sortOrder) params.append("sortOrder", sortOrder);

//   if ([...params].length > 0) {
//     url.search = params.toString();
//   }

//   const res = await fetch(url.toString());

//   if (!res.ok) throw new Error("Failed to load filtered blogs");
//   return await res.json();
// };

// // Optional: For searching blogs
// export const searchBlogs = async (
//   searchTerm: string,
//   page?: number
// ): Promise<BlogResponse> => {
//   const url = new URL(`${process.env.NEXT_PUBLIC_ADMIN_URL! || process.env.NEXT_PUBLIC_ADMIN_WWW_URL}/api/blog/search`);

//   url.searchParams.set("q", encodeURIComponent(searchTerm));
//   if (page) {
//     url.searchParams.set("page", page.toString());
//   }

//   const res = await fetch(url.toString());

//   if (!res.ok) throw new Error("Failed to search blogs");
//   return await res.json();
// };