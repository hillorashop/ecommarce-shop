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
  const adminUrl = getAdminBaseUrl();
  const url = `${adminUrl}/api/reviews?productId=${encodeURIComponent(
    productId
  )}&page=${page}&limit=${limit}`;

  const res = await fetchWithAdminAuth(url, {
    next: { revalidate: 0 },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to load reviews");
  }

  return res.json();
};

export const uploadReviewImages = async (files: File[]): Promise<string[]> => {
  if (files.length === 0) return [];

  if (files.length > 2) {
    throw new Error("Maximum 2 images allowed per review");
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`File ${file.name} is not an image`);
    }
    if (file.size > 4 * 1024 * 1024) {
      throw new Error(`File ${file.name} exceeds 4MB limit`);
    }
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const adminUrl = getAdminBaseUrl();
  const res = await fetchWithAdminAuth(`${adminUrl}/api/reviews/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to upload review images");
  }

  return data.urls || [];
};

export const submitProductReview = async (
  input: SubmitReviewInput
): Promise<{ success: boolean; data: dbReview }> => {
  if (!input.productId) throw new Error("Product ID is required");
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    throw new Error("Please select a rating between 1 and 5 stars");
  }
  if (!input.comment || input.comment.trim().length < 3) {
    throw new Error("Review comment must be at least 3 characters");
  }
  if (input.comment.trim().length > 500) {
    throw new Error("Review comment cannot exceed 500 characters");
  }
  if (input.images && input.images.length > 2) {
    throw new Error("Maximum 2 images allowed");
  }

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

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || "Failed to submit review");
  }

  return result;
};

