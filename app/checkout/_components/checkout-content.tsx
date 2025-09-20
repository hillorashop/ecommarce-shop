"use client";

import { useState, useMemo } from "react";
import { CartItem, useCart } from "@/hooks/use-store";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePostOrder } from "@/hooks/use-post-order";
import { Zap } from "lucide-react";
import { InvoiceOrder } from "./invoice-order";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { CustomForm } from "@/components/ui/custom-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { useCustomMutation } from "@/hooks/use-custom-query";
import { postOrder } from "@/actions/order";

const shippingSchema = z.object({
  name: z.string().min(2, "নাম লিখুন"),
  mobileNumber: z
    .string()
    .regex(/^(?:\+88)?01[3-9]\d{8}$/, "একটি সঠিক মোবাইল নাম্বার লিখুন"),
  address: z.string().min(5, "ঠিকানা লিখুন"),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay when the product arrives at your door.",
    gradient: "bg-gradient-to-tr from-gray-100 to-gray-200",
    textColor: "text-gray-800",
    image: "/logo/cod.png",
  },
];

interface Props {
  productId?: string;
}


export const  CheckoutContent = ({ productId }: Props) => {
  const { cartItems } = useCart();
  const { data: products, isLoading } = useProducts();
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const {user} = useUser()
  const checkoutItems: CartItem[] = useMemo(() => {
    if (productId && products) {
      const found = products.data.find((p) => p.id === productId);
      return found ? [{ ...found, cartQuantity: 1 }] : [];
    }
    return cartItems;
  }, [productId, products, cartItems]);

  

const { mutate: submitOrder, isPending, error } = useCustomMutation(
  ["post-order"],
  postOrder,
  ["ordersByUser", user?.id], 
  (newOrder) => {
    setOrderResponse(newOrder.data);
  }
);




  const subTotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );

  const totalDiscount = checkoutItems.reduce(
    (acc, item) =>
      acc + (item.price - (item.discountPrice ?? item.price)) * item.cartQuantity,
    0
  );

  const total = subTotal - totalDiscount;

  // React Hook Form
  const form = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { name: "", mobileNumber:user?.mobileNumber || "", address:user?.address || "" },
  });

  const handlePlaceOrder = async (data: ShippingForm) => {
    if (!selectedPayment) return;

    const orderData = {
      userId:user?.id,
      name: data.name,
      mobileNumber: data.mobileNumber,
      address: data.address,
      paymentMethod: selectedPayment,
      totalDiscount,
      total,
      orderItems: checkoutItems.map((item) => ({
        productId: item.id,
        quantity: item.cartQuantity,
      })),
    };

    try {
      submitOrder(orderData);
    } catch (err) {
      console.error("Order failed:", err);
    }
  };



  if (orderResponse) return <InvoiceOrder order={orderResponse} />;

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <CardHeader>
          <h3 className="text-xl font-semibold">Cart & Shipping & Payment</h3>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading ? (
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
          ) : checkoutItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-3">
              {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
  <Image
    src={item.productImage}
    alt={item.name}
    width={64}
    height={64}
    className="rounded-md object-cover border"
  />
  <div className="flex-1">
    <p className="text-sm font-medium">{item.name}</p>
    <p className="text-xs text-gray-500">Qty: {item.cartQuantity}</p>
    <div className="flex items-center gap-2 mt-1">
      {item.discountPrice && item.discountPrice < item.price ? (
        <>
          <span className="text-sm font-semibold text-green-600">
            BDT {item.discountPrice}
          </span>
          <span className="text-xs line-through text-gray-400">
            BDT {item.price}
          </span>
        </>
      ) : (
        <span className="text-sm font-semibold">BDT {item.price}</span>
      )}
    </div>
  </div>
  <p className="font-semibold text-right text-gray-800">
    BDT {(item.discountPrice ?? item.price) * item.cartQuantity}
  </p>
</div>

              ))}
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1 border-t pt-3">
            <div className="flex justify-between text-sm">
              <span>Sub Total:</span>
              <span>BDT {subTotal}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount:</span>
              <span>- BDT {totalDiscount}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>BDT {total}</span>
            </div>
          </div>

          {/* Shipping Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePlaceOrder)}
              className="space-y-4"
            >
              <h4 className="font-medium mb-3">Shipping Address</h4>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    inputType="text"
                    label="Your Name"
                    placeHolder="Enter your full name"
                    important
                  />
                )}
              />
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="input"
                    inputType="text"
                    label="Mobile Number"
                    placeHolder="Enter your mobile number"
                    important
                  />
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <CustomForm
                    field={field}
                    fieldType="textarea"
                    label="Address"
                    placeHolder="Enter your address"
                    important
                  />
                )}
              />

              {/* Payment Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPayment === method.id;
                  return (
                    <Card
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`cursor-pointer p-4 flex flex-col items-center text-center border-2 rounded-xl ${
                        isSelected
                          ? "border-yellow-400 ring-2 ring-yellow-200"
                          : "border-gray-200"
                      } ${method.gradient}`}
                    >
                      <Image
                        src={method.image}
                        alt={method.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                      <h4 className={`font-semibold ${method.textColor}`}>
                        {method.name}
                      </h4>
                      <p className={`text-sm ${method.textColor}`}>
                        {method.description}
                      </p>
                    </Card>
                  );
                })}
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={!selectedPayment || checkoutItems.length === 0 || isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" /> Placing Order...
                  </div>
                ) : (
                  "Place Order"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
