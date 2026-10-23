import type { Blog } from "@/lib/blogs";
import { extractFaqsFromHtml, htmlToText } from "@/lib/blog-faq";
import { SEO_ORIGIN } from "@/lib/seo";

export type Crumb = { name: string; path: string };

const ORGANIZATION = {
  "@type": "Organization",
  name: "Ritz Media World",
  url: SEO_ORIGIN,
  logo: { "@type": "ImageObject", url: `${SEO_ORIGIN}/logo.png` },
};

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SEO_ORIGIN}${crumb.path}`,
    })),
  };
}

export function articleJsonLd(blog: Blog, isCaseStudy: boolean) {
  const pageUrl = `${SEO_ORIGIN}/${blog.slug}`;
  const bodyText = htmlToText(blog.content);
  const keywords = blog.keywords
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    headline: blog.title,
    description: blog.excerpt || bodyText.slice(0, 160) || undefined,
    image: blog.image ? [blog.image] : undefined,
    datePublished: blog.createdAt ?? undefined,
    dateModified: blog.updatedAt ?? blog.createdAt ?? undefined,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    articleSection: isCaseStudy ? "Case Study" : "Blog",
    wordCount: bodyText ? bodyText.split(" ").length : undefined,
    inLanguage: "en",
  };
}

export function blogFaqJsonLd(blog: Blog) {
  const faqs = extractFaqsFromHtml(blog.content);
  if (!faqs.length) return null;

  const pageUrl = `${SEO_ORIGIN}/${blog.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    url: pageUrl,
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
