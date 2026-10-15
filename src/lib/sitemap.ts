import { getBlogsOrEmpty, normalizeImage } from "@/lib/blogs";
import { loadCaseStudyList } from "@/lib/case-studies";
import { PORTFOLIO_DETAILS } from "@/lib/portfolio-pages";
import { SEO_ORIGIN } from "@/lib/seo";
import { getAllServices } from "@/lib/services-data";
import { SITEMAP_EXCLUDED_CATEGORIES, SITEMAP_EXCLUDED_TAGS } from "@/lib/sitemap-exclusions";
import { SUB_SERVICES, subServiceHref } from "@/lib/sub-services-data";
import { getCategories, getCategoryPosts, getTagIndex } from "@/lib/taxonomy";

export const SITEMAP_INDEX_FILES = [
  "sitemap-0.xml",
  "page-sitemap.xml",
  "post-sitemap.xml",
  "images-sitemap.xml",
];

const URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">';

/* Blog API slugs that collide with real pages or retired legacy routes. */
const EXCLUDED_POST_SLUGS = new Set([
  "blog",
  "blogs",
  "contact",
  "contact-us",
  "about.html",
  "new-home",
  "tags",
  "tags2",
  "category2",
  "web-stories",
  "best-content-marketing-agency-delhi-ncr",
  "career2",
  "discussion-forum",
]);

export type SitemapImage = { url: string; title?: string };
export type SitemapEntry = { path: string; priority: number; images?: SitemapImage[] };

type Post = { path: string; title: string; image: string | null };

export function getStaticPagePaths() {
  return [
    "/",
    "/about.html",
    "/blog",
    "/career",
    "/contact",
    "/case-study",
    "/services",
    "/portfolio",
    "/tags",
    ...PORTFOLIO_DETAILS.map((detail) => `/portfolio/${detail.slug}`),
  ];
}

/* Only listings that render (i.e. have posts) are published; the exclusion lists
   carry over the thin or off-topic tags the previous sitemap left out. */
export async function getTaxonomyPaths() {
  const [categories, tagIndex] = await Promise.all([getCategories(), getTagIndex()]);
  const populated = await Promise.all(
    categories
      .filter((category) => !SITEMAP_EXCLUDED_CATEGORIES.has(category.slug))
      .map(async (category) => ((await getCategoryPosts(category.slug)).length > 0 ? category.slug : null)),
  );

  return [
    ...populated.flatMap((slug) => (slug ? [`/category/${slug}`] : [])),
    ...[...tagIndex.keys()].filter((slug) => !SITEMAP_EXCLUDED_TAGS.has(slug)).map((slug) => `/tags/${slug}`),
  ].sort();
}

export function getServicePaths() {
  return [
    ...getAllServices().map((service) => `/services/${service.slug}`),
    ...SUB_SERVICES.map(subServiceHref),
  ];
}

/* Blog posts and case studies share the root `/[slug]` route. */
export async function getPosts(): Promise<Post[]> {
  const [blogs, caseStudies] = await Promise.all([
    getBlogsOrEmpty(),
    loadCaseStudyList().catch((error) => {
      console.error("Sitemap: unable to load case studies:", error);
      return [];
    }),
  ]);

  const posts = new Map<string, Post>();
  const add = (slug: string, title: string, image: string | null) => {
    const cleaned = slug.trim().replace(/^\/+|\/+$/g, "");
    const key = cleaned.toLowerCase();
    if (!cleaned || EXCLUDED_POST_SLUGS.has(key) || posts.has(key)) return;
    posts.set(key, { path: `/${cleaned}`, title, image });
  };

  for (const blog of blogs) add(blog.slug, blog.title, blog.image);
  for (const study of caseStudies) {
    add(study.slug, study.title, study.image ? normalizeImage(study.image) : null);
  }

  return [...posts.values()];
}

export function getSubServiceImageEntries(): SitemapEntry[] {
  return SUB_SERVICES.map((sub) => ({
    path: subServiceHref(sub),
    priority: 0.6,
    images: sub.sections.map((section) => ({ url: `${SEO_ORIGIN}${section.image}`, title: section.title })),
  }));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toLoc(path: string) {
  return escapeXml(path === "/" ? SEO_ORIGIN : `${SEO_ORIGIN}${encodeURI(path)}`);
}

function imageXml({ url, title }: SitemapImage) {
  const titleXml = title ? `<image:title>${escapeXml(title)}</image:title>` : "";
  return `<image:image><image:loc>${escapeXml(encodeURI(url))}</image:loc>${titleXml}</image:image>`;
}

export function renderUrlset(entries: SitemapEntry[], lastmod: string) {
  const seen = new Set<string>();
  const urls = entries.flatMap(({ path, priority, images = [] }) => {
    if (seen.has(path)) return [];
    seen.add(path);
    return [
      `<url><loc>${toLoc(path)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority>${images.map(imageXml).join("")}</url>`,
    ];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n${URLSET_OPEN}\n${urls.map((url) => `${url}\n`).join("")}</urlset>`;
}

export function renderSitemapIndex(lastmod: string) {
  const sitemaps = SITEMAP_INDEX_FILES.map(
    (file) => `  <sitemap>\n    <loc>${SEO_ORIGIN}/${file}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
