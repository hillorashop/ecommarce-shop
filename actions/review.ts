import { dbReview } from "@/types/type";
import { fetchWithAdminAuth } from "@/lib/admin-api";

const getAdminBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    process.env.NEXT_PUBLIC_ADMIN_WWW_URL ||
    "http://localhost:3001"
  );
};

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
};

export type ProductReviewsResponse = {
  data: dbReview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: ReviewStats;
};

export type SubmitReviewInput = {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  userId?: string;
  userName?: string;
  userAvatar?: string;
};

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10
): Promise<ProductReviewsResponse> => {
  try {
    const adminUrl = getAdminBaseUrl();
    const url = `${adminUrl}/api/reviews?productId=${encodeURIComponent(
      productId
    )}&page=${page}&limit=${limit}`;

    const res = await fetchWithAdminAuth(url, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0 },
        stats: { averageRating: 0, totalReviews: 0, ratingDistribution: {} },
      };
    }

    return await res.json();
  } catch {
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      stats: { averageRating: 0, totalReviews: 0, ratingDistribution: {} },
    };
  }
};

export const getLatestReviews = async (
  page = 1,
  limit = 12
): Promise<ProductReviewsResponse> => {
  try {
    const adminUrl = getAdminBaseUrl();
    const url = `${adminUrl}/api/reviews?page=${page}&limit=${limit}`;

    const res = await fetchWithAdminAuth(url, {
      next: { revalidate: 60 },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: [],
        pagination: { total: 0, page, limit, totalPages: 0 },
        stats: { averageRating: 0, totalReviews: 0, ratingDistribution: {} },
      };
    }

    return await res.json();
  } catch {
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      stats: { averageRating: 0, totalReviews: 0, ratingDistribution: {} },
    };
  }
};

export const uploadReviewImages = async (files: File[]): Promise<string[]> => {
  if (files.length === 0 || files.length > 2) return [];

  for (const file of files) {
    if (!file.type.startsWith("image/") || file.size > 4 * 1024 * 1024) {
      return [];
    }
  }

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const adminUrl = getAdminBaseUrl();
    const res = await fetchWithAdminAuth(`${adminUrl}/api/reviews/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => null);
    return data?.urls || [];
  } catch {
    return [];
  }
};

export const submitProductReview = async (
  input: SubmitReviewInput
): Promise<{ success: boolean; data?: dbReview; message?: string }> => {
  if (!input.productId) return { success: false, message: "Product ID is required" };
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { success: false, message: "Please select a rating between 1 and 5 stars" };
  }
  if (!input.comment || input.comment.trim().length < 3) {
    return { success: false, message: "Review comment must be at least 3 characters" };
  }
  if (input.comment.trim().length > 500) {
    return { success: false, message: "Review comment cannot exceed 500 characters" };
  }
  if (input.images && input.images.length > 2) {
    return { success: false, message: "Maximum 2 images allowed" };
  }

  try {
    const adminUrl = getAdminBaseUrl();
    const res = await fetchWithAdminAuth(`${adminUrl}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: input.productId,
        rating: input.rating,
        comment: input.comment.trim(),
        images: input.images || [],
        userId: input.userId,
        userName: input.userName,
        userAvatar: input.userAvatar,
      }),
    });

    const result = await res.json().catch(() => null);
    if (!res.ok) {
      return { success: false, message: result?.error || result?.message || "Failed to submit review" };
    }

    return { success: true, ...result };
  } catch (err: any) {
    return { success: false, message: err?.message || "Failed to submit review" };
  }
};
