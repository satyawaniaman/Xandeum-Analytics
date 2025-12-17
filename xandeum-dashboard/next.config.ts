import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable turbopack (Next.js 16 default)
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.archbee.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Silence pino-pretty warning from @walletconnect dependencies (webpack only)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
    };
    return config;
  },
};

export default nextConfig;
