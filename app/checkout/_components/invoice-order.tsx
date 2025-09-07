"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { dbOrder, dbOrderItem, dbProduct } from "@/types/type";
import { formatDate } from "@/lib/utils";
import { useProducts } from "@/hooks/use-products";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { siteMeta } from "@/data";

interface Props {
  order: dbOrder;
  hideButton?:boolean;
}

export const InvoiceOrder = ({ order, hideButton=false }: Props) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { data: products } = useProducts();
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getStatusColor = (status: string) => {
 switch (status) {
  case "PENDING":
    return { background: "#EAB308", color: "#fff" }; // 🟡 Yellow-500
  case "PROCESSING":
    return { background: "#9333EA", color: "#fff" }; // 🟣 Purple-500
  case "SHIPPED":
    return { background: "#2563EB", color: "#fff" }; // 🔵 Blue-600
  case "NEARBY":
    return { background: "#F97316", color: "#fff" }; // 🟠 Orange-500
  case "COMPLETED":
    return { background: "#16A34A", color: "#fff" }; // 🟢 Green-600
  case "RETURNED":
    return { background: "#4F46E5", color: "#fff" }; // 🟦 Indigo-500
  case "CANCELLED":
    return { background: "#DC2626", color: "#fff" }; // 🔴 Red-600
  default:
    return { background: "#6B7280", color: "#fff" }; // ⚪ Gray-500
}
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      if (!invoiceRef.current) return;

    const htmlContent = invoiceRef.current.outerHTML;

    const res = await fetch(`/api/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlContent, fileName: `invoice-${order.id}.pdf` }),
    });

    if (!res.ok) return alert("Failed to generate PDF");

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Something is wrong to download PDF")
    }finally{
      setIsLoading(false)
    }

  };

  return (
    <div style={{fontFamily: "Arial, sans-serif" }} className="mt-8">
      {/* INVOICE FULL PAGE */}
      <div
        ref={invoiceRef}
        style={{
          backgroundColor: "#fff",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "12px",
          color: "#000",
        }}
      >
        {/* BRAND HEADER */}
        <div style={{ textAlign: "center", marginBottom: "10px", display:"flex", flexDirection:"column", alignItems:"center"  }}>
          <img src={`${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`} alt={siteMeta.siteName} width={120} height={120} style={{ marginBottom: "12px" }} />
          <p style={{ margin: "4px 0", fontSize: "12px" }}>KGC Building, 2nd Floor, Near Khagrachhari Gate, Khagrachhari Sadar</p>
          <p style={{ margin: "4px 0", fontSize: "12px" }}>📞 +880 1519558558 | 🌐 www.yourshop.com</p>
        </div>

        <hr style={{ margin: "16px 0" }} />

        {/* INVOICE HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px" }}>Invoice</h3>
            <p style={{ margin: "4px 0" }}>Order No: <strong>{order.id}</strong></p>
            <p style={{ margin: "4px 0" }}>Date: {formatDate(new Date(order.createdAt))}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              Order Status: 
            <span
              style={{
                display: "inline-block",
                padding: "4px 8px",
                backgroundColor: getStatusColor(order.status).background,
                color: getStatusColor(order.status).color,
                borderRadius: "4px",
                fontWeight: "bold",
                marginLeft:"2px"
              }}
            >
              {order.status}
            </span>
              </p>
          </div>
        </div>

        {/* CUSTOMER & PAYMENT INFO */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>Customer</h4>
            <p>{order.name}</p>
            <p>{order.mobileNumber}</p>
            <p>{order.address}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "6px" }}>Payment</h4>
            <p>Method: <strong>{order?.paymentMethod?.toUpperCase()}</strong></p>
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
                }}
              >
                {order.isPaid ? "PAID" : "UNPAID"}
              </span>
            </p>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <h4 style={{ fontWeight: "bold", marginBottom: "12px" }}>Order Items</h4>
        <div style={{ overflowX: "auto", marginBottom: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse"}}>
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
            {order?.orderItems?.map((item: dbOrderItem) => {
              const product = products?.data.find((p: dbProduct) => p.id === item.productId);
              if (!product) return null;

              const subtotal = (product.discountPrice || product.price) * item.quantity;
              const discountAmount = product.discountPrice ? (product.price - product.discountPrice) * item.quantity : 0;

              return (
                <tr key={item.productId}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.packageQuantity} {" "}  {product.packageQuantityType}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>BDT {product.price}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px", color: "#16a34a" }}>
                    {discountAmount > 0 ? `BDT -${discountAmount}` : "-"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold" }}>BDT {subtotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        {/* TOTAL */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "30%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Discount:</span>
              <span style={{color:"#16a34a"}}>BDT -{order.totalDiscount || 0}</span>
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "14px" }}>
              <span>Total:</span>
              <span>BDT {order.total}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: "40px", textAlign: "center", fontSize: "12px", color: "#666" }}>
          <p>Thank you for shopping with <strong>${siteMeta.siteName}</strong></p>
          <p>For support, contact: support@yourshop.com</p>
        </div>
      </div>

        {/* Control Buttons */}
        {!hideButton &&   <div className="flex flex-col-reverse md:flex-row items-center gap-4 mt-4">
        <Button variant="outline" onClick={() => router.push("/")}>Continue Shopping</Button>
        <Button onClick={handleDownload}>
          {isLoading ? (
                <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 animate-spin" />
                       Downloading...
                      </div>
          ) : " Download PDF"}
         
          </Button>
      </div>}
    

    </div>
  );
};
