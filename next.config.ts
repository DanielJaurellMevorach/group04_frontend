import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      "cloudnativeproject.blob.core.windows.net",
      "https://cloudnativeproject.blob.core.windows.net",
      "https://cloudnativeproject.blob.core.windows.net/image",
      "https://cloudnativeproject.blob.core.windows.net/image/",
    ],
  },
  
};

export default nextConfig;
 