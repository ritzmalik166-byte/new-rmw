import { getPosts, getSubServiceImageEntries, renderUrlset, xmlResponse } from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
  const posts = await getPosts();
  return xmlResponse(
    renderUrlset(
      [
        ...posts.flatMap(({ path, title, image }) =>
          image ? [{ path, priority: 0.6, images: [{ url: image, title }] }] : [],
        ),
        ...getSubServiceImageEntries(),
      ],
      new Date().toISOString(),
    ),
  );
}
