"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItem } from "@/hooks/use-store";

interface CartItemListProps {
  isLoading: boolean;
  checkoutItems: CartItem[];
}

export const CartItemList: React.FC<CartItemListProps> = ({ isLoading, checkoutItems }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return <p className="text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-3 shadow-lg border p-4 rounded-xl">
          <h4 className="font-medium mb-3">Order Items</h4>
      {checkoutItems.map((item) => {
        const hasDiscount =
          item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price;

        return (
          <div key={item.cartKey} className="flex items-center gap-4 border-b pb-3">
            <Image
              src={item.productImage?.trim() || "/fevicon.png"}
              alt={item.name || ""}
              width={64}
              height={64}
              className="rounded-md object-cover border"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {item.selectedUnit && item.unitLabel && (
                <p className="text-sm">
                  {item.selectedUnit}
                  {item.unitLabel}
                </p>
              )}
              <div className="flex items-center justify-between  mt-1">
                <p className="flex items-center gap-x-2 text-center">
                    {hasDiscount ? (
                  <>
                    <span className="text-xs line-through text-gray-400">
                      BDT {item.price.toLocaleString()}
                    </span>
                           <span className="text-sm font-semibold text-[#003B3A]">
                      BDT {item.discountPrice?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-semibold">
                    BDT {item.price.toLocaleString()}
                  </span>
                )}
                <span>x </span><span className="text-sm">{item.cartQuantity}</span>
                  
                </p>
                 <p className="font-semibold text-sm text-right text-gray-800">
              BDT{" "}
              {((hasDiscount ? item.discountPrice! : item.price) * item.cartQuantity).toLocaleString()}
            </p>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};