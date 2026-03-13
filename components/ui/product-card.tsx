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
import { pushToDataLayer } from "@/lib/gtm";

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


  const reviewCount = reviews?.length || 0;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount
      : 0;

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
    <Card className="relative shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-none py-0">
      <CardContent className="px-0 ">

     
        <Link href={`/products/${productUrl}`}>
          <div className="w-full aspect-[4/4] mb-2 relative rounded-none overflow-hidden">
            <Image
              src={productImage || `${siteMeta.siteName}`}
              alt={name}
              fill
              className="object-contain"
              loading="lazy"
            />

              <div
          className={`absolute top-0 right-0 text-xs px-2 py-1  font-semibold shadow-md ${
            inStocks > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {inStocks > 0 ? `${inStocks}  Stock` : "Out  Stock"}
        </div>
          </div>
        </Link>

  
<div className="px-4 pb-4">
       <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
          {name}
        </h4>
        <p className="text-xs text-gray-500 mb-3">
          {packageQuantity} {packageQuantityType}
        </p>

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


        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
          <Button
            className="text-xs px-4 py-1 h-7 rounded-md flex-1"
            disabled={inStocks <= 0 || isInCart}
            onClick={() => {
              addItem(product);
              toast.success("Product added to cart");
                pushToDataLayer("add_to_cart", {
    ecommerce: {
      currency: "BDT",
      value: displayPrice,
      items: [
        {
          item_id: id,
          item_name: name,
          price: displayPrice,
          discount: savingsAmount,
          item_category: packageQuantityType,
          item_brand: siteMeta.siteName,
          item_variant: "default",
          in_stock: inStocks > 0,
          quantity:1,
        },
      ],
    },
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
    const hasDiscount =
      discountPrice !== undefined &&
      discountPrice !== null &&
      discountPrice > 0 &&
      discountPrice < price;

    const priceToUse = hasDiscount ? discountPrice : price;
    const discountAmount = hasDiscount ? price - discountPrice! : 0;

   
    pushToDataLayer("begin_checkout", {
      currency: "BDT",
      value: priceToUse,
      coupon: "", 
      items: [
        {
          item_id: id,
          item_name: name,
          affiliation: siteMeta.siteName,
          coupon: "", 
          discount: discountAmount,
          index: 0,
          item_brand: siteMeta.siteName,
          item_category: packageQuantityType,
          quantity: 1,
          price: priceToUse,
        },
      ],
    });

    // Navigate to checkout
    router.push(`/checkout?productId=${id}`);
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
