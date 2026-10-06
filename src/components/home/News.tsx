import { NewsContent } from "@/components/home/NewsContent";
import { getBlogs } from "@/lib/blogs";

export async function News() {
  const blogs = await getBlogs();
  return <NewsContent blogs={blogs.slice(0, 2)} />;
}
