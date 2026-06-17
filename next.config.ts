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
      },{
        protocol: "https",
        hostname:"picsum.photos"
      }
    ],
  },
};

export default nextConfig;
