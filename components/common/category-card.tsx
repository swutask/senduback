"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: {
    id: string;
    label: string;
    emoji: StaticImageData;
    key: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/orders/${category?.key}`} passHref key={category?.id}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} // Start slightly below and invisible
        whileInView={{ opacity: 1, y: 0 }} // Slide up into view
        viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% visible
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          y: -15,
          scale: 1.05,
          backgroundColor: "#E6F2FF",
          boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        }}
        whileTap={{ scale: 0.95 }}
        className="bg-[#CAE8FC] h-40 md:h-52 rounded-2xl p-4 md:p-8 text-center flex flex-col items-center justify-center shadow-sm cursor-pointer z-30"
      >
        {/* Icon Container */}
        <div className="mb-4 flex justify-center">
          <Image
            src={category?.emoji.src}
            alt={category?.label}
            width={200}
            height={200}
            className="w-16 md:w-24 h-auto"
          />
        </div>

        {/* Label */}
        <p className="text-gray-800 font-semibold  md:text-lg">
          {category?.label}
        </p>
      </motion.div>
    </Link>
  );
}
export interface Category {
  id: string;
  key: string;
  label: string;
  icon: StaticImageData;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function CategoryCardV2({ category }: { category: Category }) {
  return (
    <Link href={`/orders/${category?.key}`} passHref key={category?.id}>
      <motion.button
        variants={cardVariants}
        whileHover={{
          y: -4,
          boxShadow: "0 8px 24px var(--category-card-hover-shadow)",
          transition: { duration: 0.18, ease: "easeOut" as const },
        }}
        whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
        className={cn(
          "w-full flex flex-col items-center justify-center",
          "gap-3 p-5 rounded-[18px]",
          // "bg-gradient-to-b from-category-card-from to-category-card-to",
          "border border-(--category-card-border)/30",
          "shadow-[0px_1px_2px_0px_var(--category-card-shadow)]",
          "max-md:bg-white max-md:rounded-2xl",
          "cursor-pointer select-none will-change-transform",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--badge-blue-ring) focus-visible:ring-offset-2",
          "aspect-138/132 md:aspect-auto md:h-[132px] h-[100px]",
        )}
        aria-label={`Select ${category.label}`}
      >
        <div className="relative w-8 h-8 md:w-12 md:h-12 shrink-0">
          <Image
            src={category.icon}
            alt={category.label}
            fill
            className="object-contain drop-shadow-sm"
            sizes="(max-width: 768px) 40px, 48px"
          />
        </div>

        <span
          className={cn(
            "text-[13px] md:text-[14px] font-semibold leading-tight text-center",
            "text-category-card-text text-nowrap",
          )}
        >
          {category.label}
        </span>
      </motion.button>
    </Link>
  );
}
