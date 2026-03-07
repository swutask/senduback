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

export default function StillHaveQuestions() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "px-[135px] py-20 gap-8",
        "max-md:px-4 max-md:py-16 max-md:gap-6",
        "bg-fade-blue",
      )}
      style={{
        background: "#E6F2FF",
      }}
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
              "font-bold leading-tight text-[#0D1B6E]",
              "text-[2.75rem] max-md:text-[2rem]",
            )}
          >
            Still have questions?
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className={cn(
              "text-[#6B7FA3] font-medium leading-relaxed",
              "text-[1rem] max-w-xl",
              "max-md:text-[0.9rem] max-md:max-w-xs",
            )}
          >
            Our support team is ready to help. Reach out and we&apos;ll get back
            to you within 2 hours.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUpVariants}
          className={cn(
            "flex items-center gap-4",
            "max-md:flex-col max-md:w-full max-md:gap-3",
          )}
        >
          <Link href={"/contact"} className="w-full">
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
                "bg-gradient-to-r from-[#0099FF] to-[#000080]",
                "shadow-[0_4px_20px_rgba(0,80,200,0.28)]",
                "will-change-transform cursor-pointer",
                "max-md:w-full",
              )}
            >
              Contact Support <span className="text-base">→</span>
            </motion.button>
          </Link>

          <Link href={"/register"} className="w-full">
            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 4px 18px rgba(0,100,255,0.12)",
                transition: { duration: 0.18, ease: "easeOut" as const },
              }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center justify-center gap-1",
                "font-semibold text-[#0099FF] text-[15px]",
                "px-8 py-3.5 rounded-xl",
                "bg-white border border-white/60",
                "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
                "will-change-transform cursor-pointer",
                "max-md:w-full text-nowrap",
              )}
            >
              Create Hotel Account.
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
