"use client";

import React from "react";
import { AlertCircle, Ban, Clock, PhoneCall, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface CheckoutSecurityAlertProps {
  message: string;
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
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : null;

  return (
    <div className="w-full bg-red-50 border-2 border-red-200 dark:bg-red-950/40 dark:border-red-900 rounded-xl p-4 sm:p-5 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3.5">
        <div className="size-10 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
          <Ban className="size-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-red-900 dark:text-red-200 flex items-center gap-1.5">
              <span>অর্ডার গ্রহণ করা সম্ভব হচ্ছে না (নিরাপত্তা জনিত কারণে সাময়িক স্থগিত)</span>
            </h4>
          </div>

          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium">
            {message}
          </p>

          {formattedExpiry && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100/80 dark:bg-red-900/50 text-red-800 dark:text-red-200 text-xs font-semibold rounded-md">
              <Clock className="size-3.5" />
              <span>মেয়াদ শেষ হবে: {formattedExpiry}</span>
            </div>
          )}

          <div className="pt-2 border-t border-red-200/80 dark:border-red-900/60 flex flex-wrap items-center gap-2.5">
            <span className="text-xs text-red-700/80 dark:text-red-400 font-medium">
              জরুরি সহায়তার জন্য আমাদের কাস্টমার কেয়ারে যোগাযোগ করুন:
            </span>

            {whatsappNumber && (
              <a
                href={`https://wa.me/+88${whatsappNumber}?text=${encodeURIComponent("হ্যালো, চেকআউটে আমার অর্ডার ব্লক দেখাচ্ছে। দয়া করে চেক করবেন?")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#003B3A] hover:bg-[#003B3A]/90 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <FaWhatsapp className="size-3.5" />
                WhatsApp সাপোর্ট
              </a>
            )}

            {customerCareNumber && (
              <a
                href={`tel:${customerCareNumber}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <PhoneCall className="size-3.5" />
                কল করুন ({customerCareNumber})
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

