import { fetchJson, getBlogPost, getBlogsOrEmpty, normalizeImage } from "@/lib/blogs";

const CASE_STUDY_LIST_URL = "https://www.ritzmediaworld.com/api/category/case-study";

export type CaseStudy = {
  slug: string;
  title: string;
  image: string | null;
  excerpt: string;
  keywords: string;
  createdAt: string | null;
  year: string | null;
};

export type CaseStudyReport = {
  id: string;
  region: string;
  title: string;
  label: string;
  summary: string;
  period: string;
  pages: number;
};

export const CASE_STUDY_REPORTS: CaseStudyReport[] = [
  {
    id: "outer-ring",
    region: "NCR Periphery",
    title: "The Outer Ring Report",
    label: "NCR Periphery Outlook",
    summary:
      "The Ring Awakens: Infrastructure, Premiumisation and the Next Wave of North India's Real Estate Story.",
    period: "Mid-Year 2026",
    pages: 13,
  },
  {
    id: "noida",
    region: "Noida",
    title: "Noida Luxury Outlook",
    label: "Market Intelligence Report",
    summary:
      "Beyond the Affordable Tag: How Infrastructure, Wealth and a New Buyer Are Re-Rating Noida's Real Estate Market.",
    period: "Mid-Year 2026",
    pages: 12,
  },
  {
    id: "gurgaon",
    region: "Gurgaon",
    title: "Gurgaon Luxury Outlook",
    label: "Market Intelligence Report",
    summary:
      "India's Most Mature Luxury Market and What Comes Next: Corridors, Circle Rates, and the Capital.",
    period: "Mid-Year 2026",
    pages: 13,
  },
  {
    id: "ghaziabad",
    region: "Ghaziabad",
    title: "Ghaziabad Luxury Outlook",
    label: "Market Intelligence Report",
    summary:
      "Gateway Reimagined: Infrastructure, National Developers and a New Buyer Class Are Writing Ghaziabad's First Luxury Chapter.",
    period: "Mid-Year 2026",
    pages: 13,
  },
  {
    id: "north-india",
    region: "North India",
    title: "North India Market Trends",
    label: "Ritz Media World Market Intelligence Report",
    summary:
      "The defining feature of North India's 2026 cycle is that outside capital and outside developers are reshaping the market.",
    period: "Mid-Year 2026",
    pages: 26,
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

/* Older uploads live in dated folders (e.g. "2023/09/x.jpg"); it is the only
   year hint the list endpoint carries when the post lookup fails. */
function yearFromImage(image: string) {
  return image.match(/^(20\d{2})\//)?.[1] ?? null;
}

export async function loadCaseStudyList() {
  const payload = await fetchJson(CASE_STUDY_LIST_URL);
  if (!Array.isArray(payload)) {
    throw new TypeError("The case study API returned an unexpected response format.");
  }

  return payload.filter(isRecord).flatMap((record) => {
    const slug = getString(record, "slug");
    const title = getString(record, "title");
    const image = getString(record, "blog_image");
    return slug && title ? [{ slug, title, image }] : [];
  });
}

export async function getCaseStudySlugs(): Promise<Set<string>> {
  try {
    const list = await loadCaseStudyList();
    return new Set(list.map((item) => item.slug.toLowerCase()));
  } catch {
    return new Set();
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  let list: Awaited<ReturnType<typeof loadCaseStudyList>>;
  try {
    list = await loadCaseStudyList();
  } catch (error) {
    console.error("Unable to load case studies:", error);
    return [];
  }

  /* Most case studies are absent from both blog list APIs, so the archive cannot
     supply their dates or excerpts. Only those misses hit the post endpoint. */
  const blogs = new Map((await getBlogsOrEmpty()).map((blog) => [blog.slug.toLowerCase(), blog]));
  const posts = await Promise.all(
    list.map(async (item) => {
      const known = blogs.get(item.slug.toLowerCase());
      if (known?.excerpt || known?.createdAt) return known;
      return getBlogPost(item.slug);
    }),
  );

  return list.map((item, index) => {
    const post = posts[index];
    const createdAt = post?.createdAt ?? null;
    return {
      slug: item.slug,
      title: post?.title || item.title,
      image: item.image ? normalizeImage(item.image) : (post?.image ?? null),
      excerpt: post?.excerpt ?? "",
      keywords: post?.keywords ?? "",
      createdAt,
      year: createdAt ? String(new Date(createdAt).getUTCFullYear()) : yearFromImage(item.image),
    };
  });
}
