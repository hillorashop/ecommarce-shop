"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { siteMeta } from "@/data";
import { dbProductwihtoutAll } from "@/actions/product";

interface ProductCardProps {
  product: dbProductwihtoutAll;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    productId,
    productUrl,
    name,
    productImage,
    price,
    discountPrice,
    packageQuantity,
    packageQuantityType,
    reviews,
    inStocks,
  } = product;

  const router = useRouter();
  const { addItem, cartItems } = useCart();
  const isInCart = cartItems.some((item) => item.id === id);

  // Rating calculation
  const reviewCount = reviews?.length || 0;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : 0;

  // ✅ Safe discount handling
  const hasDiscount =
    discountPrice !== undefined &&
    discountPrice !== null &&
    discountPrice > 0 &&
    discountPrice < price;

  const displayPrice = hasDiscount ? discountPrice : price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : null;
  const savingsAmount = hasDiscount ? price - discountPrice! : 0;

  return (
    <Card className="relative shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
      <CardContent className="p-4">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock Badge */}
        <div
          className={`absolute top-2 right-3 text-xs px-2 py-1 rounded-full font-semibold shadow-md ${
            inStocks > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {inStocks > 0 ? `${inStocks} in stock` : "Out of stock"}
        </div>

        {/* Product Image */}
        <Link href={`/products/${productUrl}`}>
          <div className="w-full h-40 mb-4 relative rounded-xl overflow-hidden">
            <Image
              src={productImage || `${siteMeta.siteName}`}
              alt={name}
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">({reviewCount})</span>
        </div>

        {/* Title & Quantity */}
        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {name}
        </h4>
        <p className="text-xs text-gray-500 mb-3">
          {packageQuantity} {packageQuantityType}
        </p>

        {/* Price */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-2">
            <span className="text-base lg:text-lg font-bold text-gray-900">
              BDT {displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                BDT {price.toLocaleString()}
              </span>
            )}
          </div>
          {hasDiscount && (
            <span className="text-xs text-green-600 font-medium">
              You save BDT {savingsAmount.toLocaleString()} ({discountPercentage}%)
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
          <Button
            className="text-xs px-4 py-1 h-7 rounded-md flex-1"
            disabled={inStocks <= 0 || isInCart}
            onClick={() => {
              addItem(product);
              toast.success("Product added to cart");
            }}
          >
            {isInCart ? "ADDED" : "ADD TO CART"}
          </Button>

          <Button
            variant="secondary"
            className="text-xs px-4 py-1 h-7 rounded-md w-full"
            disabled={inStocks <= 0}
            onClick={() => router.push(`/checkout?productId=${id}`)}
          >
            BUY NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
