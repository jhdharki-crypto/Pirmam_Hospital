import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      /* Vercel Blob storage URLs */
      {
        protocol: "https",
        hostname: "**.blob.vercel-storage.com",
      },
      /* Public uploads in production */
      {
        protocol: "https",
        hostname: "**.vercel.app",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
