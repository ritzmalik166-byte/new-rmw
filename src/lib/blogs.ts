import { cache } from "react";

const LATEST_BLOGS_URL = "https://www.ritzmediaworld.com/api/get_all_blogs";
const ALL_BLOGS_URL = "https://www.ritzmediaworld.com/api/all_blogs";
const BLOG_POST_URL = "https://www.ritzmediaworld.com/api/blog";
const ADMIN_BLOG_POST_URL = "https://www.ritzmediaworld.com/api/ritz_blogs/get-single-blog";
const BLOG_ARCHIVE_LIMIT = 59;

export type Blog = {
  slug: string;
  title: string;
  metaTitle: string;
  image: string | null;
  excerpt: string;
  content: string;
  createdAt: string | null;
  updatedAt: string | null;
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getBlogBody(record: Record<string, unknown>) {
  return Array.isArray(record.blogBody) ? record.blogBody.filter(isRecord) : [];
}

/* Admin edits are saved only to `blogBody[].metaDescription`; the top-level
   `blogDescription` keeps the text from when the post was first published. */
function getContent(record: Record<string, unknown>, title: string) {
  const pages = getBlogBody(record);
  if (pages.length === 0) {
    return getString(record, "blogDescription", "content", "body", "description");
  }

  return pages
    .map((page) => {
      const heading = getString(page, "metaTitle");
      const showHeading = heading && !title.includes(heading);
      const html = typeof page.metaDescription === "string" ? page.metaDescription : "";
      return (showHeading ? `<h2>${escapeHtml(heading)}</h2>` : "") + html;
    })
    .join("");
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
  const updatedAt = getString(record, "updatedAt", "updated_at");
  const keywords = getString(record, "metaKeywords", "meta_keywords");
  const status = getString(record, "status").toLowerCase();
  if (status && status !== "active") return null;

  const [firstPage] = getBlogBody(record);

  return {
    slug,
    title,
    metaTitle:
      getString(record, "metaTitle", "meta_title", "mtTitle") ||
      (firstPage ? getString(firstPage, "metaTitle") : ""),
    image: image ? normalizeImage(image) : null,
    excerpt,
    content: getContent(record, title),
    createdAt: validDate(createdAt),
    updatedAt: validDate(updatedAt),
    keywords,
  };
}

/* Posts edited in the admin panel keep their original keywords in the archive API;
   both sets feed the /tags pages the previous site published. */
function mergeKeywords(...lists: string[]) {
  const keywords = new Map<string, string>();
  for (const keyword of lists.flatMap((list) => list.split(","))) {
    const trimmed = keyword.trim();
    const key = trimmed.toLowerCase();
    if (trimmed && !keywords.has(key)) keywords.set(key, trimmed);
  }
  return [...keywords.values()].join(", ");
}

function validDate(value: string) {
  return value && !Number.isNaN(Date.parse(value)) ? value : null;
}

const RETRY_DELAYS_MS = [500, 1500, 3000];
const SHARED_REQUEST_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 12_000;
const ARCHIVE_LOCK_STALE_MS = 45_000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

/* The API host drops new connections when one client opens too many at once
   (20+ parallel requests time out), so requests to it are queued. */
const MAX_PARALLEL_REQUESTS = 4;
let activeRequests = 0;
const requestQueue: (() => void)[] = [];

async function limited<T>(task: () => Promise<T>): Promise<T> {
  if (activeRequests >= MAX_PARALLEL_REQUESTS) {
    await new Promise<void>((resolve) => requestQueue.push(resolve));
  }
  activeRequests++;
  try {
    return await task();
  } finally {
    activeRequests--;
    requestQueue.shift()?.();
  }
}

export async function fetchJson(url: string): Promise<unknown> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) {
      await wait(RETRY_DELAYS_MS[attempt - 1] + Math.random() * 250);
    }

    let result: { status: number; data?: unknown };
    try {
      result = await limited(async () => {
        const response = await fetch(url, {
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        });
        if (!response.ok) {
          await response.body?.cancel();
          return { status: response.status };
        }
        return { status: response.status, data: await response.json() };
      });
    } catch (error) {
      lastError = error;
      continue;
    }

    if ("data" in result) return result.data;

    lastError = new Error(`Blog API request failed (${result.status}): ${url}`);
    if (!isRetryableStatus(result.status)) break;
  }

  throw lastError;
}

async function fetchBlogRecords(url: string) {
  return getRecords(await fetchJson(url));
}

