import React from "react";



export interface IconProps {
  size?: number;
  className?: string;
}

/** Facebook — blue circle badge with white "f" glyph */
export const FacebookSvg: React.FC<IconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    aria-hidden="true"
    className={className}
  >
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path
      fill="#fff"
      d="M26.6 25.5h3.4l.53-4h-3.93v-2.3c0-1.15.32-1.94 1.97-1.94h2.1v-3.58A28.7 28.7 0 0 0 27.6 13.5c-2.98 0-5.03 1.82-5.03 5.16v2.84h-3.37v4h3.37v10.5h4.03V25.5Z"
    />
  </svg>
);

/** WhatsApp — green circle badge with white phone/chat glyph */
export const WhatsAppSvg: React.FC<IconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    aria-hidden="true"
    className={className}
  >
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path
      fill="#fff"
      d="M24.02 12c-6.63 0-12.02 5.39-12.02 12.02 0 2.12.56 4.19 1.62 6.02L12 36l6.13-1.6a12 12 0 0 0 5.89 1.55h.01c6.63 0 12.02-5.39 12.02-12.02S30.65 12 24.02 12Zm0 21.98h-.01a9.94 9.94 0 0 1-5.06-1.39l-.36-.21-3.64.95.97-3.55-.24-.37a9.96 9.96 0 0 1-1.53-5.39c0-5.51 4.49-10 10-10 2.67 0 5.18 1.04 7.07 2.93a9.93 9.93 0 0 1 2.92 7.07c0 5.51-4.49 9.96-10.12 9.96Zm5.48-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
    />
  </svg>
);

/** Messenger — rounded circle badge (matches WhatsApp/Facebook style), solid blue with centered white bolt glyph */
export const MessengerSvg: React.FC<IconProps> = ({ size = 32, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    aria-hidden="true"
    className={className}
  >
    {/* Full circle badge, solid blue */}
    <circle cx="256" cy="256" r="256" fill="#0084FF" />
    {/* Bolt glyph, centered, solid white */}
    <path
      fill="#fff"
      d="M405.79 193.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z"
    />
  </svg>
);

/** Phone glyph — plain white phone handset icon (no background, meant to sit on a colored button) */
export const PhoneSvg: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="white"
    aria-hidden="true"
    className={className}
  >
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

/** Chat bubble / close toggle icon used by the floating contact launcher button */
export const MessageIcon: React.FC<{ isOpen: boolean; size?: number; className?: string }> = ({
  isOpen,
  size = 28,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#fff"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
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




/** Brand colors, kept alongside the icons so ping-ring borders always match the glyph */
export const BRAND_COLORS = {
  facebook: "#1877F2",
  whatsapp: "#25D366",
  messenger: "#0084FF",
  phone: "#2563eb",
} as const;