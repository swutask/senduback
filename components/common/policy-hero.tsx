"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import bg from "@/assets/new-img/hero-section-bg.png";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

type PolicyType = "refund" | "private" | "cookie";

const POLICY_CONTENT: Partial<Record<PolicyType | "default", string>> = {
  private:
    "How SendUBack collects, uses, and protects your personal data under the UK General Data Protection Regulation and the Data Protection Act 2018.",
  cookie:
    "How SendUBack uses cookies and similar technologies on our website, in compliance with the Privacy and Electronic Communications Regulations (PECR) and UK GDPR.",
  default:
    "At SendUBack, we help people reconnect with the things that matter to them – even after they've checked out, flown home, or moved on to their next destination.",
};

export default function PolicyHero({ type = "refund" }: { type?: PolicyType }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden",
        "min-h-[513px]",
        "max-md:min-h-[340px]",
        "flex items-center justify-center md:pt-0 pt-24",
      )}
    >
      <Image
        src={bg}
        alt="faq_hero"
        fill
        priority
        className="object-cover object-center select-none pointer-events-none"
        sizes="100vw"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-[#060D1F]/60 pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className={cn(
          "relative z-10 flex flex-col items-center text-center",
          "px-[135px] gap-5",
          "max-md:px-4 max-md:gap-4",
        )}
      >
        <motion.h1
          variants={fadeUpVariants}
          className={cn(
            "font-bold leading-tight text-white",
            "text-[3rem] max-md:text-[2rem]",
          )}
        >
          {type === "private"
            ? "Privacy Policy"
            : type === "refund"
              ? "Refund Policy"
              : "Cookie Policy"}
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          className={cn(
            "font-medium leading-relaxed",
            "text-[1.05rem] max-w-152",
            "max-md:text-[0.9rem] max-md:max-w-xs text-white",
          )}
        >
          {POLICY_CONTENT[type] || POLICY_CONTENT["default"]}
        </motion.p>
      </motion.div>
    </section>
  );
}
