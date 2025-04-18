import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "upload.wikimedia.org",
      "cdn.britannica.com",
      "www.artble.com",
      "historiek.net",
      "moaonline.org",
      "www.artic.edu"
    ],
  },
};

export default nextConfig;
