"use client";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { dbOrder, dbOrderItem} from "@/types/type";
import { formatDate } from "@/lib/utils";
import { useProducts } from "@/hooks/use-products";
import { useRouter } from "next/navigation";
import { siteMeta } from "@/data";
import { dbProductwihtoutAll } from "@/actions/product";

interface Props {
  order: dbOrder;
  hideButton?: boolean;
}

export const InvoiceOrder = ({ order, hideButton = false }: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { data: products } = useProducts();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return { background: "#EAB308", color: "#fff" };
      case "PROCESSING": return { background: "#9333EA", color: "#fff" };
      case "SHIPPED": return { background: "#2563EB", color: "#fff" };
      case "NEARBY": return { background: "#F97316", color: "#fff" };
      case "COMPLETED": return { background: "#16A34A", color: "#fff" };
      case "RETURNED": return { background: "#4F46E5", color: "#fff" };
      case "CANCELLED": return { background: "#DC2626", color: "#fff" };
      default: return { background: "#6B7280", color: "#fff" };
    }
  };
  const handlePrint = () => {
    if (!invoiceRef.current) return;

    const logoSrc = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`;
    const img = new Image();
    img.src = logoSrc;

    img.onload = () => {
      const printContent = invoiceRef.current!.innerHTML;
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 12mm; margin: 0; color: #000; }
              table { width: 100%; border-collapse: collapse; page-break-inside: avoid; }
              th, td { border: 1px solid #000; padding: 8px; }
              th { background: #f9f9f9; }
              .no-print { display: none; }
              span { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @media print { 
                @page { size: A4 portrait; margin: 0; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);

      printWindow.document.close();
       printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();

      // Close print tab after print
      setTimeout(() => {
        printWindow.close();
      }, 500);
    };
    };
  }

  return (
    <div className="mt-8">
      <div
        id="invoice-printable"
        ref={invoiceRef}
        style={{
          backgroundColor: "#fff",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#000",
        }}
      >
     {/* BRAND HEADER */}
<div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
  {/* Logo container */}
  <div style={{ display: "inline-block", position: "relative", marginTop: "-40px" }}>
    <img
      src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`}
      alt={siteMeta.siteName}
      width={200}
      height={200}
      style={{ display: "block", margin: "12px auto" }}
    />
  </div>

  <p style={{ margin: "4px 0", fontSize: "12px", marginTop: "-52px" }}>
    KGC Building, 2nd Floor, Near Khagrachhari Gate, Khagrachhari Sadar
  </p>
  <p style={{ margin: "4px 0", fontSize: "12px" }}>
    Contact: +880 1519558558 | Website: {process.env.NEXT_PUBLIC_BASE_URL}
  </p>
</div>


        <hr style={{ margin: "16px 0" }} />

        {/* Invoice Header */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Invoice</h3>
            <p>Order No: <strong>{order.orderId}</strong></p>
            <p>Order placed on: {formatDate(new Date(order.createdAt))}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              Order Status:{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  backgroundColor: getStatusColor(order.status).background,
                  color: getStatusColor(order.status).color,
                  borderRadius: "4px",
                  fontWeight: "bold",
                  marginLeft: "2px",
                  WebkitPrintColorAdjust: "exact",
                 printColorAdjust: "exact",
                }}
              >
                {order.status}
              </span>
            </p>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>Customer</h4>
            <p style={{ fontWeight: "bold" }}>{order.name}</p>
            <p>{order.mobileNumber}</p>
            <p>{order.address}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>Payment</h4>
            <p>Method: <strong>{order.paymentMethod?.toUpperCase()}</strong></p>
            <p>
              Status:{" "}
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  backgroundColor: order.isPaid ? "#16A34A" : "#DC2626",
                  color: "#fff",
                   WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                }}
              >
                {order.isPaid ? "PAID" : "UNPAID"}
              </span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <h4 style={{ fontWeight: "bold", marginBottom: "12px" }}>Order Items</h4>
        <div style={{ overflowX: "auto", marginBottom: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9f9f9" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Package</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Discount</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Qty</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems?.map((item: dbOrderItem) => {
                const product = products?.data.find((p: dbProductwihtoutAll) => p.id === item.productId);
                if (!product) return null;
                const subtotal = (product.discountPrice || product.price) * item.quantity;
                const discountAmount = product.discountPrice ? (product.price - product.discountPrice) * item.quantity : 0;
                return (
                  <tr key={item.productId}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.packageQuantity} {product.packageQuantityType}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>BDT {product.price}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "#16a34a" }}>{discountAmount > 0 ? `BDT -${discountAmount}` : "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>BDT {subtotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "30%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Discount:</span>
              <span style={{ color: "#16a34a" }}>BDT -{order.totalDiscount || 0}</span>
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "14px" }}>
              <span>Total:</span>
              <span>BDT {order.total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "12px", color: "#666" }}>
          <p>Thank you for shopping with <strong>{siteMeta.siteName}</strong></p>
          <p>For support, contact: support@hillora.com</p>
        </div>
      </div>

      {!hideButton && (
        <div className="flex flex-col-reverse md:flex-row items-center gap-4 mt-4 no-print">
          <Button variant="outline" onClick={() => router.push("/")}>Continue Shopping</Button>
          <Button onClick={handlePrint}>Print Invoice</Button>
        </div>
      )}
    </div>
  );
};
