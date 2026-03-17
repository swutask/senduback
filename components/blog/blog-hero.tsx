"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/for-hotels-banner.png";

const categories = [
  "All",
  "Travel Tips",
  "Hotel Operations",
  "Company News",
  "Guest Stories",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

interface BlogHeroProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function BlogHero({
  selectedCategory = "All",
  onCategorySelect = () => {},
}: BlogHeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden bg-hotel-hero-bg pt-[160px] pb-24 lg:pt-[200px] lg:pb-[140px]"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="z-10 relative mx-auto w-full max-w-[1170px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center justify-center text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-[28px] lg:text-5xl leading-[1.1] font-bold tracking-tight text-white px-4">
              Blog
            </h1>
            <p className="text-white text-lg md:text-lg max-w-2xl mx-auto font-medium px-4">
              Tips, stories, and insights from the world of lost & found.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 md:mt-4 px-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={cn(
                  "px-4 py-2 md:px-6 md:py-3 rounded-full text-[15px] font-semibold transition-all duration-200",
                  category === selectedCategory
                    ? "bg-blog-link text-white shadow-[0_4px_14px_0_rgba(21,93,252,0.39)]"
                    : "bg-blue-lightest text-blog-link hover:bg-white",
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
