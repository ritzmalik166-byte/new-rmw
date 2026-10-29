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
      { source: "/contact", destination: "/contact.html", permanent: true },
      { source: "/work", destination: "/portfolio", permanent: true },
      { source: "/services/seo", destination: "/services/digital-marketing", permanent: true },
      { source: "/component/influencer-marketing", destination: "/portfolio/influencer-marketing-videos", permanent: true },
      ...[
        ["", ""],
        ["/brand-identity", "/brand-identity"],
        ["/logo", "/brand-identity"],
        ["/creatives-and-ai-videos", "/creative"],
        ["/websites-and-landing-pages", "/web-design"],
      ].map(([from, to]) => ({
        source: `/work/portfolio${from}`,
        destination: `/portfolio${to}`,
        permanent: true,
      })),
      {
        source: "/services/:service(contents-marketing|content-marketing)/content-marketing",
        destination: "/services/content-marketing/customized-content-strategy",
        permanent: true,
      },
      { source: "/services/contents-marketing/:sub*", destination: "/services/content-marketing/:sub*", permanent: true },
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