/* get_all_blogs only returns 10 posts per request. It is newest-first, and the
   archive already holds everything from mid-2025 back, so paging stops at the first
   page whose posts are all in the archive instead of walking the older pages too. */
const LATEST_PAGE_BATCH = 5;
const LATEST_MAX_PAGES = 200;

function recordSlug(record: Record<string, unknown>) {
  return getString(record, "blogSlug", "slug").toLowerCase();
}

async function fetchLatestBlogRecords(knownSlugs: Set<string> | null) {
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
        return { records, complete: false };
      }
      if (result.value.length === 0) return { records, complete: true };
      const covered =
        knownSlugs !== null &&
        result.value.every((record) => {
          const slug = recordSlug(record);
          return slug.length > 0 && knownSlugs.has(slug);
        });
      if (covered) return { records, complete: true };
      records.push(...result.value);
    }
  }

  return { records, complete: true };
}

let lastLoadedBlogs: Blog[] | null = null;
let lastLoadedComplete = false;
let lastLoadedAt = 0;

function rememberBlogs(blogs: Blog[], complete: boolean) {
  // The archive alone stops in mid-2025, so a run where get_all_blogs failed must
  // not replace a complete result, and should be retried on the next request.
  if (!complete && lastLoadedBlogs && lastLoadedComplete) return lastLoadedBlogs;
  if (blogs.length === 0) return lastLoadedBlogs ?? blogs;
  lastLoadedBlogs = blogs;
  lastLoadedComplete = complete;
  lastLoadedAt = Date.now();
  return blogs;
}

function freshBlogs() {
  if (!lastLoadedBlogs || !lastLoadedComplete) return null;
  if (Date.now() - lastLoadedAt > SHARED_REQUEST_TTL_MS) return null;
  return lastLoadedBlogs;
}

type ArchiveSnapshot = { savedAt: number; blogs: Blog[] };

async function archiveCachePaths() {
  const path = await import("node:path");
  const dir = path.join(process.cwd(), ".next", "cache");
  return {
    dir,
    file: path.join(dir, "rmw-blog-archive.json"),
    lock: path.join(dir, "rmw-blog-archive.lock"),
  };
}

