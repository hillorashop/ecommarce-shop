"use client";

import { useBusinessInfo } from "@/hooks/use-business-info";
import Image from "next/image";
import React, { useState } from "react";

const MessageIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 24 24"
    fill="#fff"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}
  >
    {isOpen ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
     <>

    <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9c0 1.9.6 3.7 1.6 5.2L3 21l3.8-1.6A9 9 0 0 0 12 21a9 9 0 0 0 9-9z" />

<line x1="8" y1="10" x2="16" y2="10" stroke="#d4a017" strokeWidth={1.5} strokeLinecap="round" />
<line x1="8" y1="13" x2="16" y2="13" stroke="#d4a017" strokeWidth={1.5} strokeLinecap="round" />
<line x1="8" y1="16" x2="13" y2="16" stroke="#d4a017" strokeWidth={1.5} strokeLinecap="round" />
  </>
    )}
  </svg>
);

const PhoneSvg = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const ICONS = (whatsappNumber?: string, messengerUsername?: string, customerCareNumber?: string) => [
  {
    id: "whatsapp",
    href: `https://wa.me/+88${whatsappNumber}?text=${encodeURIComponent("হ্যালো, আমি একটি পণ্য অর্ডার করতে চাই।")}`,
    img: "/icons/whatsapp.svg",
    label: "WhatsApp",
  },
  {
    id: "messenger",
    href: `https://m.me/${messengerUsername}?ref=order_now`,
    img: "/icons/messenger.svg.webp",
    label: "Messenger",
  },
  {
    id: "phone",
    href: `tel:${customerCareNumber}`,
    img: null,
    label: "Phone",
  },
];

export const FloatingContactIcons: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: businessInfo } = useBusinessInfo();

  const icons = ICONS(
    businessInfo?.data?.whatsappNumber!,
    businessInfo?.data?.messengerUsername!,
    businessInfo?.data?.customerCareNumber!
  );

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
          className={`flex flex-col items-end gap-3 transition-all duration-300 origin-bottom-right ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-75 translate-y-4 pointer-events-none"
          }`}
        >
          {icons.map(({ id, href, img, label }) => (
            <div key={id} className={`relative flex items-center ${isOpen ? "float-item" : ""}`}>
              <a
                href={href}
                target={id === "phone" ? undefined : "_blank"}
                rel={id === "phone" ? undefined : "noopener noreferrer"}
                aria-label={`Contact via ${label}`}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0 no-underline ${
                  id === "phone" ? "w-10 h-10 bg-blue-600 hover:bg-blue-700" : "w-fit h-fit"
                } ${hoveredId === id ? "scale-110 shadow-xl" : "scale-100 shadow-md"}`}
              >
                {img ? (
                  <Image
                    src={img}
                    alt={label}
                    width={38}
                    height={38}
                    className="object-contain block rounded-full"
                  />
                ) : (
                  <PhoneSvg />
                )}
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