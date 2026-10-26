"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Quote,
  ShieldCheck,
  PackageCheck,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/use-query";
import { getLatestReviews, ProductReviewsResponse } from "@/actions/review";
import { dbReview } from "@/types/type";
import { HeadingTitle } from "../heading-title";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useKeenSlider } from "keen-slider/react";
import { AutoplayPlugin } from "@/lib/keen-autoplay";
import { BsFillPatchCheckFill } from "react-icons/bs";

export const ClientReviewsSection = () => {
  const { data: reviewsResponse, isLoading } = useCustomQuery<ProductReviewsResponse>(
    ["latest-reviews"],
    () => getLatestReviews(1, 12)
  );

  const [isClient, setIsClient] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reviews = reviewsResponse?.data ?? [];
  const stats = reviewsResponse?.stats;
  const canLoop = reviews.length > 3;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      slides: {
        perView: 1.12,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 24 },
        },
      },
    },
    [AutoplayPlugin(5000, true)]
  );

  useEffect(() => {
    instanceRef.current?.update({
      loop: reviews.length > 3,
    });
  }, [reviews, instanceRef]);

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

  if (!isClient || isLoading) {
    return (
      <section className="py-6 lg:py-10 w-full">
        <HeadingTitle title="Customer Reviews" />
        <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
          <div className="keen-slider py-4 px-1 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="keen-slider__slide p-1 min-w-[85%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] max-w-[85%] sm:max-w-[calc(50%-12px)] lg:max-w-[calc(33.333%-16px)] flex-shrink-0"
              >
                <Card className="rounded-2xl p-6 border border-gray-100 bg-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                  <Skeleton className="h-16 w-full rounded" />
                  <div className="flex items-center gap-3 pt-2">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no reviews yet, don't show empty broken block
  if (reviews.length === 0) return null;

  const averageRating =
    stats?.averageRating && stats.averageRating > 0
      ? stats.averageRating.toFixed(1)
      : "5.0";
  const totalReviewsCount = stats?.totalReviews ?? reviews.length;

  return (
    <section className="py-6 lg:py-10 w-full relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header section matching other landing page sections */}
      <div className="text-center px-4 max-w-3xl mx-auto space-y-2">
        <HeadingTitle title="Customer Reviews" />

        {/* Trust metrics bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 pt-1 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-gray-100 shadow-2xs">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-foreground">{averageRating}</span>
            <span>Average Rating ({totalReviewsCount}+ Reviews)</span>
          </div>

        </div>
      </div>

      {/* Slider of Reviews */}
      <div className="relative mt-8 px-6 sm:px-10 lg:px-12">
        <div ref={sliderRef} className="keen-slider py-4 px-1">
          {reviews.map((review: dbReview) => {
            const reviewerName =
              review.userName || review.user?.name || "Verified Customer";
            const avatarSrc = review.userAvatar || review.user?.image;
            const product = review.product;

            return (
              <div
                key={review.id}
                className="keen-slider__slide p-1 flex flex-col h-full"
              >
                <Card className="h-full bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden group">
                  {/* Watermark Quote Icon */}
                  <Quote className="size-16 text-primary/5 absolute top-3 right-3 pointer-events-none group-hover:text-primary/10 transition-colors" />

                  <div className="space-y-4">
                    {/* Header: Stars & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`size-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/20"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-[11px] text-muted-foreground font-medium">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Review text */}
                    {review.comment ? (
                      <p className="text-sm text-foreground/85 leading-relaxed line-clamp-4 italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Great quality product, fast delivery and highly recommended!
                      </p>
                    )}

                    {/* Attached Review Photos (if customer uploaded) */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {review.images.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setPreviewImage(img)}
                            className="relative size-14 rounded-lg overflow-hidden border border-border group/img cursor-zoom-in hover:border-primary transition"
                            title="Click to view full image"
                          >
                            <Image
                              src={img}
                              alt="Customer review photo"
                              fill
                              className="object-cover group-hover/img:scale-110 transition-transform duration-200"
                            />
                          </button>
                        ))}
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Customer Photos
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom section: Reviewer profile and Product info */}
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                    {/* Customer Profile */}
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border border-border shadow-2xs">
                        <AvatarImage src={avatarSrc || undefined} alt={reviewerName} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {getInitials(reviewerName)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-semibold text-sm text-foreground truncate">
                            {reviewerName}
                          </h4>
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full">
                                          <BsFillPatchCheckFill className="size-4 fill-blue-500" />
                                        </span>
                        </div>
                      </div>
                    </div>

                    {/* Linked Product Pill (if present) */}
                    {product && product.name && (
                      <Link
                        href={product.productUrl ? `/products/${product.productUrl}` : "#"}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 hover:bg-muted/70 border border-gray-100 transition-colors group/prod"
                      >
                        {product.productImage ? (
                          <div className="relative size-8 rounded-md overflow-hidden bg-white shrink-0 border">
                            <Image
                              src={product.productImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            Purchased Product
                          </p>
                          <p className="text-xs font-semibold text-foreground truncate group-hover/prod:text-primary transition-colors">
                            {product.name}
                          </p>
                        </div>
                      </Link>
                    )}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        {reviews.length > 1 && (
          <>
            <button
              onClick={() => instanceRef.current?.prev()}
              className="absolute left-0 sm:left-1 lg:left-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2.5 bg-background/95 hover:bg-background transition border border-gray-200 cursor-pointer text-primary hover:scale-105 active:scale-95"
              aria-label="Previous review"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              onClick={() => instanceRef.current?.next()}
              className="absolute right-0 sm:right-1 lg:right-2 top-1/2 -translate-y-1/2 z-20 shadow-md hover:shadow-lg rounded-full p-2.5 bg-background/95 hover:bg-background transition border border-gray-200 cursor-pointer text-primary hover:scale-105 active:scale-95"
              aria-label="Next review"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Lightbox Modal for Customer Photo Preview */}
      <Dialog
        open={Boolean(previewImage)}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-2xl p-2 bg-black/90 border-none">
          {previewImage && (
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <Image
                src={previewImage}
                alt="Review Photo"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
