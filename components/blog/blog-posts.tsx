"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { blogPosts } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface BlogPostsProps {
  selectedCategory?: string;
}

export default function BlogPosts({
  selectedCategory = "All",
}: BlogPostsProps) {
  const regularPosts = blogPosts.filter((post) => {
    if (post.isFeatured) return false;
    if (selectedCategory === "All") return true;
    return post.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section className={cn("w-full py-12 md:py-16 bg-blog-bg")}>
      <div className="max-w-[1170px] mx-auto px-4 md:px-8">
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {regularPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className={cn(
                "bg-white rounded-2xl border border-[#DCEFFF] flex flex-col transition-all duration-300",
                "hover:-translate-y-1",
              )}
            >
              <div className="p md:p-4 pb-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-[200px] md:h-[220px] object-cover rounded-b-none rounded-t-xl md:rounded-xl"
                  priority={false}
                />
              </div>

              <div className="p-3 xs:p-5 md:p-6 flex flex-col grow">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="bg-blue-lightest text-blog-link px-3 py-1 rounded-full text-[10px] md:text-[11px] font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="text-text-gray text-[10px] sm:text-[11px] font-medium">
                    {post.date} • {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg md:text-[20px] font-bold text-blog-heading leading-[1.3] mb-3">
                  {post.title}
                </h3>

                <p className="text-sm md:text-base text-text-gray leading-[1.6] mb-3 grow">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-blog-link font-bold text-[14px] hover:text-blue-deep transition-colors mt-auto w-fit"
                >
                  Read More{" "}
                  <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