async function readArchiveCache(): Promise<ArchiveSnapshot | null> {
  try {
    const fs = await import("node:fs");
    const { file } = await archiveCachePaths();
    const parsed = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ file, "utf8")) as ArchiveSnapshot;
    if (!parsed || !Array.isArray(parsed.blogs) || parsed.blogs.length === 0) return null;
    if (Date.now() - parsed.savedAt > SHARED_REQUEST_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeArchiveCache(snapshot: ArchiveSnapshot) {
  const fs = await import("node:fs");
  const { dir, file } = await archiveCachePaths();
  fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(/*turbopackIgnore: true*/ temp, JSON.stringify(snapshot));
  try {
    fs.unlinkSync(/*turbopackIgnore: true*/ file);
  } catch {
    // First writer.
  }
  fs.renameSync(/*turbopackIgnore: true*/ temp, file);
}

let archiveLockHeld = false;

async function tryArchiveLock() {
  const fs = await import("node:fs");
  const { dir, lock } = await archiveCachePaths();
  fs.mkdirSync(/*turbopackIgnore: true*/ dir, { recursive: true });
  try {
    fs.writeFileSync(/*turbopackIgnore: true*/ lock, String(Date.now()), { flag: "wx" });
    archiveLockHeld = true;
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") return false;
    try {
      const started = Number(fs.readFileSync(/*turbopackIgnore: true*/ lock, "utf8"));
      if (!Number.isFinite(started) || Date.now() - started < ARCHIVE_LOCK_STALE_MS) return false;
      fs.unlinkSync(/*turbopackIgnore: true*/ lock);
      fs.writeFileSync(/*turbopackIgnore: true*/ lock, String(Date.now()), { flag: "wx" });
      archiveLockHeld = true;
      return true;
    } catch {
      return false;
    }
  }
}

async function releaseArchiveLock() {
  if (!archiveLockHeld) return;
  archiveLockHeld = false;
  try {
    const fs = await import("node:fs");
    fs.unlinkSync(/*turbopackIgnore: true*/ (await archiveCachePaths()).lock);
  } catch {
    // Already released.
  }
}

async function archiveLockExists() {
  try {
    const fs = await import("node:fs");
    fs.accessSync(/*turbopackIgnore: true*/ (await archiveCachePaths()).lock);
    return true;
  } catch {
    return false;
  }
}

async function waitForArchiveCache() {
  for (let attempt = 0; attempt < 80; attempt++) {
    await wait(250);
    const snapshot = await readArchiveCache();
    if (snapshot) return snapshot;
    if (!(await archiveLockExists())) return null;
  }
  return null;
}

/* Each static page used to await one shared in-flight download. That promise is bound
   to whichever page started it, and the other pages then deadlock until the 60s
   build timeout. Resolved data is shared instead: one worker writes the archive to
   disk and the rest read it. `cache()` only dedupes inside a single render. */
async function loadSharedBlogs(): Promise<Blog[]> {
  const fresh = freshBlogs();
  if (fresh) return fresh;

  for (let attempt = 0; attempt < 3; attempt++) {
    const cached = await readArchiveCache();
    if (cached) return rememberBlogs(cached.blogs, true);

    if (!(await tryArchiveLock())) {
      const waited = await waitForArchiveCache();
      if (waited) return rememberBlogs(waited.blogs, true);
      continue;
    }

    try {
      const raced = await readArchiveCache();
      if (raced) return rememberBlogs(raced.blogs, true);

      const { blogs, complete } = await loadBlogs();
      if (complete && blogs.length > 0) {
        try {
          await writeArchiveCache({ savedAt: Date.now(), blogs });
        } catch (error) {
          console.error("Unable to cache the blog archive:", error);
        }
      }
      return rememberBlogs(blogs, complete);
    } catch (error) {
      if (lastLoadedBlogs) return lastLoadedBlogs;
      throw error;
    } finally {
      await releaseArchiveLock();
    }
  }

  try {
    const { blogs, complete } = await loadBlogs();
    return rememberBlogs(blogs, complete);
  } catch (error) {
    if (lastLoadedBlogs) return lastLoadedBlogs;
    throw error;
  }
}

export const getBlogs = cache(loadSharedBlogs);

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
  let allRecords: Record<string, unknown>[] = [];
  let allError: unknown;
  try {
    allRecords = await fetchBlogRecords(ALL_BLOGS_URL);
  } catch (error) {
    allError = error;
    console.error("Unable to load the full blog archive:", error);
  }

  const knownSlugs = new Set(allRecords.map(recordSlug).filter(Boolean));
  let latestRecords: Record<string, unknown>[] = [];
  let latestComplete = false;
  let latestError: unknown;
  try {
    const latest = await fetchLatestBlogRecords(knownSlugs.size > 0 ? knownSlugs : null);
    latestRecords = latest.records;
    latestComplete = latest.complete;
  } catch (error) {
    latestError = error;
    console.error("Unable to load latest blogs:", error);
  }

  if (allError && latestError) {
    throw new AggregateError(
      [allError, latestError],
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
        metaTitle: blog.metaTitle || existing?.metaTitle || "",
        excerpt: blog.excerpt || existing?.excerpt || "",
        createdAt: blog.createdAt ?? existing?.createdAt ?? null,
        updatedAt: blog.updatedAt ?? existing?.updatedAt ?? null,
        keywords: mergeKeywords(blog.keywords, existing?.keywords ?? ""),
      });
    }
  }

  return {
    blogs: sortByNewest([...blogsBySlug.values()]),
    complete: latestError === undefined && latestComplete,
  };
}

export async function getBlogBySlug(slug: string): Promise<Blog | undefined> {
  const blogs = await getBlogs();
  return blogs.find((blog) => blog.slug === slug);
}

async function fetchBlogPost(url: string): Promise<Blog | null> {
  try {
    const payload = await fetchJson(url);
    return isRecord(payload) && isRecord(payload.blog) ? toBlog(payload.blog) : null;
  } catch {
    return null;
  }
}

function lastChanged(blog: Blog) {
  const date = blog.updatedAt ?? blog.createdAt;
  return date ? Date.parse(date) : 0;
}

/* The full, current copy of a post. Older posts live behind /api/blog and
   admin-managed posts behind /api/ritz_blogs; a slug can exist in both, so the
   most recently changed record wins, matching ritzmediaworld.com. */
export async function getBlogPost(slug: string): Promise<Blog | null> {
  const path = encodeURIComponent(slug);
  const [legacy, admin] = await Promise.all([
    fetchBlogPost(`${BLOG_POST_URL}/${path}`),
    fetchBlogPost(`${ADMIN_BLOG_POST_URL}/${path}`),
  ]);

  if (legacy && admin) return lastChanged(admin) >= lastChanged(legacy) ? admin : legacy;
  return admin ?? legacy;
}
