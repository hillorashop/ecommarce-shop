"use client";

import React from "react";
import { ShieldAlert, Clock, PhoneCall, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface CheckoutSecurityAlertProps {
  message?: string;
  blockedType?: "IP" | "PHONE";
  expiresAt?: string | null;
  whatsappNumber?: string | null;
  customerCareNumber?: string | null;
  onDismiss?: () => void;
}

export const CheckoutSecurityAlert: React.FC<CheckoutSecurityAlertProps> = ({
  message,
  blockedType,
  expiresAt,
  whatsappNumber,
  customerCareNumber,
  onDismiss,
}) => {
  const formattedExpiry = expiresAt
    ? new Date(expiresAt).toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : null;

  const cleanWhatsapp = whatsappNumber?.replace(/\D/g, "") || "";
  const whatsappUrl = cleanWhatsapp
    ? `https://wa.me/${cleanWhatsapp.startsWith("88") ? cleanWhatsapp : `88${cleanWhatsapp}`}?text=${encodeURIComponent(
        "হ্যালো Hillora সাপোর্ট, চেকআউটে আমার অর্ডার ব্লক দেখাচ্ছে। দয়া করে এটি পরীক্ষা করবেন?"
      )}`
    : null;

  // Filter out any internal admin messages (e.g. "Manually blocked by Admin") and always provide customer-friendly text
  const isInternalAdminNote =
    !message ||
    message.toLowerCase().includes("manually blocked") ||
    message.toLowerCase().includes("auto-blocked") ||
    message.toLowerCase().includes("admin") ||
    message.toLowerCase().includes("system_auto");

  const displayMessage = isInternalAdminNote
    ? blockedType === "IP"
      ? "নিরাপত্তা যাচাইয়ের কারণে আপনার বর্তমান ইন্টারনেট সংযোগ (IP) থেকে অর্ডার সাময়িক স্থগিত রাখা হয়েছে। আপনার যদি কোনো প্রশ্ন থাকে, অনুগ্রহ করে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন। (Order placement from this IP address is temporarily on hold for security reasons. Please contact customer support.)"
      : "নিরাপত্তা যাচাইয়ের কারণে আপনার এই মোবাইল নম্বরটি থেকে অর্ডার সাময়িক স্থগিত রাখা হয়েছে। আপনার যদি কোনো প্রশ্ন থাকে, অনুগ্রহ করে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন। (Order placement from this phone number is temporarily on hold for security reasons. Please contact customer support.)"
    : message;

  return (
    <div
      role="alert"
      className="w-full bg-card border border-border shadow-md rounded-xl p-4 sm:p-5 transition-all animate-in fade-in slide-in-from-top-2 duration-300 mb-6 text-card-foreground"
    >
      <div className="flex items-start gap-3.5">
        <div className="size-10 rounded-xl bg-[#003B3A]/10 text-[#003B3A] flex items-center justify-center shrink-0 mt-0.5 border border-[#003B3A]/20">
          <ShieldAlert className="size-5" />
        </div>

        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-bold text-foreground">
                  অর্ডার প্রক্রিয়া সাময়িক স্থগিত
                </h4>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#003B3A]/10 text-[#003B3A] border border-[#003B3A]/25 font-semibold">
                  Order On Hold
                </span>
                {blockedType && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium border border-border">
                    {blockedType === "PHONE" ? "মোবাইল নম্বর (Phone)" : "আইপি এড্রেস (IP Address)"}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-normal mt-0.5">
                Security verification: order placement is temporarily restricted.
              </p>
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                title="Dismiss"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed font-normal">
            {displayMessage}
          </p>

          {formattedExpiry && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/80 text-muted-foreground text-xs font-medium rounded-lg border border-border">
              <Clock className="size-3.5" />
              <span>মেয়াদ শেষ হবে: {formattedExpiry} (স্বয়ংক্রিয়ভাবে আনব্লক হবে)</span>
            </div>
          )}

          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-foreground font-medium">
              সহায়তার জন্য যোগাযোগ করুন (Customer Care):
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[#003B3A] hover:bg-[#002f2e] text-white px-3.5 py-2 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <FaWhatsapp className="size-4" />
                  WhatsApp সাপোর্ট
                </a>
              )}

              {customerCareNumber && (
                <a
                  href={`tel:${customerCareNumber}`}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-2 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                >
                  <PhoneCall className="size-4" />
                  কল করুন: {customerCareNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

