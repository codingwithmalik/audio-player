import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode:false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default nextConfig;
