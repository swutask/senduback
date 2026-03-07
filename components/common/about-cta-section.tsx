"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
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

interface AboutCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export default function AboutCTASection({
  title = "Ready to Transform Your Lost & Found?",
  description = "Join hundreds of hotels delivering exceptional guest experiences with SendUBack",
  buttonText = "Get Started Today",
  buttonLink = "/",
}: AboutCTAProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "px-[135px] py-20 gap-8",
        "max-md:px-4 max-md:py-16 max-md:gap-6",
        "bg-secondary",
      )}
    >
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="flex flex-col items-center gap-8 max-md:gap-6 w-full"
      >
        <div className="flex flex-col items-center gap-4 max-md:gap-3">
          <motion.h2
            variants={fadeUpVariants}
            className={cn(
              "font-semibold leading-tight text-stats-heading",
              "text-[2.75rem] max-md:text-[2rem]",
            )}
          >
            {title}
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className={cn(
              "text-cta-subtext font-medium leading-relaxed",
              "text-xl max-w-3xl",
              "max-md:text-[0.9rem] max-md:max-w-md",
            )}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          variants={fadeUpVariants}
          className={cn(
            "flex items-center gap-4",
            "max-md:flex-col max-md:w-full max-md:gap-3",
          )}
        >
          <Link href={buttonLink} className="w-full">
            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 8px 28px rgba(0,100,255,0.32)",
                transition: { duration: 0.18, ease: "easeOut" as const },
              }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center justify-center gap-2",
                "font-semibold text-white text-[15px]",
                "px-8 py-3.5 rounded-xl",
                "bg-linear-to-r from-active to-primary",
                "shadow-[0_4px_20px_rgba(0,80,200,0.28)]",
                "will-change-transform cursor-pointer",
                "max-md:w-full",
              )}
            >
              {buttonText} <span className="text-base">→</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
