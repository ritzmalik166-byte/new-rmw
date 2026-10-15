const LATEST_BLOGS_URL = "https://www.ritzmediaworld.com/api/get_all_blogs";
const ALL_BLOGS_URL = "https://www.ritzmediaworld.com/api/all_blogs";
const BLOG_POST_URL = "https://www.ritzmediaworld.com/api/blog";
const BLOG_ARCHIVE_LIMIT = 59;

export type Blog = {
  slug: string;
  title: string;
  image: string | null;
  excerpt: string;
  content: string;
  createdAt: string | null;
  keywords: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function getRecords(payload: unknown): Record<string, unknown>[] {
  const records = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.blogs)
      ? payload.blogs
      : null;

  if (!records || !records.every(isRecord)) {
    throw new TypeError("The blog API returned an unexpected response format.");
  }

  return records;
}

export function normalizeImage(image: string) {
  const path = image.startsWith("/") || /^https?:\/\//i.test(image)
    ? image
    : `/blogs/${image.split("/").map(encodeURIComponent).join("/")}`;

  try {
    const url = new URL(path, "https://www.ritzmediaworld.com");
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function toBlog(record: Record<string, unknown>): Blog | null {
  const slug = getString(record, "blogSlug", "slug");
  const title = getString(record, "blogTitle", "title");
  if (!slug || !title) return null;

  const image = getString(record, "blogBanner", "blog_image", "image");
  const rawExcerpt = getString(
    record,
    "mtDesc",
    "meta_description",
    "blogDescription",
  );
  const excerpt = rawExcerpt
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
  const createdAt = getString(record, "createdAt", "created_at");
  const keywords = getString(record, "metaKeywords", "meta_keywords");
  const status = getString(record, "status").toLowerCase();
  if (status && status !== "active") return null;

  const content = getString(record, "blogDescription", "content", "body", "description");

  return {
    slug,
    title,
    image: image ? normalizeImage(image) : null,
    excerpt,
    content,
    createdAt: createdAt && !Number.isNaN(Date.parse(createdAt)) ? createdAt : null,
    keywords,
  };
}

const RETRY_DELAYS_MS = [500, 1500, 3000];
const SHARED_REQUEST_TTL_MS = 60_000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

export async function fetchJson(url: string): Promise<unknown> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await wait(RETRY_DELAYS_MS[attempt - 1] + Math.random() * 250);
    }

    let response: Response;
    try {
      response = await fetch(url, { next: { revalidate: 300 } });
    } catch (error) {
      lastError = error;
      continue;
    }

    if (response.ok) return response.json();

    lastError = new Error(`Blog API request failed (${response.status}): ${url}`);
    if (!isRetryableStatus(response.status)) break;
  }

  throw lastError;
}

async function fetchBlogRecords(url: string) {
  return getRecords(await fetchJson(url));
}

/* get_all_blogs only returns 10 posts per request, so every ?page= is fetched until an
   empty page comes back. */
const LATEST_PAGE_BATCH = 5;
const LATEST_MAX_PAGES = 200;

async function fetchLatestBlogRecords() {
  const records: Record<string, unknown>[] = [];

  for (let start = 1; start <= LATEST_MAX_PAGES; start += LATEST_PAGE_BATCH) {
    const pages = await Promise.allSettled(
      Array.from({ length: LATEST_PAGE_BATCH }, (_, offset) =>
        fetchBlogRecords(`${LATEST_BLOGS_URL}?page=${start + offset}`),
      ),
    );

    for (const result of pages) {
      if (result.status === "rejected") {
        if (records.length === 0) throw result.reason;
        console.error("Stopped paging get_all_blogs early:", result.reason);
        return records;
      }
      if (result.value.length === 0) return records;
      records.push(...result.value);
    }
  }

  return records;
}

// Static generation renders dozens of blog pages at once; sharing one request
// per process keeps the upstream API from rate-limiting the build with 503s.
let sharedRequest: { startedAt: number; promise: Promise<Blog[]> } | null = null;
let lastLoadedBlogs: Blog[] | null = null;
let lastLoadedComplete = false;

