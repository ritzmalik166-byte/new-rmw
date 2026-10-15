import { getLatestBlogs } from "@/lib/blogs";
import { HomeNewsContent } from "./HomeNewsContent";

export async function HomeNews() {
  const blogs = await getLatestBlogs(3);
  return <HomeNewsContent blogs={blogs} />;
}
