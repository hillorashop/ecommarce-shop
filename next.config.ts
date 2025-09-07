import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.MEDIA_HOST_NAME!, // e.g., your CDN or backend
      },
      {
        protocol: "https",
        hostname: process.env.GOOGLE_IMAGE_HOST_NAME || "lh3.googleusercontent.com",
      },
    ],
  },
  
};

export default nextConfig;
