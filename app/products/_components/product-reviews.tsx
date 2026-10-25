"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Upload, X, Loader2, CheckCircle2, Image as ImageIcon, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  onReviewsLoaded,
}) => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch reviews
  const { data: reviewsResponse, isLoading } = useQuery<ProductReviewsResponse>({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const data = await getProductReviews(productId);
      if (onReviewsLoaded && data?.stats) {
        onReviewsLoaded(data.stats.totalReviews, data.stats.averageRating);
      }
      return data;
    },
    staleTime: 60 * 1000,
  });

  const reviews = reviewsResponse?.data || [];
  const stats = reviewsResponse?.stats || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  // Image selection handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 2 - selectedFiles.length;
    if (remainingSlots <= 0) {
      toast.error("Maximum 2 photos allowed per review");
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files.slice(0, remainingSlots)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file.`);
        continue;
      }

      // Specification: Each image under 4MB
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 4MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
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
        userName: user?.name || "Customer",
        userAvatar: (user as any)?.image || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Thank you! Your review has been submitted.");
      setComment("");
      setRating(5);
      filePreviews.forEach((url) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setFilePreviews([]);
      setIsWritingReview(false);
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit review");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("Review comment must be at least 3 characters");
      return;
    }

    if (comment.trim().length > 500) {
      toast.error("Review comment cannot exceed 500 characters");
      return;
    }

    submitReviewMutation();
  };

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
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-card border rounded-xl p-6 shadow-sm">
        {/* Score & Stars */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6 text-center">
          <div className="text-5xl font-extrabold text-foreground tracking-tight">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0.0"}
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
            {isWritingReview ? "Cancel Review" : "Write a Review"}
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
                <h4 className="font-semibold text-lg">Only registered users can write a review</h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Please log in to your account to share your feedback and photos for this product.
                </p>
                <div className="pt-2">
                  <Button asChild>
                    <Link href={`/sign-in?callbackUrl=/products/${productId}`}>
                      Sign In to Review
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b pb-3">
                  <h4 className="font-semibold text-base">Write Your Review</h4>
                  <p className="text-xs text-muted-foreground">
                    Posting as <span className="font-medium text-foreground">{user.name || "Customer"}</span>
                  </p>
                </div>

                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your Rating *</label>
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
                        ? "5 Stars (Excellent)"
                        : rating === 4
                        ? "4 Stars (Good)"
                        : rating === 3
                        ? "3 Stars (Average)"
                        : rating === 2
                        ? "2 Stars (Poor)"
                        : "1 Star (Terrible)"}
                    </span>
                  </div>
                </div>

                {/* Comment with standard length validation */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="review-comment" className="text-sm font-medium">
                      Review Comment *
                    </label>
                    <span
                      className={`text-xs ${
                        comment.length > 500
                          ? "text-destructive font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      {comment.length} / 500 characters
                    </span>
                  </div>
                  <Textarea
                    id="review-comment"
                    placeholder="Share what you like or dislike about this product (min 3, max 500 characters)..."
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
                      Attach Photos (Optional, max 2 images, under 4MB each)
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {selectedFiles.length} / 2 photos
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
                          alt={`Upload preview ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(idx)}
                          className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors"
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
                        <span className="text-[10px] font-medium">Add Photo</span>
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
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || comment.trim().length < 3 || comment.trim().length > 500}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground">
          Customer Reviews ({stats.totalReviews})
        </h3>

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
                Have you tried this product? Be the first to share your experience with other shoppers.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWritingReview(true)}
                className="mt-2"
              >
                Write the First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
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
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="size-3" />
                            Verified Purchase
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
                          onClick={() => setPreviewModalImage(img)}
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
        )}
      </div>

      {/* Lightbox Modal for Full Image View */}
      <Dialog
        open={Boolean(previewModalImage)}
        onOpenChange={(open) => !open && setPreviewModalImage(null)}
      >
        <DialogContent className="max-w-2xl p-2 bg-black/90 border-none">
          {previewModalImage && (
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <Image
                src={previewModalImage}
                alt="Review photo full"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
