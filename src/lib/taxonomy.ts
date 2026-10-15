import { fetchJson, getBlogsOrEmpty, normalizeImage, type Blog } from "@/lib/blogs";
import { getCaseStudies } from "@/lib/case-studies";

const CATEGORIES_URL = "https://www.ritzmediaworld.com/api/blog/categories";
const CATEGORY_POSTS_URL = "https://www.ritzmediaworld.com/api/category";

export type Category = { name: string; slug: string };

/* Matches the slugs the previous site used for /tags/[slug], so existing URLs keep working. */
export function tagSlug(keyword: string) {
  return keyword.replace(/['",]/g, "").replace(/\s+/g, " ").trim().toLowerCase().replace(/ /g, "-");
}

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
let tagIndexCache: { builtAt: number; promise: Promise<Map<string, Blog[]>> } | null = null;

export function getTagIndex(): Promise<Map<string, Blog[]>> {
  if (tagIndexCache && Date.now() - tagIndexCache.builtAt < TAG_INDEX_TTL_MS) return tagIndexCache.promise;

  const promise = buildTagIndex().then((index) => {
    if (index.size === 0 && tagIndexCache?.promise === promise) tagIndexCache = null;
    return index;
  });
  tagIndexCache = { builtAt: Date.now(), promise };
  return promise;
}

async function buildTagIndex() {
  const index = new Map<string, Blog[]>();
  for (const post of await getTaggablePosts()) {
    for (const slug of blogTagSlugs(post)) {
      const posts = index.get(slug);
      if (posts) posts.push(post);
      else index.set(slug, [post]);
    }
  }
  return index;
}

export async function getTagPosts(slug: string): Promise<Blog[]> {
  return (await getTagIndex()).get(decodeSlug(slug)) ?? [];
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