export function getBlogs(): Promise<Blog[]> {
  if (sharedRequest && Date.now() - sharedRequest.startedAt < SHARED_REQUEST_TTL_MS) {
    return sharedRequest.promise;
  }

  const promise: Promise<Blog[]> = loadBlogs().then(
    ({ blogs, complete }) => {
      // The archive alone stops in mid-2025, so a run where get_all_blogs failed must
      // not replace a complete result, and should be retried on the next request.
      if (!complete) {
        if (sharedRequest?.promise === promise) sharedRequest = null;
        if (lastLoadedBlogs && lastLoadedComplete) return lastLoadedBlogs;
      }
      lastLoadedBlogs = blogs;
      lastLoadedComplete = complete;
      return blogs;
    },
    (error) => {
      if (sharedRequest?.promise === promise) sharedRequest = null;
      if (lastLoadedBlogs) return lastLoadedBlogs;
      throw error;
    },
  );
  sharedRequest = { startedAt: Date.now(), promise };
  return promise;
}

let lastLatestBlogs: Blog[] | null = null;

/* Only the first get_all_blogs page is needed for the newest posts, which avoids
   paging through the whole feed (and its failure modes) just to show a few cards. */
export async function getLatestBlogs(limit: number): Promise<Blog[]> {
  try {
    const blogs = sortByNewest(
      (await fetchBlogRecords(`${LATEST_BLOGS_URL}?page=1`))
        .map(toBlog)
        .filter((blog): blog is Blog => blog !== null),
    );
    if (blogs.length >= limit) {
      lastLatestBlogs = blogs;
      return blogs.slice(0, limit);
    }
  } catch (error) {
    console.error("Unable to load the newest blogs:", error);
    if (lastLatestBlogs) return lastLatestBlogs.slice(0, limit);
  }

  return (await getBlogsOrEmpty()).slice(0, limit);
}

function sortByNewest(blogs: Blog[]) {
  return blogs.sort((first, second) => {
    const firstDate = first.createdAt ? Date.parse(first.createdAt) : 0;
    const secondDate = second.createdAt ? Date.parse(second.createdAt) : 0;
    return secondDate - firstDate;
  });
}

export async function getBlogsOrEmpty(): Promise<Blog[]> {
  try {
    return await getBlogs();
  } catch {
    return [];
  }
}

async function loadBlogs(): Promise<{ blogs: Blog[]; complete: boolean }> {
  const results = await Promise.allSettled([
    fetchLatestBlogRecords(),
    fetchBlogRecords(ALL_BLOGS_URL),
  ]);
  const [latestResult, allResult] = results;
  const latestRecords = latestResult.status === "fulfilled"
    ? latestResult.value
    : [];
  const allRecords = allResult.status === "fulfilled"
    ? allResult.value
    : [];

  if (latestResult.status === "rejected") {
    console.error("Unable to load latest blogs:", latestResult.reason);
  }
  if (allResult.status === "rejected") {
    console.error("Unable to load the full blog archive:", allResult.reason);
  }
  if (latestResult.status === "rejected" && allResult.status === "rejected") {
    throw new AggregateError(
      [latestResult.reason, allResult.reason],
      "Both blog APIs failed; the blog archive cannot be loaded.",
    );
  }

  const blogsBySlug = new Map<string, Blog>();

  for (const record of allRecords) {
    const blog = toBlog(record);
    if (blog) blogsBySlug.set(blog.slug, blog);
  }

  for (const record of latestRecords) {
    const blog = toBlog(record);
    if (blog) {
      const existing = blogsBySlug.get(blog.slug);
      blogsBySlug.set(blog.slug, {
        ...existing,
        ...blog,
        image: blog.image ?? existing?.image ?? null,
        excerpt: blog.excerpt || existing?.excerpt || "",
        createdAt: blog.createdAt ?? existing?.createdAt ?? null,
        keywords: blog.keywords || existing?.keywords || "",
      });
    }
  }

  return {
    blogs: sortByNewest([...blogsBySlug.values()]),
    complete: latestResult.status === "fulfilled",
  };
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug);
}

/* Posts outside the archive feeds (e.g. case studies) are only served by this endpoint. */
export async function getBlogPost(slug: string): Promise<Blog | null> {
  try {
    const payload = await fetchJson(`${BLOG_POST_URL}/${encodeURIComponent(slug)}`);
    return isRecord(payload) && isRecord(payload.blog) ? toBlog(payload.blog) : null;
  } catch {
    return null;
  }
}
