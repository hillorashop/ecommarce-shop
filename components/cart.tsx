"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, useOpenStore } from "@/hooks/use-store";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { pushToDataLayer } from "@/lib/gtm";
import { siteMeta } from "@/data";

export const Cart = () => {
  const router = useRouter();
  const { cartItems, removeItem, updateQuantity } = useCart();
  const { open, setOpen } = useOpenStore();


  useEffect(() => {
  if (open && cartItems.length > 0) {
    const items = cartItems.map((item) => {
      const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      return {
        item_id: item.productId,
        item_name: item.name,
        price,
        quantity: item.cartQuantity,
        discount: item.price - price,
        item_brand: siteMeta.siteName,
        item_category: item.packageQuantityType,
      };
    });

    pushToDataLayer("view_cart", {
      currency: "BDT",
      value: items.reduce((total, i) => total + i.price * i.quantity, 0),
      items,
    });
  }
}, [open, cartItems]);

const remove = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      pushToDataLayer("remove_from_cart", {
        currency: "BDT",
        value: price * item.cartQuantity,
        items: [
          {
            item_id: item.productId,
            item_name: item.name,
            price,
            discount: item.price - price,
            quantity: item.cartQuantity,
            item_brand: siteMeta.siteName,
            item_category: item.packageQuantityType,
          },
        ],
      });
    }
  }

  const totalPrice = cartItems.reduce((total, item) => {
    const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
    return total + price * item.cartQuantity;
  }, 0);

  const onCheckout = () => {
    if (cartItems.length > 0) {
      const items = cartItems.map((item) => {
        const price =
          item.discountPrice && item.discountPrice > 0
            ? item.discountPrice
            : item.price;
        return {
          item_id: item.productId,
          item_name: item.name,
          price,
          quantity: item.cartQuantity,
          discount: item.price - price,
          item_brand: siteMeta.siteName,
          item_category: item.packageQuantityType,
        };
      });

      pushToDataLayer("begin_checkout", {
        currency: "BDT",
        value: totalPrice,
        items,
      });
    }

    router.push("/checkout");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {cartItems.length > 0 ? (
        <SheetContent className="flex flex-col space-y-6 bg-gray-50">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold">Shopping Cart</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cartItems.map((item) => {
              const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4 px-2 last:border-0"
                >
                  {/* Product Image */}
                  <Image
                    src={item.productImage}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 mx-4">
                    <p className="text-sm font-medium truncate">{item.name}</p>

                    <p className="text-sm text-gray-600">
                      {item.discountPrice && item.discountPrice > 0 ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            BDT {item.price.toLocaleString()}
                          </span>
                          <span className="font-semibold text-green-600">
                            BDT {item.discountPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">BDT {item.price.toLocaleString()}</span>
                      )}
                      <span className="ml-2">
                        x {item.cartQuantity} ={" "}
                        <span className="font-medium">BDT {(price * item.cartQuantity).toLocaleString()}</span>
                      </span>
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(item.cartQuantity - 1, 1))
                        }
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                      >
                        -
                      </Button>
                      <p className="text-sm font-medium">{item.cartQuantity}</p>
                      <Button
                        onClick={() =>
                          updateQuantity(item.id, item.cartQuantity + 1)
                        }
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(item.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <SheetFooter className="border-t pt-4">
            <div className="flex justify-between items-center w-full mb-4">
              <p className="text-base font-semibold">Total</p>
              <p className="text-lg font-bold text-primary">BDT {totalPrice.toLocaleString()}</p>
            </div>
            <Button className="w-full" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
          </SheetFooter>
        </SheetContent>
      ) : (
        <SheetContent>
          <SheetHeader className="flex items-center justify-center h-full w-full">
            <SheetTitle className="text-muted-foreground text-lg">
              Your cart is empty 🛒
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};
