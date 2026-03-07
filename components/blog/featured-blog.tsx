"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

export default function FeaturedBlog() {
  const featuredPost =
    blogPosts.find((post) => post.isFeatured) || blogPosts[0];

  return (
    <section className={cn("w-full py-16 md:py-20 bg-[#EFF9FF]")}>
      <div className="max-w-[1170px] mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col lg:flex-row items-center gap-8 md:gap-6 lg:gap-12"
        >
          <div className="w-full lg:w-[60%] shrink-0">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-auto object-cover rounded-2xl md:rounded-[20px] shadow-sm"
              priority
            />
          </div>

          <div className="w-full lg:w-[45%] flex flex-col items-start px-2 lg:px-0">
            <p className="text-sm font-medium text-text-gray mb-3">
              {featuredPost.date}
              <span className="mx-3">•</span>
              {featuredPost.readTime}
            </p>

            <h2
              className={cn(
                "text-[20px] md:text-[32px] font-bold text-blog-heading leading-[1.3] mb-4 md:mb-5",
              )}
            >
              {featuredPost.title}
            </h2>

            <p
              className={cn(
                "text-sm md:text-lg text-text-gray leading-[1.6] mb-3",
              )}
            >
              {featuredPost.excerpt}
            </p>

            <Link
              href={`/blog/${featuredPost.slug}`}
              className={cn(
                "inline-flex items-center gap-2 font-bold text-[15px] md:text-[17px] mt-2 transition-colors",
                "text-blog-link hover:text-blue-deep",
              )}
            >
              Read Article <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
