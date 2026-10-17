"use client";

import { useState, useMemo, useEffect } from "react";
import { CartItem, useCart } from "@/hooks/use-store";
import { useProducts } from "@/hooks/use-products";
import { InvoiceOrder } from "./invoice-order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { useCustomMutation } from "@/hooks/use-custom-query";
import { postOrder } from "@/actions/order";
import { pushToDataLayer } from "@/lib/gtm";
import {  siteMeta } from "@/data";
import { dbOrder } from "@/types/type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { trackEcommerceEvent } from "@/lib/custom-tm";
import { ShippingPaymentForm, shippingSchema, ShippingForm } from "./shipping-payment-form";
import { CartItemList } from "./cart-item-list";
import { CouponInput, CouponResult } from "./coupon-input";
import { ShippingMethod, ShippingMethodSelector } from "./shipping-method-selector";
import { OrderSummary } from "./order-summary";
import { useDeliveryCharges } from "@/hooks/use-delivery-charges";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
}

export const CheckoutContent = () => {
  const { cartItems, clearCart } = useCart();
  const { data: products, isLoading } = useProducts();
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [orderResponse, setOrderResponse] = useState<dbOrder | null>(null);
  const { user } = useUser();

  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const { data: deliveryChargeRes } = useDeliveryCharges();
  const charges = deliveryChargeRes?.data;



  const [shippingMethodId, setShippingMethodId] = useState<string>("");



  const [fbp, setFbp] = useState<string | null>(null);
  const [fbc, setFbc] = useState<string | null>(null);
  const [ttpCookie, setttpCookie] = useState<string | null>(null);
  const [ttclidValue, setTtclidValue] = useState<string | null>(null);
  const [gclid, setGclid] = useState<string | null>(null);

  const [li_fat_id, setLi_fat_id] = useState<string | null>(null);
  const [gbraid, setGbraid] = useState<string | null>(null);
  const [wbraid, setWbraid] = useState<string | null>(null);
  const [dclid, setDclid] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [msclkid, setMsclkid] = useState<string | null>(null);
  const [fbclid, setFbclid] = useState<string | null>(null);
  const [twclid, setTwclid] = useState<string | null>(null);
  const [rdt_cid, setRdt_cid] = useState<string | null>(null);
  const [epik, setEpik] = useState<string | null>(null);
  const [ScCid, setScCid] = useState<string | null>(null);
  const [sccid, setSccid] = useState<string | null>(null);
  const [qclid, setQclid] = useState<string | null>(null);
  const [irclickid, setIrclickid] = useState<string | null>(null);
  const [awc, setAwc] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const productId = searchParams.get("productId");
  const qty = searchParams.get("qty");

  useEffect(() => {
    setFbp(getCookie("_fbp"));
    setFbc(getCookie("_fbc"));
    setttpCookie(getCookie("_ttp"));
    setTtclidValue(getCookie("ttclid"));
    setGclid(getCookie("gclid"));
    setLi_fat_id(getCookie("li_fat_id"));
    setGbraid(getCookie("gbraid"));
    setWbraid(getCookie("wbraid"));
    setDclid(getCookie("dclid"));
    setUuid(getCookie("uuid"));
    setMsclkid(getCookie("msclkid"));
    setFbclid(getCookie("fbclid"));
    setTwclid(getCookie("twclid"));
    setRdt_cid(getCookie("rdt_cid"));
    setEpik(getCookie("epik"));
    setScCid(getCookie("ScCid"));
    setSccid(getCookie("sccid"));
    setQclid(getCookie("qclid"));
    setIrclickid(getCookie("irclickid"));
    setAwc(getCookie("awc"));
  }, []);

  const checkoutItems: CartItem[] = useMemo(() => {
    if (productId && products) {
      const found = products.data.find((p) => p.id === productId);
      if (!found) return [];

      let activePrice = found.price;
      let activeDiscountPrice = found.discountPrice;
      let selectedUnit: string | null = null;
      let unitLabel: string | null = null;

      if (unitParam) {
        type UnitMap = Record<string, { price: number; discountPrice: number }>;

        const kg = found.kgUnit && typeof found.kgUnit === "object" && Object.keys(found.kgUnit).length > 0
          ? (found.kgUnit as UnitMap) : null;
        const gram = found.gramUnit && typeof found.gramUnit === "object" && Object.keys(found.gramUnit).length > 0
          ? (found.gramUnit as UnitMap) : null;
        const pcs = found.piecesUnit && typeof found.piecesUnit === "object" && Object.keys(found.piecesUnit).length > 0
          ? (found.piecesUnit as UnitMap) : null;

        const unitMap = kg ?? gram ?? pcs ?? null;

        const keyMatch = unitParam.match(/^(\d+(?:\.\d+)?)/);
        const labelMatch = unitParam.match(/[a-zA-Z]+$/);
        const key = keyMatch?.[1] ?? null;

        if (unitMap && key && unitMap[key]) {
          activePrice = unitMap[key].price;
          activeDiscountPrice = unitMap[key].discountPrice;
          selectedUnit = key;
          unitLabel = labelMatch?.[0] ?? null;
        }
      }

      return [{
        ...found,
        cartKey: selectedUnit ? `${found.id}-${selectedUnit}${unitLabel}` : found.id,
        price: activePrice,
        discountPrice: activeDiscountPrice,
        cartQuantity: qty ? parseInt(qty) : 1,
        selectedUnit,
        unitLabel,
      }];
    }
    return cartItems;
  }, [productId, products, cartItems, qty, unitParam]);

const hasFreeDelivery = useMemo(() => {
  if (checkoutItems.length === 0) return false;
  return checkoutItems.some((item) => item.freeDelivery === true);
}, [checkoutItems]);



  const shippingMethods: ShippingMethod[] = useMemo(() => {
    if (!charges) return [];
    const methods: ShippingMethod[] = [
      { id: "insideDhaka", label: "Inside Dhaka", cost: charges.insideDhaka ?? 0 },
      { id: "outsideDhaka", label: "Outside Dhaka", cost: charges.outsideDhaka ?? 0 },
    ];

    if (charges.insideKhagrachari != null) {
      methods.push({
        id: "insideKhagrachari",
        label: "Inside Khagrachari",
        cost: charges.insideKhagrachari,
      });
    }

    return methods;
  }, [charges]);


  useEffect(() => {
    if (shippingMethods.length > 0 && !shippingMethodId) {
      const firstEnabled = shippingMethods.find((m) => !m.disabled);
      if (firstEnabled) setShippingMethodId(firstEnabled.id);
    }
  }, [shippingMethods, shippingMethodId]);

  const selectedShipping =
    shippingMethods.find((m) => m.id === shippingMethodId) ?? shippingMethods[0] ?? { id: "", label: "", cost: 0 };


  const { mutate: submitOrder, isPending, error } = useCustomMutation(
    ["post-order"],
    postOrder,
    ["ordersByUser", user?.id],
    (newOrder) => {
      setOrderResponse(newOrder.data);
      clearCart();
      router.replace(pathname, { scroll: false });
    }
  );

  const subTotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );

  const totalDiscount = checkoutItems.reduce((acc, item) => {
    const hasDiscount =
      item.discountPrice &&
      item.discountPrice > 0 &&
      item.discountPrice < item.price;

    return (
      acc +
      (hasDiscount ? (item.price - item.discountPrice!) * item.cartQuantity : 0)
    );
  }, 0);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon?.success) return 0;
    const priceAfterItemDiscount = subTotal - totalDiscount;

    if (appliedCoupon.discountType === "percentage") {
      return Math.round((priceAfterItemDiscount * (appliedCoupon.discountValue ?? 0)) / 100);
    }
    if (appliedCoupon.discountType === "flat") {
      return Math.min(appliedCoupon.discountValue ?? 0, priceAfterItemDiscount);
    }
    return 0;
  }, [appliedCoupon, subTotal, totalDiscount]);

    const shippingCost = checkoutItems.length > 0
  ? (hasFreeDelivery ? 0 : selectedShipping.cost)
  : 0;

  const total = subTotal - totalDiscount - couponDiscount + shippingCost;

  useEffect(() => {
    if (!selectedPayment) return;

    const items = checkoutItems.map((item) => {
      const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      const discount = item.price - price;

      return {
        item_id: item.id,
        item_name: item.name,
        price,
        discount,
        quantity: item.cartQuantity,
        item_brand: siteMeta?.siteName || "Online Store",
        item_variant: item.selectedUnit && item.unitLabel
          ? `${item.selectedUnit}${item.unitLabel}`
          : undefined,
        item_category: "",
      };
    });

    const ecommerce = {
      currency: "BDT",
      value: total,
      affiliation: siteMeta?.siteName || "Online Store",
      payment_type: selectedPayment,
      coupon: appliedCoupon?.code,
      shipping: shippingCost,
      items,
    };

    pushToDataLayer("add_payment_info", ecommerce);
    trackEcommerceEvent("add_payment_info", ecommerce);
  }, [selectedPayment, checkoutItems, total]);

  useEffect(() => {
    if (!orderResponse) return;

    const {
      name, mobileNumber, paymentMethod, address, userAgent, userId, createdAt, ip, accountType, status, updatedAt,
      fbc, fbp, ttclidValue, ttpCookie,
      gclid, li_fat_id, gbraid, wbraid, dclid, uuid, msclkid, fbclid, twclid, rdt_cid, epik, ScCid, sccid, qclid, irclickid, awc,
      orderItems, zilla, thana,email
    } = orderResponse;

    const items = orderItems.map((item) => {
      const price = item.price;
      const productName = products?.data?.find((p) => p.id === item.productId)?.name;

      return {
        item_id: item.productId,
        item_name: productName,
        price,
        quantity: item.quantity,
        item_brand: siteMeta?.siteName || "Online Store",
        item_variant: item.variant ? item.variant : undefined,
        item_category: "",
      };
    });

    const ecommerce = {
      order_id: orderResponse.orderId,
      transaction_id: orderResponse.transactionId,
      currency: "BDT",
      value: total,
      affiliation: siteMeta?.siteName || "Online Store",
      shipping: shippingCost,
      payment_type: selectedPayment,
      payment_method: paymentMethod,
      is_paid: orderResponse.isPaid,
      discount_total: totalDiscount || 0,
      coupon: appliedCoupon?.code,
      coupon_discount: couponDiscount || 0,
      items,
      customer_name: name,
      customer_mobile: mobileNumber,
      customer_email: email,
      customer_zilla: zilla,
      customer_thana: thana,
      customer_address: address,
      customer_account_type: accountType,
      customer_id: userId,
      order_status: status,
      user_agent: userAgent,
      ip_address: ip,
      fbc, fbp, gclid, li_fat_id, gbraid, wbraid, dclid, uuid, msclkid, fbclid, twclid, rdt_cid, epik, ScCid, sccid, qclid, irclickid, awc,
      ttclid: ttclidValue,
      ttp_cookie: ttpCookie,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    pushToDataLayer("purchase", ecommerce);
    trackEcommerceEvent("purchase", ecommerce);
  }, [orderResponse]);

  const form = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      orderFor:"self",
      name:user?.name || "",
      mobileNumber: user?.mobileNumber || "",
      address: user?.address || "",
      zilla:"",
      thana:"",
      specialNote:"",
      agreeToReturnPolicy:true
      
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        orderFor:"self",
        name:user?.name || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        zilla:"",
        thana:"",
        specialNote:"",
        agreeToReturnPolicy:true
      });
    }
  }, [user]);

  const handlePlaceOrder = async (data: ShippingForm) => {
    if (!selectedPayment) return;

    const items = checkoutItems.map((item) => {
      const price = item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
      const discount = item.price - price;

      return {
        item_id: item.id,
        item_name: item.name,
        price,
        discount,
        quantity: item.cartQuantity,
        item_brand: siteMeta?.siteName || "Online Store",
        item_variant: item.selectedUnit && item.unitLabel
          ? `${item.selectedUnit}${item.unitLabel}`
          : undefined,
        item_category: "",
      };
    });

    const ecommerce = {
      currency: "BDT",
      value: total,
      affiliation: siteMeta?.siteName || "Online Store",
      shipping: shippingCost,
      items,
    };

    pushToDataLayer("add_shipping_info", ecommerce);
    trackEcommerceEvent("add_shipping_info", ecommerce);

    const orderData = {
      userId: user?.id,
      fbc,
      fbp,
      ttpCookie,
      ttclidValue,
      gclid,
      li_fat_id,
      gbraid,
      wbraid,
      dclid,
      uuid,
      msclkid,
      fbclid,
      twclid,
      rdt_cid,
      epik,
      ScCid,
      sccid,
      qclid,
      irclickid,
      awc,
      name: data.name,
      mobileNumber: data.mobileNumber,
      orderFor:data.orderFor,
      zilla: data.zilla,
      thana: data.thana,
      address: data.address,
      specialNote:data.specialNote,
      paymentMethod: selectedPayment,
      shippingMethod: selectedShipping.id,
      shippingCost,
      couponCode: appliedCoupon?.code ?? null,
      couponDiscount,
      totalDiscount,
      total,
      orderItems: checkoutItems.map((item) => {
        const hasDiscount = item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.price;
        const variant = item.selectedUnit && item.unitLabel ? `${item.selectedUnit}${item.unitLabel}` : "default";

        return {
          productId: item.id,
          quantity: item.cartQuantity,
          price: hasDiscount ? item.discountPrice! : item.price,
          variant,
        };
      }),
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
      <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cart & Shipping & Payment</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
<div className="space-y-4">
     <CartItemList isLoading={isLoading} checkoutItems={checkoutItems} />


{checkoutItems.length > 0  && (
            <ShippingMethodSelector
              shippingMethodId={shippingMethodId}
              setShippingMethodId={setShippingMethodId}
              shippingMethods={shippingMethods}
              hasFreeDelivery={hasFreeDelivery}
            />
          )}
          {checkoutItems.length > 0 && (
   <CouponInput
  subTotal={subTotal - totalDiscount}
  appliedCoupon={appliedCoupon}
  setAppliedCoupon={setAppliedCoupon}
  couponDiscount={couponDiscount}
  checkoutItems={checkoutItems}   
/>
          )}
          <OrderSummary
            subTotal={subTotal}
            totalDiscount={totalDiscount}
            couponCode={appliedCoupon?.code}
            couponDiscount={couponDiscount}
            shippingLabel={selectedShipping.label}
            shippingCost={shippingCost}
            total={total}
          />
</div>
<div>
        <ShippingPaymentForm
            form={form}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            onSubmit={handlePlaceOrder}
            isPending={isPending}
            disabled={checkoutItems.length === 0}
          />
</div>
          </div>
    
      </div>

      {error && <p className="text-red-500 font-semibold">{error}</p>}
    </div>
  );
};