"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star,
  Upload,
  X,
  Loader2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { useUser } from "@/contexts/UserContext";
import {
  getProductReviews,
  submitProductReview,
  uploadReviewImages,
  ProductReviewsResponse,
} from "@/actions/review";
import { dbReview } from "@/types/type";

interface ProductReviewsProps {
  productId: string;
  onReviewsLoaded?: (count: number, averageRating: number) => void;
  reviewsResponse?: ProductReviewsResponse;
  isLoading?: boolean;
  limit?: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  onReviewsLoaded,
  reviewsResponse: externalReviewsResponse,
  isLoading: externalIsLoading,
  limit: externalLimit,
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsListRef = useRef<HTMLDivElement>(null);
  const limit = externalLimit || 6;

  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const openLightbox = (clickedImg: string, reviewImgs?: string[]) => {
    const allImages = reviews
      .flatMap((r) => r.images || [])
      .filter((img): img is string => Boolean(img && img.trim() !== ""));

    const targetImages =
      allImages.length > 0
        ? allImages
        : reviewImgs && reviewImgs.length > 0
        ? reviewImgs
        : [clickedImg];

    const foundIdx = targetImages.indexOf(clickedImg);
    setLightboxImages(targetImages);
    setLightboxIndex(foundIdx !== -1 ? foundIdx : 0);
    setLightboxOpen(true);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length <= 1) return;
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxImages.length <= 1) return;
    setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : lightboxImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev < lightboxImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch paginated reviews for the current page
  const {
    data: pageReviewsResponse,
    isLoading: isPageLoading,
    isFetching,
  } = useQuery<ProductReviewsResponse>({
    queryKey: ["product-reviews", productId, currentPage, limit],
    queryFn: async () => {
      if (!productId) return undefined as any;
      return await getProductReviews(productId, currentPage, limit);
    },
    enabled: !!productId,
    initialData:
      currentPage === 1 && externalReviewsResponse
        ? externalReviewsResponse
        : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });

  const reviewsResponse = pageReviewsResponse ?? externalReviewsResponse;
  const isLoading =
    currentPage === 1 && externalReviewsResponse
      ? false
      : isPageLoading && !reviewsResponse;

  React.useEffect(() => {
    if (onReviewsLoaded && reviewsResponse?.stats) {
      onReviewsLoaded(
        reviewsResponse.stats.totalReviews,
        reviewsResponse.stats.averageRating
      );
    }
  }, [reviewsResponse, onReviewsLoaded]);

  const reviews = reviewsResponse?.data || [];
  const stats = reviewsResponse?.stats || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const pagination = reviewsResponse?.pagination;
  const totalReviews =
    pagination?.total ?? stats.totalReviews ?? reviews.length;
  const totalPages =
    pagination?.totalPages ?? Math.max(1, Math.ceil(totalReviews / limit));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (reviewsListRef.current) {
      reviewsListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  // Image selection handler with Bangla validations
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 2 - selectedFiles.length;
    if (remainingSlots <= 0) {
      toast.error("প্রতি রিভিউতে সর্বোচ্চ ২টি ছবি দেওয়া যাবে");
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" কোনো ইমেজ ফাইল নয়।`);
        continue;
      }

      // Specification: Each image under 4MB
      if (file.size > 4 * 1024 * 1024) {
        toast.error(
          `"${file.name}" ৪MB সাইজ সীমা অতিক্রম করেছে (${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)}MB)।`
        );
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Mutation for submitting review
  const { mutate: submitReviewMutation, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedUrls = await uploadReviewImages(selectedFiles);
      }

      return await submitProductReview({
        productId,
        rating,
        comment: comment.trim(),
        images: uploadedUrls,
        userId: user?.id,
        userName: user?.name || "ক্রেতা",
        userAvatar: (user as any)?.image || undefined,
      });
    },
    onSuccess: () => {
      toast.success("ধন্যবাদ! আপনার রিভিউ সফলভাবে জমা দেওয়া হয়েছে।");
      setComment("");
      setRating(5);
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setFilePreviews([]);
      setIsWritingReview(false);
      setCurrentPage(1);
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "রিভিউ জমা দিতে ব্যর্থ হয়েছে");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error("রিভিউ লিখতে অনুগ্রহ করে লগইন করুন");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("রিভিউ কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    if (comment.trim().length > 500) {
      toast.error("রিভিউ সর্বোচ্চ ৫০০ অক্ষরের বেশি হতে পারবে না");
      return;
    }

    submitReviewMutation();
  };

  // Format date in English
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "C";
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const starBanglaNumbers: Record<number, string> = {
    5: "৫",
    4: "৪",
    3: "৩",
    2: "২",
    1: "১",
  };

  return (
    <div className="space-y-8">
      {/* Overview & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-card border rounded-xl p-6 shadow-sm">
        {/* Score & Stars */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 text-center">
          <div className="text-5xl font-extrabold text-foreground tracking-tight">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "০.০"}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 ${
                  star <= Math.round(stats.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Based on {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"}
          </p>

          <Button
            onClick={() => setIsWritingReview((prev) => !prev)}
            variant={isWritingReview ? "secondary" : "default"}
            className="mt-4 w-full max-w-[200px]"
          >
            {isWritingReview ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingDistribution[star] || 0;
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-12 text-muted-foreground font-medium">
                  <span>{star}</span>
                  <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write a Review Section */}
      {isWritingReview && (
        <Card className="border-primary/20 shadow-sm animate-in fade-in-50 duration-200">
          <CardContent className="p-6">
            {!user || !user.id ? (
              <div className="text-center py-6 space-y-3">
                <MessageSquare className="size-10 mx-auto text-muted-foreground" />
                <h4 className="font-semibold text-lg">শুধুমাত্র নিবন্ধিত ব্যবহারকারীরা রিভিউ দিতে পারবেন</h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  এই পণ্যটি সম্পর্কে আপনার মতামত ও ছবি শেয়ার করতে অনুগ্রহ করে আপনার অ্যাকাউন্টে লগইন করুন।
                </p>
                <div className="pt-2">
                  <Button asChild>
                    <Link href={`/sign-up`}>
                      রিভিউ দিতে লগইন করুন
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b pb-3">
                  <h4 className="font-semibold text-base">আপনার রিভিউ লিখুন</h4>
                  <p className="text-xs text-muted-foreground">
                    পোস্ট করছেন: <span className="font-medium text-foreground">{user.name || "সম্মানিত ক্রেতা"}</span>
                  </p>
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">আপনার রেটিং *</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 focus:outline-none transition-transform hover:scale-115"
                      >
                        <Star
                          className={`size-7 ${
                            s <= (hoverRating ?? rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-semibold text-muted-foreground">
                      {rating === 5
                        ? "৫ স্টার (অসাধারণ)"
                        : rating === 4
                        ? "৪ স্টার (ভালো)"
                        : rating === 3
                        ? "৩ স্টার (মোটামুটি)"
                        : rating === 2
                        ? "২ স্টার (খারাপ)"
                        : "১ স্টার (খুবই খারাপ)"}
                    </span>
                  </div>
                </div>

                {/* Comment with standard length validation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="review-comment" className="text-sm font-medium">
                      আপনার মতামত / রিভিউ *
                    </label>
                    <span
                      className={`text-xs ${
                        comment.length > 500
                          ? "text-destructive font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {comment.length} / ৫০০ অক্ষর
                    </span>
                  </div>
                  <Textarea
                    id="review-comment"
                    placeholder="পণ্যটি সম্পর্কে আপনার ভালো বা খারাপ অভিজ্ঞতা শেয়ার করুন (কমপক্ষে ৩ ও সর্বোচ্চ ৫০০ অক্ষর)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                    required
                  />
                </div>

                {/* Photos upload (max 2, < 4MB each) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">
                      ছবি যুক্ত করুন (ঐচ্ছিক, সর্বোচ্চ ২টি ছবি, প্রতিটি ৪MB এর নিচে)
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {selectedFiles.length} / ২ টি ছবি
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    {filePreviews.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative size-20 rounded-md overflow-hidden border border-border group"
                      >
                        <Image
                          src={preview}
                          alt={`ছবি প্রিভিউ ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors"
                          title="ছবি মুছুন"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}

                    {selectedFiles.length < 2 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="size-20 border-2 border-dashed border-muted-foreground/30 rounded-md flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
                      >
                        <Upload className="size-5 mb-1" />
                        <span className="text-[10px] font-medium">ছবি যোগ করুন</span>
                      </button>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => setIsWritingReview(false)}
                  >
                    বাতিল
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || comment.trim().length < 3 || comment.trim().length > 500}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> জমা হচ্ছে...
                      </>
                    ) : (
                      "রিভিউ জমা দিন"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div ref={reviewsListRef} className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground">
            Customer Reviews ({stats.totalReviews})
          </h3>
          {isFetching && (
            <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium animate-pulse">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating...</span>
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted/60 h-28 rounded-lg" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-3">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Star className="size-6 fill-primary" />
              </div>
              <h4 className="font-medium text-base">No reviews yet</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Have you used this product? Be the first to share your experience.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWritingReview(true)}
                className="mt-2"
              >
                Write the first review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div
              className={`space-y-4 transition-opacity duration-200 ${
                isFetching ? "opacity-70 pointer-events-none" : "opacity-100"
              }`}
            >
              {reviews.map((review: dbReview) => (
                <Card key={review.id} className="border shadow-none hover:border-primary/20 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    {/* Review Header: User info, stars, date */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border">
                          <AvatarImage src={review.userAvatar || review.user?.image || undefined} />
                          <AvatarFallback className="text-xs bg-muted text-foreground font-semibold">
                            {getInitials(review.userName || review.user?.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {review.userName || review.user?.name || "Customer"}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full">
                              <BsFillPatchCheckFill className="size-4 fill-blue-500" />
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`size-3.5 ${
                                  star <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-muted-foreground sm:text-right">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Review Text */}
                    {review.comment && (
                      <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                        {review.comment}
                      </p>
                    )}

                    {/* Attached Customer Photos (Max 2) */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex items-center gap-2.5 pt-1">
                        {review.images.map((img, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => openLightbox(img, review.images)}
                            className="relative size-16 sm:size-20 rounded-md overflow-hidden border border-border group cursor-zoom-in"
                          >
                            <Image
                              src={img}
                              alt={`Customer photo ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls with Next & Previous Icons */}
            {totalReviews > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-border">
                {/* Page Status Indicator */}
                <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1 flex items-center gap-2">
                  <span>
                    Page <strong className="text-foreground font-semibold">{currentPage}</strong> of <strong className="text-foreground font-semibold">{totalPages}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                  </span>
                </div>

                {/* Navigation Buttons with Icons Only */}
                <div className="flex items-center gap-1.5 order-1 sm:order-2 flex-wrap justify-center">
                  {totalPages > 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage <= 1 || isFetching}
                      className="size-8 cursor-pointer shadow-2xs"
                      title="First Page"
                      aria-label="First Page"
                    >
                      <ChevronsLeft className="size-4" />
                    </Button>
                  )}

                  {/* Previous Page Button - Only Icon */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isFetching}
                    className="size-8 cursor-pointer shadow-2xs hover:bg-muted"
                    title="Previous"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((p, idx) => {
                      if (p === "...") {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1 text-xs text-muted-foreground select-none"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = p as number;
                      const isActive = pageNum === currentPage;
                      return (
                        <Button
                          key={pageNum}
                          type="button"
                          variant={isActive ? "default" : "outline"}
                          size="icon-sm"
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isFetching}
                          className={`size-8 text-xs font-semibold cursor-pointer shadow-2xs transition-all ${
                            isActive
                              ? "bg-primary text-white hover:bg-primary/90"
                              : "hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Next Page Button - Only Icon */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isFetching}
                    className="size-8 cursor-pointer shadow-2xs hover:bg-muted"
                    title="Next"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="size-4" />
                  </Button>

                  {totalPages > 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage >= totalPages || isFetching}
                      className="size-8 cursor-pointer shadow-2xs"
                      title="Last Page"
                      aria-label="Last Page"
                    >
                      <ChevronsRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Image View */}
      <Dialog
        open={lightboxOpen}
        onOpenChange={(open) => !open && setLightboxOpen(false)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-auto max-w-fit max-h-[90vh] p-0 gap-0 bg-transparent border-none shadow-none rounded-none overflow-visible focus:outline-none focus-visible:outline-none flex flex-col items-center justify-center"
        >
          <DialogTitle className="sr-only">Customer review photo preview</DialogTitle>

          {lightboxImages.length > 0 && (
            <div className="relative inline-block max-w-[90vw] md:max-w-[80vw] max-h-[85vh] select-none rounded-lg overflow-visible">
              {/* Image with natural aspect ratio constrained by viewport */}
              <img
                src={lightboxImages[lightboxIndex]}
                alt={`Customer photo ${lightboxIndex + 1}`}
                className="max-h-[82vh] max-w-[90vw] md:max-w-[80vw] w-auto h-auto object-contain rounded-lg shadow-2xl block select-none"
              />

              {/* Close Button - Placed directly at the top-right corner of the image */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-50 size-9 sm:size-10 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                aria-label="Close image preview"
                title="Close"
              >
                <X className="size-5 text-white stroke-[2.5]" />
              </button>

              {/* Previous Image Slide Button - Placed at the left of the image */}
              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Previous image"
                  title="Previous image"
                >
                  <ChevronLeft className="size-6 text-white stroke-[2.5]" />
                </button>
              )}

              {/* Next Image Slide Button - Placed at the right of the image */}
              {lightboxImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-50 size-10 sm:size-11 flex items-center justify-center rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Next image"
                  title="Next image"
                >
                  <ChevronRight className="size-6 text-white stroke-[2.5]" />
                </button>
              )}

              {/* Image Counter & Indicators - Centered at the bottom of the image */}
              {lightboxImages.length > 1 && (
                <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/20 backdrop-blur-md shadow-lg">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {lightboxIndex + 1} / {lightboxImages.length}
                  </span>
                  {lightboxImages.length <= 8 && (
                    <div className="flex items-center gap-1.5 ml-1">
                      {lightboxImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLightboxIndex(idx)}
                          className={`size-2 rounded-full transition-all cursor-pointer ${
                            idx === lightboxIndex
                              ? "bg-white w-4"
                              : "bg-white/40 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
