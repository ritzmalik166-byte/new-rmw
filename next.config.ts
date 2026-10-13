import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/about.html", permanent: true },
      { source: "/work", destination: "/portfolio", permanent: true },
    ];
  },
  async rewrites() {
    return [{ source: "/about.html", destination: "/about" }];
  },
};

export default nextConfig;
