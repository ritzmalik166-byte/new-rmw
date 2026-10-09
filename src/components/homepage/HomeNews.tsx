import { getBlogs } from "@/lib/blogs";
import { HomeNewsContent } from "./HomeNewsContent";

export async function HomeNews() {
  const blogs = await getBlogs();
  return <HomeNewsContent blogs={blogs.slice(0, 3)} />;
}
