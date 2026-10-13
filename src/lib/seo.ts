import type { Metadata } from "next";

export const SEO_ORIGIN = "https://ritzmediaworld.com";

export const AGENCY_KEYWORDS = [
  "Best advertising agency in Delhi NCR",
  "Top Advertising Agency",
  "Advertising Agency in Delhi",
  "Best Advertising Agency in Delhi NCR",
  "Ads Agency in Delhi NCR",
  "Best ad agency in Delhi",
  "Best ad agency in Noida",
  "ad agency in Noida",
  "ad agency in Delhi",
  "ad agency in Delhi NCR",
  "Digital marketing agency",
  "Creative Agency",
  "Branding agency In Delhi",
  "Branding agency In Noida",
  "Branding agency In Delhi NCR",
  "Creative Advertising Agency",
  "Social Media Marketing Agency",
  "Content Marketing Agency",
  "Best Creative Advertising Agency",
  "Best marketing agency in India",
  "Creative service",
  "SEO company in noida",
  "Radio advertising agency",
  "Best ad agency",
  "Digital Marketing company",
  "Digital Marketing company in noida",
  "Digital Marketing company in Delhi",
  "digital marketing and creative agency",
  "Best digital marketing agency in Delhi",
  "Newspaper ad agency",
  "Top Marketing Agency in India",
  "creative digital marketing agency",
  "best seo services in noida",
  "best seo agency in greater noida",
];

type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
  path: string;
};

export function pageMetadata({ title, description, keywords, path }: PageSeo): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: `${SEO_ORIGIN}${path}` },
    robots: { index: true, follow: true },
    authors: [{ name: "Ritz Media World" }],
    publisher: "Ritz Media World",
  };
}
