import { cache } from "react";
import { fetchJson, getBlogsOrEmpty, normalizeImage, type Blog } from "@/lib/blogs";
import { getCaseStudies } from "@/lib/case-studies";

const CATEGORIES_URL = "https://www.ritzmediaworld.com/api/blog/categories";
const CATEGORY_POSTS_URL = "https://www.ritzmediaworld.com/api/category";

export type Category = { name: string; slug: string };

/* Matches the slugs the previous site used for /tags/[slug], so existing URLs keep working,
   but also drops curly quotes and stray edge punctuation ("radio advertising.") that would
   otherwise publish a second URL for the same tag. */
export function tagSlug(keyword: string) {
  return keyword
    .replace(/['",\u2018\u2019\u201c\u201d]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
}

/* Spelling variants ("omni-channel" / "omnichannel", "news-paper" / "newspaper") share one tag page. */
const tagVariantKey = (slug: string) => slug.replace(/[^\p{L}\p{N}]/gu, "");

/* Slugs containing URL delimiters cannot be served as a single path segment. */
const isRoutableSlug = (slug: string) => slug.length > 0 && !/[/?#\\%]/.test(slug);

export function tagHref(keyword: string) {
  const slug = tagSlug(keyword);
  return isRoutableSlug(slug) ? `/tags/${encodeURIComponent(slug)}` : null;
}

export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function decodeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).toLowerCase();
  } catch {
    return slug.toLowerCase();
  }
}

export function blogTagSlugs(blog: Pick<Blog, "keywords">) {
  return [...new Set(blog.keywords.split(",").map(tagSlug).filter(isRoutableSlug))];
}

/* Blogs and case studies share the `/[slug]` route, so both feed the tag pages. */
async function getTaggablePosts(): Promise<Blog[]> {
  const [blogs, caseStudies] = await Promise.all([getBlogsOrEmpty(), getCaseStudies()]);
  const posts = new Map(blogs.map((blog) => [blog.slug.toLowerCase(), blog]));

  for (const study of caseStudies) {
    const key = study.slug.toLowerCase();
    const existing = posts.get(key);
    if (existing && existing.keywords) continue;
    posts.set(key, {
      slug: study.slug,
      title: study.title,
      metaTitle: "",
      image: study.image,
      excerpt: study.excerpt,
      content: "",
      createdAt: study.createdAt,
      updatedAt: null,
      keywords: study.keywords || existing?.keywords || "",
    });
  }

  return [...posts.values()];
}

/* Building the index fetches every blog and case study; thousands of tag pages share
   one build per process instead of each repeating it. Empty builds (API outages) are
   not kept, so a transient failure cannot 404 every tag for the whole TTL. */
const TAG_INDEX_TTL_MS = 10 * 60_000;

/* `tags` is keyed by canonical slug; `aliases` maps every variant slug, and `variants`
   every punctuation-free key, to its canonical one. */
export type TagIndex = { tags: Map<string, Blog[]>; aliases: Map<string, string>; variants: Map<string, string> };

let tagIndexCache: { builtAt: number; index: TagIndex } | null = null;

/* Resolved data only. Sharing the in-flight promise across pages deadlocks
   static generation, because that promise is tied to the first page's fetch. */
const loadTagIndex = cache(buildTagIndex);

export async function getTagIndex(): Promise<TagIndex> {
  if (tagIndexCache && Date.now() - tagIndexCache.builtAt < TAG_INDEX_TTL_MS) return tagIndexCache.index;

  const index = await loadTagIndex();
  if (index.tags.size > 0) tagIndexCache = { builtAt: Date.now(), index };
  return index;
}

async function buildTagIndex(): Promise<TagIndex> {
  const bySlug = new Map<string, Blog[]>();
  for (const post of await getTaggablePosts()) {
    for (const slug of blogTagSlugs(post)) {
      const posts = bySlug.get(slug);
      if (posts) posts.push(post);
      else bySlug.set(slug, [post]);
    }
  }

  const variants = new Map<string, string[]>();
  for (const slug of bySlug.keys()) {
    const key = tagVariantKey(slug) || slug;
    variants.set(key, [...(variants.get(key) ?? []), slug]);
  }

  const tags = new Map<string, Blog[]>();
  const aliases = new Map<string, string>();
  const canonicalByKey = new Map<string, string>();
  for (const [key, group] of variants) {
    const isClean = (slug: string) => (/^[a-z0-9-]+$/.test(slug) ? 0 : 1);
    const [canonical] = group.sort(
      (first, second) =>
        isClean(first) - isClean(second) ||
        bySlug.get(second)!.length - bySlug.get(first)!.length ||
        first.localeCompare(second),
    );
    const posts = new Map<string, Blog>();
    for (const slug of group) {
      aliases.set(slug, canonical);
      for (const post of bySlug.get(slug)!) posts.set(post.slug.toLowerCase(), post);
    }
    tags.set(canonical, [...posts.values()]);
    canonicalByKey.set(key, canonical);
  }

  return { tags, aliases, variants: canonicalByKey };
}

/* Resolves a requested slug (raw, legacy, or variant spelling) to its canonical tag. */
export function canonicalTagSlug({ aliases, variants }: TagIndex, rawSlug: string) {
  const requested = decodeSlug(rawSlug);
  return aliases.get(requested) ?? aliases.get(tagSlug(requested)) ?? variants.get(tagVariantKey(tagSlug(requested)));
}

export async function resolveTag(rawSlug: string): Promise<{ slug: string; posts: Blog[] } | null> {
  const index = await getTagIndex();
  const slug = canonicalTagSlug(index, rawSlug);
  return slug ? { slug, posts: index.tags.get(slug) ?? [] } : null;
}

function categorySlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(): Promise<Category[]> {
  try {
    const payload = await fetchJson(CATEGORIES_URL);
    if (!Array.isArray(payload)) return [];
    return payload.flatMap((item) => {
      const name = typeof item?.name === "string" ? item.name.trim() : "";
      const slug = categorySlug(name);
      return name && slug ? [{ name, slug }] : [];
    });
  } catch (error) {
    console.error("Unable to load blog categories:", error);
    return [];
  }
}

export async function getCategoryPosts(slug: string): Promise<Blog[]> {
  let payload: unknown;
  try {
    payload = await fetchJson(`${CATEGORY_POSTS_URL}/${encodeURIComponent(slug)}`);
  } catch (error) {
    console.error(`Unable to load category "${slug}":`, error);
    return [];
  }
  if (!Array.isArray(payload)) return [];

  const blogs = new Map((await getBlogsOrEmpty()).map((blog) => [blog.slug.toLowerCase(), blog]));
  return payload.flatMap((item) => {
    const postSlug = typeof item?.slug === "string" ? item.slug.trim() : "";
    const title = typeof item?.title === "string" ? item.title.trim() : "";
    if (!postSlug || !title) return [];
    const known = blogs.get(postSlug.toLowerCase());
    const image = typeof item?.blog_image === "string" && item.blog_image ? normalizeImage(item.blog_image) : null;
    return [
      {
        slug: postSlug,
        title,
        metaTitle: known?.metaTitle ?? "",
        image: image ?? known?.image ?? null,
        excerpt: known?.excerpt ?? "",
        content: "",
        createdAt: known?.createdAt ?? null,
        updatedAt: known?.updatedAt ?? null,
        keywords: known?.keywords ?? "",
      },
    ];
  });
}
