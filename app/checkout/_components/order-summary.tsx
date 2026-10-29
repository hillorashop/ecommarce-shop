"use client";

interface OrderSummaryProps {
  subTotal: number;
  totalDiscount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingLabel: string;
  shippingCost: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subTotal,
  totalDiscount,
  couponCode,
  couponDiscount,
  shippingLabel,
  shippingCost,
  total,
}) => {
  return (
    <div className="space-y-1  text-sm font-semibold shadow-lg border p-4 rounded-xl">
      <div className="flex justify-between ">
        <span>Sub Total:</span>
        <span>BDT {subTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between  text-[#003B3A]">
        <span>Total Discount:</span>
        <span>- BDT {totalDiscount.toLocaleString()}</span>
      </div>
      {couponDiscount > 0 && (
        <div className="flex justify-between  text-[#003B3A]">
          <span>Coupon ({couponCode}):</span>
          <span>- BDT {couponDiscount.toLocaleString()}</span>
        </div>
      )}
      <div className="flex justify-between ">
        <span>Shipping ({shippingLabel}):</span>
        <span>BDT {shippingCost.toLocaleString()}</span>
      </div>
      <div className="flex justify-between   border-t pt-2">
        <span>Total:</span>
        <span>BDT {total.toLocaleString()}</span>
      </div>
    </div>
  );
};