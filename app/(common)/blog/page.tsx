import { Metadata } from "next";
import Blog from "@/components/blog/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest insights on lost and found management, hospitality tips, and how hotels and guests benefit from SendUBack's services.",
  alternates: {
    canonical: "https://senduback.com/blog",
  },
  openGraph: {
    title: "Blog | SendUBack",
    description: "Insights on lost and found management for hotels and guests.",
    url: "https://senduback.com/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F4F8FF]">
      <Blog />
    </div>
  );
}
