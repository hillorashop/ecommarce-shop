"use client";

import { useCustomQuery } from "@/hooks/use-query";
import { getBusinessInfo, BusinessResponse } from "@/actions/business-info";
import React, { useState } from "react";
import {
  WhatsAppSvg,
  MessengerSvg,
  PhoneSvg,
  MessageIcon,
  BRAND_COLORS,
} from "@/components/social-icons";

const ICONS = (whatsappNumber?: string, messengerUsername?: string, customerCareNumber?: string) => [
  {
    id: "whatsapp",
    href: `https://wa.me/+88${whatsappNumber}?text=${encodeURIComponent("হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।")}`,
    label: "WhatsApp",
    bg: BRAND_COLORS.whatsapp,
  },
  {
    id: "messenger",
    href: `https://m.me/${messengerUsername}?ref=order_now`,
    label: "Messenger",
    bg: BRAND_COLORS.messenger,
  },
  {
    id: "phone",
    href: `tel:${customerCareNumber}`,
    label: "Phone",
    bg: BRAND_COLORS.phone,
  },
];

export const FloatingContactIcons: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: businessInfo } = useCustomQuery<BusinessResponse>(
    ["business-info"],
    () => getBusinessInfo()
  );

  const icons = ICONS(
    businessInfo?.data?.whatsappNumber!,
    businessInfo?.data?.messengerUsername!,
    businessInfo?.data?.customerCareNumber!
  );

  const renderGlyph = (id: string) => {
    switch (id) {
      case "whatsapp":
        return <WhatsAppSvg size={40} />;
      case "messenger":
        return <MessengerSvg size={40} />;
      case "phone":
        return (
          <span className="relative z-10 flex items-center justify-center">
            <PhoneSvg />
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .float-btn {
          animation: float 3s ease-in-out infinite;
        }
        .float-btn:hover {
          animation: none;
        }
        @keyframes floatItem {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .float-item {
          animation: floatItem 3s ease-in-out infinite;
        }
        .float-item:nth-child(1) { animation-delay: 0s; }
        .float-item:nth-child(2) { animation-delay: 0.3s; }
        .float-item:nth-child(3) { animation-delay: 0.6s; }
      `}</style>

      <div
        role="complementary"
        aria-label="Contact options"
        className="fixed bottom-20 md:bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
      >
        {/* Contact icons list */}
        <div
          aria-hidden={!isOpen}
          className={`flex flex-col-reverse items-end gap-3 transition-all duration-300 origin-bottom-right ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-75 translate-y-4 pointer-events-none"
          }`}
        >
          {icons.map(({ id, href, label, bg }) => (
            <div key={id} className={`relative flex items-center ${isOpen ? "float-item" : ""}`}>
              <a
                href={href}
                target={id === "phone" ? undefined : "_blank"}
                rel={id === "phone" ? undefined : "noopener noreferrer"}
                aria-label={`Contact via ${label}`}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 no-underline ${
                  id === "phone" ? "bg-blue-600 hover:bg-blue-700" : ""
                } ${hoveredId === id ? "scale-110 shadow-xl" : "scale-100 shadow-md"}`}
              >
                <span className="relative z-10 flex items-center justify-center w-full h-full rounded-full overflow-hidden">
                  {renderGlyph(id)}
                </span>

                {/* Pulsing ring animation, matching MobileHeader style */}
                <div
                  className="absolute inset-1 border rounded-full animate-ping duration-200 pointer-events-none"
                  style={{ borderColor: bg }}
                />
                <div
                  className="absolute -inset-0.5 border rounded-full animate-ping duration-100 pointer-events-none"
                  style={{ borderColor: bg }}
                />
              </a>

              {/* Tooltip */}
              <div
                role="tooltip"
                className={`absolute right-[52px] top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none transition-opacity duration-150 font-sans ${
                  hoveredId === id ? "opacity-100" : "opacity-0"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>


        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close contact options" : "Open contact options"}
          aria-expanded={isOpen}
          className={`w-10 h-10 rounded-full bg-primary text-white border-none cursor-pointer flex items-center justify-center shadow-xl transition-all duration-300 flex-shrink-0 relative z-10 ${
            !isOpen ? "float-btn" : ""
          }`}
        >
          <MessageIcon isOpen={isOpen} />
        </button>
      </div>
    </>
  );
};