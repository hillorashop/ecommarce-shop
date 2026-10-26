"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquareQuote } from "lucide-react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { dbReview } from "@/types/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AutoplayPlugin } from "@/lib/keen-autoplay";

interface ProductReviewSnippetProps {
  reviews: dbReview[];
  totalReviews: number;
  onSeeAll: () => void;
}

export const ProductReviewSnippet: React.FC<ProductReviewSnippetProps> = ({
  reviews,
  totalReviews,
  onSeeAll,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const canLoop = reviews.length > 1;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: canLoop,
      initial: 0,
      slides: {
        perView: 1,
        spacing: 12,
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    canLoop ? [AutoplayPlugin(4500, true)] : []
  );

  useEffect(() => {
    instanceRef.current?.update();
  }, [reviews, instanceRef]);

  if (!reviews || reviews.length === 0) return null;

  const getInitials = (name?: string | null) => {
    if (!name) return "C";
    return name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2);
  };

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="w-full bg-amber-50/40 border border-amber-200/70 dark:bg-card dark:border-border rounded-xl p-3 sm:p-4 my-2.5 transition-all">
      {/* Top Header Row: Label on Left, "See all reviews" + Prev/Next Arrows on Right (Like Fiverr) */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/50 dark:border-border">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <MessageSquareQuote className="size-3.5 text-primary" />
          <span>Recent Buyer Reviews</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Link to show all reviews and open tab */}
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-0.5 cursor-pointer transition-colors"
          >
            <span>See all {totalReviews} reviews</span>
            <ChevronRight className="size-3.5" />
          </button>

          {/* Mini Prev/Next Slider Controls */}
          {reviews.length > 1 && (
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={() => instanceRef.current?.prev()}
                className="size-5 rounded-full flex items-center justify-center bg-white dark:bg-muted border border-border text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-2xs"
                aria-label="Previous review"
              >
                <ChevronLeft className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => instanceRef.current?.next()}
                className="size-5 rounded-full flex items-center justify-center bg-white dark:bg-muted border border-border text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-2xs"
                aria-label="Next review"
              >
                <ChevronRight className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Keen Slider Carousel of Recent Reviews */}
      <div ref={sliderRef} className="keen-slider pt-2.5">
        {reviews.map((review) => {
          const reviewerName =
            review.userName || review.user?.name || "Verified Buyer";
          const avatarSrc = review.userAvatar || review.user?.image;

          return (
            <div key={review.id} className="keen-slider__slide w-full">
              <div className="space-y-2">
                {/* User Info & Rating Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar className="size-7 border border-border/80 shrink-0">
                      <AvatarImage src={avatarSrc || undefined} alt={reviewerName} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                        {getInitials(reviewerName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {reviewerName}
                      </span>
                      <BsFillPatchCheckFill
                        className="size-3.5 fill-blue-500 shrink-0"
                        title="Verified Buyer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`size-3 ${
                            s <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs text-foreground/90 leading-relaxed italic line-clamp-2">
                  &ldquo;{review.comment || "Great product quality and fast delivery! Highly recommended."}&rdquo;
                </p>

                {/* Attached Photo Thumbnails (if any) */}
                {review.images && review.images.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={onSeeAll}
                        className="relative size-10 rounded border border-border overflow-hidden cursor-pointer hover:opacity-90 transition"
                      >
                        <Image
                          src={img}
                          alt="Review image preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Dots Indicator */}
      {reviews.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? "w-3.5 bg-primary" : "w-1.5 bg-muted-foreground/25"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
