"use client";

import { useCart } from "@/hooks/use-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquareMore, MinusIcon, PlusIcon, Star, Volume2, VolumeX } from "lucide-react";
import RelatedProducts from "../_components/relatedProducts";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ONE_DAY, siteMeta } from "@/data";
import { useCustomQuery } from "@/hooks/use-custom-query";
import { dbProductwihtoutAll, getProduct, ProductResponse } from "@/actions/product";
import { pushToDataLayer } from "@/lib/gtm";
import { FaRegPlayCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface Props {
  productUrl: string;
  fbclid?: string | null;
}

export const ProductClient = ({ productUrl, fbclid }: Props) => {
  const { cartItems, addItem } = useCart();
  const { data: products, isLoading: productLoading } = useProducts({ page: 1 });
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState<boolean>(true);
  const viewItemFired = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ttclid = searchParams.get("ttclid");
    if (!ttclid) return;
    if (document.cookie.includes("ttclid=")) return;
    document.cookie = `ttclid=${ttclid}; path=/; max-age=2592000; SameSite=Lax`;
  }, [searchParams]);

  useEffect(() => {
    if (!fbclid) return;
    if (document.cookie.includes("fbclid=")) return;
    document.cookie = `fbclid=${fbclid}; path=/; max-age=2592000; SameSite=Lax`;
  }, [fbclid]);

  const { data: product, isLoading } = useCustomQuery<ProductResponse>(
    ["product", productUrl],
    () => getProduct(productUrl),
    {
      staleTime: ONE_DAY,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

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

const [selectedKey, setSelectedKey] = useState<string | null>(null)

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
    const gallery = product.data.gallery || [];
    return product.data.productImage
      ? [product.data.productImage, ...gallery.filter((g) => g !== product.data.productImage)]
      : gallery;
  }, [product]);

  useEffect(() => {
    if (!product || viewItemFired.current) return;
    viewItemFired.current = true;
    pushToDataLayer("view_item", {
      currency: "BDT",
      value: displayPrice,
      items: [
        {
          item_id: product.data.id,
          item_name: product.data.name,
          price: displayPrice,
          discount: savingsAmount,
          item_brand: siteMeta.siteName,
          item_category: product.data.category?.name || "Uncategorized",
          quantity: 1,
        },
      ],
    });
  }, [product, displayPrice, savingsAmount]);

  const handleAddToCart = (product: dbProductwihtoutAll) => {

    pushToDataLayer("add_to_cart", {
      currency: "BDT",
      value: displayPrice,
      items: [{
        item_id: product.id,
        item_name: product.name,
        affiliation: siteMeta.siteName,
        price: displayPrice,
        discount: savingsAmount,
        item_brand: siteMeta.siteName,
        item_variant: variantLabel,
        quantity,
      }],
    });
    addItem(
      { ...product, price: activePrice, discountPrice: activeDiscountPrice },
      quantity,
      selectedKey,
      unitData?.label ?? null
    );
  };

  const handleBuyNow = (product: dbProductwihtoutAll) => {
    const discountAmount = hasDiscount ? activePrice - activeDiscountPrice! : 0;
    pushToDataLayer("begin_checkout", {
      currency: "BDT",
      value: displayPrice,
      items: [{
        item_id: product.id,
        item_name: product.name,
        affiliation: siteMeta.siteName,
        discount: discountAmount,
        item_brand: siteMeta.siteName,
        item_variant: variantLabel,
        price: displayPrice,
      }],
    });
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

const isInCart = cartItems.some((item) => item.id === cartKey);

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
      <div className="mb-6">
        <Badge variant="secondary" className="text-xs px-3 py-1">
          Product ID: {product.data.productId}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="w-full">
          <div className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
            {mergedMedia.map((mediaUrl, index) => {
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
                      alt={product.data.name}
                      width={800}
                      height={800}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto flex-wrap">
            {mergedMedia.map((mediaUrl, index) => {
              const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
              return (
                <div
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`cursor-pointer flex-shrink-0 border transition relative h-14 md:h-24 aspect-square ${
                    currentIndex === index
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-primary/50"
                  }`}
                >
                  {isVideo ? (
                    <div className="relative h-24 md:h-24 aspect-square">
                      <video src={mediaUrl} muted className="w-full h-full object-cover" />
                      <FaRegPlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-2xl pointer-events-none" />
                    </div>
                  ) : (
                    <Image src={mediaUrl} alt={product.data.name} fill className="object-cover" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.data.name}</h1>

          {hasUnits && (
            <div className="flex flex-wrap gap-1 mb-3">
              {unitData!.entries.map(([key]) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`text-base lg:text-lg px-2 py-1 rounded border transition-colors cursor-pointer ${
                    selectedKey === key
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-yellow-600 border-yellow-300 hover:border-yellow-500"
                  }`}
                >
                  {key} {unitData!.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold">BDT {displayPrice?.toLocaleString()}</span>
            {hasDiscount && (
              <span className="line-through text-muted-foreground text-lg">
                BDT {activePrice.toLocaleString()}
              </span>
            )}
            {discountPercentage && (
              <Badge className="bg-red-500 text-white text-xs">-{discountPercentage}%</Badge>
            )}
          </div>

          <div className="flex flex-row md:flex-col items-center justify-between md:items-start w-full">
            {hasDiscount && (
              <span className="text-green-600 font-medium">
                You save BDT {savingsAmount.toLocaleString()} ({discountPercentage}%)
              </span>
            )}
            <Badge className="bg-green-600 p-1">{product.data.category?.name}</Badge>
          </div>

          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-3 max-w-1/3 flex-1">
              <Button onClick={() => setQuantity((q) => Math.max(q - 1, 1))} className="w-7 flex-1">
                <MinusIcon />
              </Button>
              <p className="text-sm font-medium">{quantity}</p>
              <Button onClick={() => setQuantity((q) => q + 1)} className="w-7 flex-1">
                <PlusIcon />
              </Button>
            </div>
            <Button
              onClick={() => handleAddToCart(product.data)}
              disabled={isAddDisabled}
              className="flex-1"
            >
              {addToCartLabel}
            </Button>
          </div>

          <motion.button
            disabled={isBuyDisabled}
            onClick={() => handleBuyNow(product.data)}
            className="w-full font-semibold h-9 p-1 bg-black rounded-md text-primary text-sm disabled:opacity-50 cursor-pointer"
            animate={{ scale: [1, 1.1, 1, 1.05, 1] }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
          >
            অর্ডার করুন, ক্যাশ অন ডেলিভারি
          </motion.button>

          <div className="flex flex-col lg:flex-row lg:items-center w-full gap-4">
            <motion.button
              onClick={() => window.open("https://wa.me/8801516194716?text=হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।", "_blank")}
              className="flex items-center gap-x-2 text-sm font-semibold bg-gradient-to-bl from-green-500 to-green-800 h-9 p-1 flex-1 justify-center rounded-md cursor-pointer text-white"
            >
              <Image src="/icons/whatsapp.svg" alt="Whatsapp" height={25} width={25} className="object-contain" />
              Chat with WhatsApp
            </motion.button>
            <motion.button
              onClick={() => window.open("https://m.me/hillorashop?ref=order_now", "_blank")}
              className="flex items-center gap-x-2 text-sm font-semibold bg-gradient-to-bl from-blue-600 to-pink-600 h-9 p-1 flex-1 justify-center rounded-md cursor-pointer text-white"
            >
              <Image src="/icons/messenger.svg.webp" alt="Messenger" height={25} width={25} className="object-contain" />
              Chat with Messenger
            </motion.button>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.data.subDescription}</p>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md gap-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews (0)</TabsTrigger>
          <TabsTrigger value="comments">Comments (0)</TabsTrigger>
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

        <TabsContent value="reviews">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
                <Star className="size-8 fill-primary stroke-primary" />
              </div>
              <p className="text-muted-foreground">No reviews yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-center bg-primary/20 size-14 rounded-full">
                <MessageSquareMore className="size-8 stroke-primary" />
              </div>
              <p className="text-muted-foreground">No comments yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">You may also like</h2>
        <RelatedProducts products={relatedProducts || []} />
      </div>
    </>
  );
};