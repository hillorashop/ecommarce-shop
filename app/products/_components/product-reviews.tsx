"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Upload, X, Loader2, MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  reviewsResponse?: ProductReviewsResponse;
  isLoading?: boolean;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  onReviewsLoaded,
  reviewsResponse: externalReviewsResponse,
  isLoading: externalIsLoading,
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

  // Fetch reviews (fallback if not provided from parent)
  const { data: internalReviewsResponse, isLoading: internalIsLoading } = useQuery<ProductReviewsResponse>({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const data = await getProductReviews(productId);
      return data;
    },
    enabled: !externalReviewsResponse,
    staleTime: 60 * 1000,
  });

  const reviewsResponse = externalReviewsResponse ?? internalReviewsResponse;
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

  React.useEffect(() => {
    if (onReviewsLoaded && reviewsResponse?.stats) {
      onReviewsLoaded(reviewsResponse.stats.totalReviews, reviewsResponse.stats.averageRating);
    }
  }, [reviewsResponse, onReviewsLoaded]);

  const reviews = reviewsResponse?.data || [];
  const stats = reviewsResponse?.stats || {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
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

  // Format date in Bangla
  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "ক";
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2);
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
            মোট {stats.totalReviews} টি রিভিউ এর ভিত্তিতে
          </p>

          <Button
            onClick={() => setIsWritingReview((prev) => !prev)}
            variant={isWritingReview ? "secondary" : "default"}
            className="mt-4 w-full max-w-[200px]"
          >
            {isWritingReview ? "বাতিল করুন" : "রিভিউ লিখুন"}
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
                  <span>{starBanglaNumbers[star]}</span>
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
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-foreground">
          ক্রেতাদের রিভিউ ({stats.totalReviews})
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
              <h4 className="font-medium text-base">এখনো কোনো রিভিউ নেই</h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                আপনি কি এই পণ্যটি ব্যবহার করেছেন? সবার আগে আপনার মূল্যবান মতামত শেয়ার করুন।
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWritingReview(true)}
                className="mt-2"
              >
                প্রথম রিভিউটি লিখুন
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
                            {review.userName || review.user?.name || "সম্মানিত ক্রেতা"}
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
                          onClick={() => setPreviewModalImage(img)}
                          className="relative size-16 sm:size-20 rounded-md overflow-hidden border border-border group cursor-zoom-in"
                        >
                          <Image
                            src={img}
                            alt={`কাস্টমার ছবি ${idx + 1}`}
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
                alt="রিভিউ ছবি"
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
