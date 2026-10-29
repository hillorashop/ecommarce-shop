"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { siteMeta } from "@/data";
import { dbProductwihtoutAll } from "@/actions/product";
import { pushToDataLayer } from "@/lib/gtm";
import React, { useState, useMemo } from "react";
import { Badge } from "./badge";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: dbProductwihtoutAll;
  index: number;
  className?: string;
}

type UnitEntry = { price: number; discountPrice: number };

function ProductCardComponent({ product, index, className }: ProductCardProps) {
  const {
    id,
    productUrl,
    name,
    productImage,
    price,
    discountPrice,
    reviews,
    inStocks,
    kgUnit,
    gramUnit,
    piecesUnit,
    freeDelivery,
  } = product;

  const router = useRouter();
  const { addItem, cartItems } = useCart();

  // Detect which unit type is active and its label suffix
  const unitData = useMemo(() => {
    const tryParse = (raw: unknown, label: string) => {
      if (raw && typeof raw === "object") {
        const entries = Object.entries(raw as Record<string, UnitEntry>);
        if (entries.length > 0) return { entries, label };
      }
      return null;
    };
    return tryParse(kgUnit, "kg") ?? tryParse(gramUnit, "g") ?? tryParse(piecesUnit, "pcs") ?? null;
  }, [kgUnit, gramUnit, piecesUnit]);

  const hasUnits = unitData !== null;

  const [selectedKey, setSelectedKey] = useState<string | null>(
    hasUnits ? unitData!.entries[0][0] : null
  );

  const selectedUnitEntry: UnitEntry | null =
    hasUnits && selectedKey
      ? (unitData!.entries.find(([k]) => k === selectedKey)?.[1] ?? null)
      : null;

  const activePrice = selectedUnitEntry?.price ?? price;
  const activeDiscountPrice = selectedUnitEntry?.discountPrice ?? discountPrice;


  const reviewCount = reviews?.length || 0;

  const hasDiscount =
    activeDiscountPrice !== undefined &&
    activeDiscountPrice !== null &&
    activeDiscountPrice > 0 &&
    activeDiscountPrice < activePrice;

  const displayPrice = hasDiscount ? activeDiscountPrice! : activePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((activePrice - activeDiscountPrice!) / activePrice) * 100)
    : null;
  const savingsAmount = hasDiscount ? activePrice - activeDiscountPrice! : 0;

const variantLabel = hasUnits && selectedKey
  ? `${selectedKey}${unitData!.label}`
  : "default";

const cartKey = selectedKey ? `${id}-${variantLabel}` : id;
const isInCart = cartItems.some((item) => item.cartKey === cartKey);

  return (
    <Card
      className={cn(
        "relative shadow-md hover:shadow-xl transition-shadow duration-300 rounded-none py-0 gap-0 h-full flex flex-col justify-between overflow-hidden bg-white border",
        className
      )}
    >
      <CardContent className="p-0 flex flex-col flex-1 justify-between h-full">
        <div>
          <Link href={`/products/${productUrl}`}>
            <div className="w-full aspect-[4/4] mb-2 relative rounded-none overflow-hidden bg-gray-50/50">
              <Image
                src={productImage?.trim() || "/fevicon.png"}
                alt={name || ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain"
                priority={index === 0}
              />

              {discountPercentage && (
                <div className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-red-500 text-white rounded-md shadow-xs z-10 tracking-tight">
                  -{discountPercentage}%
                </div>
              )}
              {freeDelivery && (
                <div
                  title="Free Delivery"
                  className="absolute top-2 right-2 inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 bg-[#003B3A] text-white rounded shadow-2xs z-10"
                >
                  <Truck className="size-2.5" />
                  <span className="hidden sm:inline">Free Delivery</span>
                  <span className="sm:hidden">Free</span>
                </div>
              )}
            </div>
          </Link>

          <div className="px-3 sm:px-4">
            <h4
              className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 line-clamp-2 h-9 sm:h-10 leading-tight sm:leading-snug"
              title={name}
            >
              {name}
            </h4>

            {/* Units section with consistent min-height */}
            <div className="min-h-[28px] sm:min-h-[32px] flex items-center mb-1 sm:mb-2">
              {hasUnits && (
                <div className="flex flex-wrap gap-1">
                  {unitData!.entries.map(([key]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedKey(key)}
                      className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded border font-medium transition-colors cursor-pointer ${
                        selectedKey === key
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {key} {unitData!.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price section with consistent min-height */}
            <div className="min-h-[26px] sm:min-h-[28px] flex flex-wrap items-baseline gap-1.5 sm:gap-2 mb-2">
              <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                BDT {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  BDT {activePrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons pinned to the bottom */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-1 mt-auto flex flex-col gap-1.5 sm:gap-2 w-full">
          <Button
            className="text-[11px] sm:text-xs px-2 sm:px-4 py-1 h-7 sm:h-8 rounded-md w-full"
            disabled={inStocks <= 0 || isInCart}
            onClick={() => {
              addItem(
                { ...product, price: activePrice, discountPrice: activeDiscountPrice },
                1,
                selectedKey,
                unitData?.label ?? null
              );
              toast.success(`${name} added to cart`);
              pushToDataLayer("add_to_cart", {
                currency: "BDT",
                value: displayPrice,
                items: [
                  {
                    item_id: id,
                    item_name: name,
                    affiliation: siteMeta.siteName,
                    price: displayPrice,
                    discount: savingsAmount,
                    item_brand: siteMeta.siteName,
                    item_variant: variantLabel,
                    quantity: 1,
                  },
                ],
              });
            }}
          >
            {isInCart ? "ADDED" : "ADD TO CART"}
          </Button>

          <Button
            variant="secondary"
            className="text-[11px] sm:text-xs px-2 sm:px-4 py-1 h-7 sm:h-8 rounded-md w-full"
            disabled={inStocks <= 0}
            onClick={() => {
              pushToDataLayer("begin_checkout", {
                currency: "BDT",
                value: displayPrice,
                items: [
                  {
                    item_id: id,
                    item_name: name,
                    affiliation: siteMeta.siteName,
                    discount: savingsAmount,
                    item_brand: siteMeta.siteName,
                    item_category: "",
                    quantity: 1,
                    price: displayPrice,
                    item_variant: variantLabel,
                  },
                ],
              });
              router.push(
                `/checkout?productId=${id}${selectedKey ? `&unit=${variantLabel}` : ""}`
              );
            }}
          >
            BUY NOW
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export const ProductCard = React.memo(ProductCardComponent);