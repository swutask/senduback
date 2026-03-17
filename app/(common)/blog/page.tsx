"use client";

import { useState } from "react";
import BlogHero from "@/components/blog/blog-hero";
import FeaturedBlog from "@/components/blog/featured-blog";
import BlogPosts from "@/components/blog/blog-posts";
import SubscribeNewsletter from "@/components/blog/subscribe-newsletter";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-[#F4F8FF]">
      <BlogHero
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <FeaturedBlog />
      <BlogPosts selectedCategory={selectedCategory} />
      <SubscribeNewsletter />
    </div>
  );
}
