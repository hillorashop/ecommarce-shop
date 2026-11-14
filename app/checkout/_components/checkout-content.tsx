"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CartItem, useCart } from "@/hooks/use-store";
import { getProducts, ProductsResponse } from "@/actions/product";
import { InvoiceOrder } from "./invoice-order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { useCustomQuery } from "@/hooks/use-query";
import { useCustomMutation } from "@/hooks/use-mutation";
import { postOrder, getOrderById, orderInput } from "@/actions/order";
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
import { getDeliveryCharges, DeliveryChargeResponse } from "@/actions/delivery";
import { getBusinessInfo, BusinessResponse } from "@/actions/business-info";
import { CheckoutSecurityAlert } from "./checkout-security-alert";
import { getTrackingCookie, getTrackingValue } from "@/lib/cookies-tracking";

export const CheckoutContent = () => {
  const [mounted, setMounted] = useState(false);
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const productId = searchParams.get("productId");
  const qty = searchParams.get("qty");
  const successOrderId = searchParams.get("orderNumber") || searchParams.get("orderId");


  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: products, isLoading } = useCustomQuery<ProductsResponse>(
    ["products"],
    () => getProducts()
  );
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");
  const [orderResponse, setOrderResponse] = useState<dbOrder | null>(null);
  const [securityBlock, setSecurityBlock] = useState<{
    message: string;
    blockedType?: "IP" | "PHONE";
    expiresAt?: string | null;
  } | null>(null);

  const { data: businessInfo } = useCustomQuery<BusinessResponse>(
    ["business-info"],
    () => getBusinessInfo()
  );

  // Fetch existing order if URL has orderNumber (persists across reload)
  const { data: existingOrderRes } = useCustomQuery<any>(
    ["checkout-success-order", successOrderId],
    () => (successOrderId ? getOrderById(successOrderId) : Promise.resolve(null)),
    {
      enabled: Boolean(successOrderId && !orderResponse),
      staleTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (existingOrderRes?.data && !orderResponse) {
      setOrderResponse(existingOrderRes.data);
    }
  }, [existingOrderRes, orderResponse]);


  const { user } = useUser();

  const [failedOrderId, setFailedOrderId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("hillora_failed_order_id");
      } catch {
        return null;
      }
    }
    return null;
  });
  const failedOrderIdRef = useRef<string | null>(failedOrderId);
  const isDraftSavingRef = useRef<boolean>(false);

  useEffect(() => {
    failedOrderIdRef.current = failedOrderId;
    if (failedOrderId) {
      try {
        sessionStorage.setItem("hillora_failed_order_id", failedOrderId);
      } catch {}
    }
  }, [failedOrderId]);

  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);
  const { data: deliveryChargeRes } = useCustomQuery<DeliveryChargeResponse>(
    ["delivery-charge"],
    () => getDeliveryCharges()
  );
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



  useEffect(() => {
    setFbp(getTrackingCookie("_fbp"));
    setFbc(getTrackingCookie("_fbc"));
    setttpCookie(getTrackingCookie("_ttp"));
    setTtclidValue(getTrackingValue("ttclid", searchParams));
    setGclid(getTrackingValue("gclid", searchParams));
    setLi_fat_id(getTrackingValue("li_fat_id", searchParams));
    setGbraid(getTrackingValue("gbraid", searchParams));
    setWbraid(getTrackingValue("wbraid", searchParams));
    setDclid(getTrackingValue("dclid", searchParams));
    setUuid(getTrackingValue("uuid", searchParams));
    setMsclkid(getTrackingValue("msclkid", searchParams));
    setFbclid(getTrackingValue("fbclid", searchParams));
    setTwclid(getTrackingValue("twclid", searchParams));
    setRdt_cid(getTrackingValue("rdt_cid", searchParams));
    setEpik(getTrackingValue("epik", searchParams));
    setScCid(getTrackingValue("ScCid", searchParams));
    setSccid(getTrackingValue("sccid", searchParams));
    setQclid(getTrackingValue("qclid", searchParams));
    setIrclickid(getTrackingValue("irclickid", searchParams));
    setAwc(getTrackingValue("awc", searchParams));
  }, [searchParams]);

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
    (response) => {
      // Handle error or security block responses returned from the server without throwing
      if (!response?.data || response?.success === false || response?.error) {
        const isBlockError =
          response?.errorCode === "ORDER_BLOCKED" ||
          response?.error === "ORDER_BLOCKED" ||
          response?.errorCode === "ORDER_FRAUD_DETECTED" ||
          Boolean(response?.blockedType) ||
          response?.message?.includes("স্থগিত");

        if (isBlockError) {
          setSecurityBlock({
            message: response.message || "নিরাপত্তা জনিত কারণে অর্ডার সাময়িক স্থগিত রাখা হয়েছে।",
            blockedType: response.blockedType || "PHONE",
            expiresAt: response.expiresAt || null,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      setOrderResponse(response.data);
      setFailedOrderId(null);
      failedOrderIdRef.current = null;
      try {
        sessionStorage.removeItem("hillora_failed_order_id");
      } catch {}
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
      transaction_id: orderResponse.transactionId || null,
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

  const watchedName = form.watch("name");
  const watchedMobile = form.watch("mobileNumber");
  const watchedAddress = form.watch("address");
  const watchedZilla = form.watch("zilla");
  const watchedThana = form.watch("thana");
  const watchedOrderFor = form.watch("orderFor");
  const watchedSpecialNote = form.watch("specialNote");

  // Automatically reset phone-specific security block if customer changes their phone number
  useEffect(() => {
    if (securityBlock && securityBlock.blockedType === "PHONE") {
      setSecurityBlock(null);
    }
  }, [watchedMobile]);

  const isNameValid = Boolean(watchedName && watchedName.trim().length >= 2);
  const isMobileValid = Boolean(
    watchedMobile && /^(?:\+88)?01[3-9]\d{8}$/.test(watchedMobile.trim())
  );
  const hasItems = checkoutItems.length > 0;

  useEffect(() => {
    if (!isNameValid || !isMobileValid || !hasItems || orderResponse) {
      return;
    }

    const timer = setTimeout(async () => {
      if (isDraftSavingRef.current) return;
      isDraftSavingRef.current = true;
      try {
        const draftData: orderInput = {
          existingOrderId: failedOrderIdRef.current || undefined,
          status: "FAILED",
          userId: user?.id,
          name: watchedName.trim(),
          mobileNumber: watchedMobile.trim(),
          address: watchedAddress?.trim() || "Incomplete Checkout",
          orderFor: watchedOrderFor || "self",
          zilla: watchedZilla || null,
          thana: watchedThana || null,
          specialNote: watchedSpecialNote || null,
          paymentMethod: selectedPayment || "cod",
          shippingMethod: selectedShipping.id || null,
          couponCode: appliedCoupon?.code ?? null,
          fbc,
          fbp,
          ttpCookie,
          ttclidValue: ttclidValue || getTrackingValue("ttclid", searchParams),
          gclid: gclid || getTrackingValue("gclid", searchParams),
          li_fat_id: li_fat_id || getTrackingValue("li_fat_id", searchParams),
          gbraid: gbraid || getTrackingValue("gbraid", searchParams),
          wbraid: wbraid || getTrackingValue("wbraid", searchParams),
          dclid: dclid || getTrackingValue("dclid", searchParams),
          uuid: uuid || getTrackingValue("uuid", searchParams),
          msclkid: msclkid || getTrackingValue("msclkid", searchParams),
          fbclid: fbclid || getTrackingValue("fbclid", searchParams),
          twclid: twclid || getTrackingValue("twclid", searchParams),
          rdt_cid: rdt_cid || getTrackingValue("rdt_cid", searchParams),
          epik: epik || getTrackingValue("epik", searchParams),
          ScCid: ScCid || getTrackingValue("ScCid", searchParams),
          sccid: sccid || getTrackingValue("sccid", searchParams),
          qclid: qclid || getTrackingValue("qclid", searchParams),
          irclickid: irclickid || getTrackingValue("irclickid", searchParams),
          awc: awc || getTrackingValue("awc", searchParams),
          orderItems: checkoutItems.map((item) => {
            const variant =
              item.selectedUnit && item.unitLabel
                ? `${item.selectedUnit}${item.unitLabel}`
                : "default";

            return {
              productId: item.id,
              quantity: item.cartQuantity,
              variant,
            };
          }),
        };

        const res = await postOrder(draftData);
        if (res?.data?.id) {
          failedOrderIdRef.current = res.data.id;
          setFailedOrderId(res.data.id);
          try {
            sessionStorage.setItem("hillora_failed_order_id", res.data.id);
          } catch {}
        }
      } catch (err) {
        console.warn("Auto-save failed order notice:", err);
      } finally {
        isDraftSavingRef.current = false;
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    isNameValid,
    isMobileValid,
    hasItems,
    orderResponse,
    watchedName,
    watchedMobile,
    watchedAddress,
    watchedZilla,
    watchedThana,
    watchedOrderFor,
    watchedSpecialNote,
    selectedPayment,
    selectedShipping.id,
    shippingCost,
    appliedCoupon?.code,
    couponDiscount,
    totalDiscount,
    total,
    checkoutItems,
    user?.id,
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
  ]);

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

    const orderData: orderInput = {
      existingOrderId: failedOrderIdRef.current || failedOrderId || undefined,
      status: "PENDING",
      userId: user?.id,
      fbc,
      fbp,
      ttpCookie,
      ttclidValue: ttclidValue || getTrackingValue("ttclid", searchParams),
      gclid: gclid || getTrackingValue("gclid", searchParams),
      li_fat_id: li_fat_id || getTrackingValue("li_fat_id", searchParams),
      gbraid: gbraid || getTrackingValue("gbraid", searchParams),
      wbraid: wbraid || getTrackingValue("wbraid", searchParams),
      dclid: dclid || getTrackingValue("dclid", searchParams),
      uuid: uuid || getTrackingValue("uuid", searchParams),
      msclkid: msclkid || getTrackingValue("msclkid", searchParams),
      fbclid: fbclid || getTrackingValue("fbclid", searchParams),
      twclid: twclid || getTrackingValue("twclid", searchParams),
      rdt_cid: rdt_cid || getTrackingValue("rdt_cid", searchParams),
      epik: epik || getTrackingValue("epik", searchParams),
      ScCid: ScCid || getTrackingValue("ScCid", searchParams),
      sccid: sccid || getTrackingValue("sccid", searchParams),
      qclid: qclid || getTrackingValue("qclid", searchParams),
      irclickid: irclickid || getTrackingValue("irclickid", searchParams),
      awc: awc || getTrackingValue("awc", searchParams),
      name: data.name,
      mobileNumber: data.mobileNumber,
      orderFor:data.orderFor,
      zilla: data.zilla,
      thana: data.thana,
      address: data.address,
      specialNote:data.specialNote,
      paymentMethod: selectedPayment,
      shippingMethod: selectedShipping.id,
      couponCode: appliedCoupon?.code ?? null,
      orderItems: checkoutItems.map((item) => {
        const variant = item.selectedUnit && item.unitLabel ? `${item.selectedUnit}${item.unitLabel}` : "default";

        return {
          productId: item.id,
          quantity: item.cartQuantity,
          variant,
        };
      }),
    };

    submitOrder(orderData);
  };

  if (orderResponse) return <InvoiceOrder order={orderResponse} />;

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cart & Shipping & Payment</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <CartItemList isLoading={true} checkoutItems={[]} />
            </div>
            <div className="p-8 border rounded-xl animate-pulse bg-muted/20 min-h-[300px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {securityBlock && (
        <CheckoutSecurityAlert
          message={securityBlock.message}
          blockedType={securityBlock.blockedType}
          expiresAt={securityBlock.expiresAt}
          whatsappNumber={businessInfo?.data?.whatsappNumber}
          customerCareNumber={businessInfo?.data?.customerCareNumber}
          onDismiss={() => setSecurityBlock(null)}
        />
      )}

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
            isSecurityBlocked={Boolean(securityBlock)}
          />
</div>
          </div>
    
      </div>

      {error && !securityBlock && (
        <p className="text-destructive text-sm font-medium">
          {error instanceof Error ? error.message : typeof error === "string" ? error : "An error occurred"}
        </p>
      )}
    </div>
  );
};
