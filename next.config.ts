import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next/image only optimizes remote images from hosts you allowlist here.
  // We use DiceBear to generate an avatar from the user's name.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.dicebear.com" }],
  },
};

export default nextConfig;
