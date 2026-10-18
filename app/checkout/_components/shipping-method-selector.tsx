"use client";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface ShippingMethod {
  id: string;
  label: string;
  cost: number;
  disabled?: boolean;
}

interface ShippingMethodSelectorProps {
  shippingMethodId: string;
  setShippingMethodId: (id: string) => void;
  shippingMethods: ShippingMethod[];
  hasFreeDelivery?: boolean; // 👈 new
}

export function ShippingMethodSelector({
  shippingMethodId,
  setShippingMethodId,
  shippingMethods,
  hasFreeDelivery = false,
}: ShippingMethodSelectorProps) {
  if (shippingMethods.length === 0) return null;

  return (
    <div className="shadow-lg border p-4 rounded-xl">
      <Label className="mb-3 block text-sm font-medium">
        Shipping Method
      </Label>

      <RadioGroup
        value={shippingMethodId}
        onValueChange={setShippingMethodId}
        className="grid grid-cols-1 gap-3 "
      >
        {shippingMethods.map((method) => (
          <div className={cn(
            "flex flex-col space-y-2 rounded-md border p-2 transition-all",
            method.disabled
              ? "cursor-not-allowed opacity-50 border-border"
              : "cursor-pointer",
            !method.disabled && shippingMethodId === method.id
              ? "border-primary bg-primary/5"
              : "",
            !method.disabled && shippingMethodId !== method.id
              ? "border-border hover:border-primary/50"
              : ""
          )}
            key={method.id}>
            <Label
              htmlFor={method.id}
              className={cn(
                "flex items-center justify-between  text-xs font-semibold"
              )}
            >
              <div className="flex items-center gap-1">
                <RadioGroupItem
                  id={method.id}
                  value={method.id}
                  disabled={method.disabled}
                />
                <span className="">
                  {method.label}
                </span>
              </div>

              <span className="flex items-center gap-1.5">
                {hasFreeDelivery ? (
                  <>
                    <span className="line-through text-muted-foreground font-normal">
                      BDT {method.cost.toLocaleString()}
                    </span>
                    <span className="text-green-600">Free</span>
                  </>
                ) : (
                  <>BDT {method.cost.toLocaleString()}</>
                )}
              </span>
            </Label>
            <p className="text-[10px] ml-4 text-muted-foreground">
              {method.id === "insideKhagrachari"
                ? "৩০ মিনিটে ডেলিভারি! সারাজীবন ফ্রি"
                : "খাগড়াছড়ি থেকে যাবে, তাই!"}
            </p>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}