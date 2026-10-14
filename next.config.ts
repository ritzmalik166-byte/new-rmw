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
      { source: "/services/seo", destination: "/services/digital-marketing", permanent: true },
      ...[
        ["web-development", "web-designing-and-development"],
        ["influencer-marketing", "influencer-marketing-agency-in-india"],
        ["3d-rendering-services", "3d-rendering"],
      ].map(([from, to]) => ({
        source: `/services/${from}/:sub*`,
        destination: `/services/${to}/:sub*`,
        permanent: true,
      })),
    ];
  },
  async rewrites() {
    return [{ source: "/about.html", destination: "/about" }];
  },
};

export default nextConfig;
