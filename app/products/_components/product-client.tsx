"use client";

import { useCart } from "@/hooks/use-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, PlayCircle, MinusIcon, PlusIcon, ShoppingCart, Star, Volume2, VolumeX, CheckCircle2, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";
import RelatedProducts from "../_components/relatedProducts";
import { ProductReviews } from "./product-reviews";
import { ProductReviewSnippet } from "./product-review-snippet";
import { useQuery } from "@tanstack/react-query";
import { getProductReviews, ProductReviewsResponse } from "@/actions/review";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ONE_DAY, siteMeta } from "@/data";
import { useCustomQuery } from "@/hooks/use-query";
import { dbProductwihtoutAll, getProduct, getProducts, ProductResponse, ProductsResponse } from "@/actions/product";
import { getBusinessInfo, BusinessResponse } from "@/actions/business-info";
import { pushToDataLayer } from "@/lib/gtm";
import { trackEcommerceEvent } from "@/lib/custom-tm";
import { hasFiredEvent, markEventFired } from "@/lib/event-dedupe";

interface Props {
  productUrl: string;
  fbclid?: string | null;
}

export const ProductClient = ({ productUrl, fbclid }: Props) => {
  const { cartItems, addItem } = useCart();
  const { data: products, isLoading: productLoading } = useCustomQuery<ProductsResponse>(
    ["products", 1],
    () => getProducts(1)
  );
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const router = useRouter();
  const { data: businessInfo } = useCustomQuery<BusinessResponse>(
    ["business-info"],
    () => getBusinessInfo()
  );

  const { data: product, isLoading } = useCustomQuery<ProductResponse>(
    ["product", productUrl],
    () => getProduct(productUrl),
    {
      staleTime:  60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const productId = product?.data?.id;

  // Fetch reviews immediately when component renders and productId is available
  const { data: reviewsResponse, isLoading: reviewsLoading } = useQuery<ProductReviewsResponse>({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      if (!productId) return undefined as any;
      return await getProductReviews(productId);
    },
    enabled: !!productId,
    staleTime: 60 * 1000,
  });

  const reviewCount = reviewsResponse?.stats?.totalReviews ?? 0;
  const averageRating = reviewsResponse?.stats?.averageRating ?? 0;

  const kgEntries = product?.data?.kgUnit && typeof product.data.kgUnit === "object"
    ? Object.entries(product.data.kgUnit as Record<string, { price: number; discountPrice: number }>)
    : [];
  const gramEntries = product?.data?.gramUnit && typeof product.data.gramUnit === "object"
    ? Object.entries(product.data.gramUnit as Record<string, { price: number; discountPrice: number }>)
    : [];
  const piecesEntries = product?.data?.piecesUnit && typeof product.data.piecesUnit === "object"
    ? Object.entries(product.data.piecesUnit as Record<string, { price: number; discountPrice: number }>)
    : [];

  const unitData = kgEntries.length > 0
    ? { entries: kgEntries, label: "kg" }
    : gramEntries.length > 0
    ? { entries: gramEntries, label: "g" }
    : piecesEntries.length > 0
    ? { entries: piecesEntries, label: "pcs" }
    : null;

  const hasUnits = unitData !== null;

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("description");

  const handleOpenReviewsTab = () => {
    setActiveTab("reviews");
    const el = document.getElementById("product-tabs-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

useEffect(() => {
  if (hasUnits && unitData?.entries[0][0]) {
    setSelectedKey(unitData.entries[0][0]);
  }
}, [product]);

  const selectedUnitEntry = hasUnits && selectedKey
    ? unitData!.entries.find(([k]) => k === selectedKey)?.[1] ?? null
    : null;

  const activePrice = selectedUnitEntry?.price ?? product?.data?.price ?? 0;
  const activeDiscountPrice = selectedUnitEntry?.discountPrice ?? product?.data?.discountPrice;

  const hasDiscount =
    activeDiscountPrice !== undefined &&
    activeDiscountPrice !== null &&
    activeDiscountPrice > 0 &&
    activeDiscountPrice < activePrice;

  const displayPrice = hasDiscount ? activeDiscountPrice! : activePrice;
  const savingsAmount = hasDiscount ? activePrice - activeDiscountPrice! : 0;
  const discountPercentage = hasDiscount
    ? Math.round((savingsAmount / activePrice) * 100)
    : null;

  const variantLabel = hasUnits && selectedKey ? `${selectedKey}${unitData!.label}` : "default";

  const mergedMedia = useMemo(() => {
    if (!product) return [];
    const gallery = (product.data.gallery || []).filter((g): g is string => Boolean(g && g.trim() !== ""));
    const pImg = product.data.productImage?.trim();
    const list = pImg ? [pImg, ...gallery.filter((g) => g !== pImg)] : gallery;
    return list.length > 0 ? list : ["/fevicon.png"];
  }, [product]);

useEffect(() => {
  if (!product) return;
  const key = `view_item:${product.data.id}`;
  if (hasFiredEvent(key)) return;
  markEventFired(key);

  const ecommerce = {
    currency: "BDT",
    value: displayPrice,
    affiliation: siteMeta?.siteName || "Online Store",
    items: [
      {
        item_id: product.data.id,
        item_name: product.data.name,
        price: displayPrice,
        discount: savingsAmount,
        item_brand: siteMeta?.siteName || "Online Store",
        item_category: product.data.category?.name || "Uncategorized",
        quantity: 1,
      },
    ],
  };

  pushToDataLayer("view_item", ecommerce);
  trackEcommerceEvent("view_item", ecommerce);
}, [product, displayPrice, savingsAmount]);

const handleAddToCart = (product: dbProductwihtoutAll) => {
  const ecommerce = {
    currency: "BDT",
    value: displayPrice,
    affiliation: siteMeta?.siteName || "Online Store",
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: displayPrice,
        discount: savingsAmount,
        item_brand: siteMeta?.siteName || "Online Store",
        item_variant: variantLabel,
        quantity,
      },
    ],
  };

  pushToDataLayer("add_to_cart", ecommerce);
  trackEcommerceEvent("add_to_cart", ecommerce);

  addItem(
    { ...product, price: activePrice, discountPrice: activeDiscountPrice },
    quantity,
    selectedKey,
    unitData?.label ?? null
  );
};
const handleBuyNow = (product: dbProductwihtoutAll) => {
  const discountAmount = hasDiscount ? activePrice - activeDiscountPrice! : 0;

  const ecommerce = {
    currency: "BDT",
    value: displayPrice,
    affiliation: siteMeta?.siteName || "Online Store",
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: displayPrice,
        discount: discountAmount,
        item_brand: siteMeta?.siteName || "Online Store",
        item_variant: variantLabel,
        quantity,
      },
    ],
  };

  pushToDataLayer("begin_checkout", ecommerce);
  trackEcommerceEvent("begin_checkout", ecommerce);

  router.push(`/checkout?productId=${product.id}&qty=${quantity}${selectedKey ? `&unit=${variantLabel}` : ""}`);
};
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  if (isLoading || productLoading) {
    return (
      <div className="p-6 px-8 max-w-7xl w-full mx-auto space-y-8">
        <Skeleton className="h-6 w-40 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-xl" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-52" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className="text-center py-10">Product not found.</p>;

  const relatedProducts = products?.data?.filter((p) => p.productId !== product.data.productId).slice(0, 5);

const cartKey = selectedKey
  ? `${product.data.id}-${variantLabel}`
  : product.data.id;

const isInCart = cartItems.some((item) => item.cartKey === cartKey);

  const isAddDisabled = product.data.inStocks <= 0 || isInCart || (hasUnits && !selectedKey);
  const isBuyDisabled = product.data.inStocks <= 0 || (hasUnits && !selectedKey);

  const addToCartLabel = product.data.inStocks <= 0
    ? "Out of Stock"
    : hasUnits && !selectedKey
    ? "Select a size"
    : isInCart
    ? "Already in Cart"
    : "Add to Cart";

  return (
    <>
      {/* Breadcrumb & Meta Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/50" />
          {product.data.category ? (
            <>
              <Link
                href={`/categories/${product.data.category.categoryUrl || product.data.category.id}`}
                className="hover:text-primary transition-colors capitalize font-medium text-foreground"
              >
                {product.data.category.name}
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/50" />
            </>
          ) : null}
          <span className="truncate max-w-[200px] sm:max-w-xs">{product.data.name}</span>
        </div>

        <Badge variant="outline" className="text-[11px] font-mono tracking-tight text-muted-foreground bg-muted/40">
          SKU: {product.data.productId}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 mb-4 lg:mb-12">
<div className="w-full flex items-start gap-2 md:gap-3">

  
  <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto flex-shrink-0 max-h-full">
    {mergedMedia.map((mediaUrl, index) => {
      const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
      return (
        <div
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`cursor-pointer flex-shrink-0 border transition relative aspect-square w-12 md:w-20 ${
            currentIndex === index
              ? "border-primary shadow-md"
              : "border-gray-200 hover:border-primary/50"
          }`}
        >
          {isVideo ? (
            <div className="relative w-full h-full">
              <video src={mediaUrl} muted className="w-full h-full object-cover" />
              <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-6 h-6 md:w-8 md:h-8 pointer-events-none" />
            </div>
          ) : (
            <Image
              src={mediaUrl}
              alt={product.data.name || ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
        </div>
      );
    })}
  </div>


  <div className="relative flex-1 min-w-0 self-start aspect-square overflow-hidden">
    {mergedMedia.map((mediaUrl, index) => {
      if (index !== currentIndex) return null;
      const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
      return (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {isVideo ? (
            <div className="w-full h-full relative">
              <video
                ref={currentIndex === index ? videoRef : null}
                src={mediaUrl}
                autoPlay={currentIndex === index}
                muted={muted}
                loop
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="w-full h-full object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>
          ) : (
            <Image
              src={mediaUrl}
              alt={product.data.name || ""}
              width={800}
              height={800}
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority={index === 0}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      );
    })}
  </div>
</div>

        <div className="space-y-4 lg:space-y-5">
          {/* Category Pill & Stock / Delivery Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {product.data.category?.name && (
              <Link
                href={`/categories/${product.data.category.categoryUrl || product.data.category.id}`}
                className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-md transition-colors"
              >
                {product.data.category.name}
              </Link>
            )}

            {product.data.freeDelivery && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-md">
                <Truck className="size-3.5" />
                Free Delivery
              </span>
            )}

            {product.data.inStocks > 0 ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({product.data.inStocks})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
            {product.data.name}
          </h1>

          {/* Rating Summary */}
          {reviewCount > 0 && (
            <div
              className="inline-flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity py-0.5"
              onClick={handleOpenReviewsTab}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`size-4 ${
                      s <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">
                {averageRating > 0 ? averageRating.toFixed(1) : ""}
              </span>
              <span className="text-sm text-muted-foreground hover:underline">
                ({reviewCount} customer {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}

          {/* Fiverr-Style Review Snippet Slider */}
          {reviewCount > 0 && reviewsResponse?.data && reviewsResponse.data.length > 0 && (
            <ProductReviewSnippet
              reviews={reviewsResponse.data.slice(0, 4)}
              totalReviews={reviewCount}
              onSeeAll={handleOpenReviewsTab}
            />
          )}

          {/* Price Box */}
          <div className="p-3.5 bg-muted/40 rounded-xl border border-border/60 space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                BDT {displayPrice?.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="line-through text-muted-foreground text-base sm:text-lg">
                  BDT {activePrice.toLocaleString()}
                </span>
              )}
              {discountPercentage && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 font-bold shadow-xs">
                  -{discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {hasDiscount && (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  You save BDT {savingsAmount.toLocaleString()} ({discountPercentage}%)
                </span>
              </div>
            )}
          </div>

          {/* Variant / Unit Selector */}
          {hasUnits && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Option: <span className="text-foreground capitalize">{selectedKey} {unitData!.label}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {unitData!.entries.map(([key]) => {
                  const isSelected = selectedKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={`text-sm px-3.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-xs ring-2 ring-primary/20"
                          : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      {key} {unitData!.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Quantity
            </label>
            <div className="inline-flex items-center border border-border rounded-lg bg-background shadow-2xs overflow-hidden">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                className="size-9 rounded-none hover:bg-muted text-foreground cursor-pointer"
                disabled={quantity <= 1}
              >
                <MinusIcon className="size-3.5" />
              </Button>
              <span className="w-12 text-center text-sm font-bold text-foreground">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
                className="size-9 rounded-none hover:bg-muted text-foreground cursor-pointer"
              >
                <PlusIcon className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddToCart(product.data)}
              disabled={isAddDisabled}
              className="h-11 font-semibold text-sm border-primary/50 text-foreground hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {addToCartLabel}
            </Button>
            <Button
              type="button"
              disabled={isBuyDisabled}
              onClick={() => handleBuyNow(product.data)}
              className="h-11 font-semibold text-sm bg-primary text-white hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order Now
            </Button>
          </div>

          {/* Direct Support Chat Buttons: WhatsApp & Messenger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => window.open(`https://wa.me/+88${businessInfo?.data?.whatsappNumber}?text=${encodeURIComponent("হ্যালো, আমি এই পণ্যটি অর্ডার করতে চাই: " + product.data.name)}`, "_blank")}
              className="flex items-center justify-center gap-2 text-xs font-semibold bg-[#25D366] hover:bg-[#20ba5a] text-white h-10 px-4 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Image src="/icons/whatsapp.svg" alt="Whatsapp" height={18} width={18} className="object-contain" />
              Chat on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => window.open(`https://m.me/${businessInfo?.data?.messengerUsername}?ref=order_now`, "_blank")}
              className="flex items-center justify-center gap-2 text-xs font-semibold bg-[#0084FF] hover:bg-[#0074e0] text-white h-10 px-4 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Image src="/icons/messenger.svg.webp" alt="Messenger" height={18} width={18} className="object-contain" />
              Chat on Messenger
            </button>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.data.subDescription}</p>
        </div>
      </div>

      <Tabs
        id="product-tabs-section"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full scroll-mt-24"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md gap-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">All Reviews ({reviewCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="border-primary">
            <CardContent className="p-6">
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.data.description || "" }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews
            productId={product.data.id}
            reviewsResponse={reviewsResponse}
            isLoading={reviewsLoading}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <RelatedProducts products={relatedProducts || []} />
      </div>
    </>
  );
};