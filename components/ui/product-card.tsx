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
import { useState } from "react";

interface ProductCardProps {
  product: dbProductwihtoutAll;
}

type UnitEntry = { price: number; discountPrice: number };

export function ProductCard({ product }: ProductCardProps) {
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
  } = product;

  const router = useRouter();
  const { addItem, cartItems } = useCart();

  // Detect which unit type is active and its label suffix
  const resolveUnits = (): { entries: [string, UnitEntry][]; label: string } | null => {
    const tryParse = (raw: unknown, label: string) => {
      if (raw && typeof raw === "object") {
        const entries = Object.entries(raw as Record<string, UnitEntry>);
        if (entries.length > 0) return { entries, label };
      }
      return null;
    };
    return tryParse(kgUnit, "kg") ?? tryParse(gramUnit, "g") ?? tryParse(piecesUnit, "pcs") ?? null;
  };

  const unitData = resolveUnits();
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
const isInCart = cartItems.some((item) => item.id === cartKey);

  return (
    <Card className="relative shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-none py-0">
      <CardContent className="px-0">
        <Link href={`/products/${productUrl}`}>
          <div className="w-full aspect-[4/4] mb-2 relative rounded-none overflow-hidden">
            <Image
              src={productImage || siteMeta.siteName}
              alt={name}
              fill
              className="object-contain"
              loading="lazy"
            />
            <div
              className={`absolute top-0 right-0 text-xs px-2 py-1 font-semibold shadow-md ${
                inStocks > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {inStocks > 0 ? `${inStocks} Stock` : "Out Stock"}
            </div>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{name}</h4>

          {hasUnits && (
            <div className="flex flex-wrap gap-1 mb-3">
              {unitData!.entries.map(([key]) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
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

          <div className="flex flex-col gap-1 mb-2">
            <div className="flex flex-col lg:flex-row lg:items-baseline gap-2">
              <span className="text-base lg:text-lg font-bold text-gray-900">
                BDT {displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  BDT {activePrice.toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <span className="text-xs text-green-600 font-medium">
                You save BDT {savingsAmount.toLocaleString()} ({discountPercentage}%)
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
            <Button
              className="text-xs px-4 py-1 h-7 rounded-md flex-1"
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
      items: [{
          item_id: id,
          item_name: name,
          affiliation: siteMeta.siteName,
          price: displayPrice,
          discount: savingsAmount,
          item_brand: siteMeta.siteName,
          item_variant: variantLabel,
          quantity: 1,
        }],
    
  });
}}
            >
              {isInCart ? "ADDED" : "ADD TO CART"}
            </Button>

            <Button
              variant="secondary"
              className="text-xs px-4 py-1 h-7 rounded-md w-full"
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
        </div>
      </CardContent>
    </Card>
  );
}