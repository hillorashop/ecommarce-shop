import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    // Remove console.log in production (keep errors and warnings)
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  images: {
    // Serve modern AVIF/WebP formats automatically
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn.hillorabd.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // Tree-shake large packages to only import what is used
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-slider",
      "@radix-ui/react-separator",
      "@radix-ui/react-avatar",
      "@radix-ui/react-label",
      "@radix-ui/react-progress",
      "@radix-ui/react-slot",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // puppeteer and chromium are ONLY used in /api/invoice (server-side).
      // Exclude them from the client bundle to avoid massive bloat.
      config.resolve.alias = {
        ...config.resolve.alias,
        "puppeteer-core": false,
        puppeteer: false,
        "@sparticuz/chromium": false,
      };
    }
    return config;
  },
};

export default nextConfig;
