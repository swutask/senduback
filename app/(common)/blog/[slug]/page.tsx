import BlogDetails from "@/components/blog/blog-details";
import { blogPosts } from "@/lib/blog-data";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const title = post ? `${post.title}` : "Blog";

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  return <BlogDetails post={post} />;
}
