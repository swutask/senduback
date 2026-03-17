"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Headphones, Search, ArrowRight } from "lucide-react";
import bg from "@/assets/for-guests/hero-bg.png";
import mobile from "@/assets/for-guests/mobile.webp";
import { ICONS } from "@/assets";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const badges = [
  { icon: ICONS["GuestInsurence"], label: "Fully Insured" },
  { icon: ICONS["GuestTracking"], label: "Real-time Tracking" },
  { icon: ICONS["GuestSupport"], label: "24/7 Support" },
];

const steps = [
  {
    n: "01",
    title: "Find your location",
    sub: "Search for hotel or venue",
    link: "Browse popular hotels nearby",
    active: true,
  },
  { n: "02", title: "Describe your item", sub: "Select category and details" },
  { n: "03", title: "Choose delivery", sub: "Pick your delivery address" },
  { n: "04", title: "Ship and pay", sub: "Select speed and confirm" },
];

export default function GuestHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="relative w-full overflow-hidden">
      <Image
        src={bg}
        alt=""
        fill
        priority
        className="object-cover object-center select-none pointer-events-none"
        sizes="100vw"
        aria-hidden="true"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-hero-overlay/30"
      />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-[1440px]",
          "pt-[172px] pb-20 px-[135px]",
          "max-md:pt-24 max-md:pb-14 max-md:px-5",
        )}
      >
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className={cn(
            "flex items-start gap-11",
            "max-lg:flex-col max-lg:items-stretch",
          )}
        >
          <div className="flex flex-col gap-11 flex-1 min-w-0 sm:items-center items-start">
            <div className="flex flex-col gap-5 items-center justify-center sm:mt-0 mt-16 w-full">
              <motion.div variants={fadeUp}>
                <span
                  className={cn(
                    "inline-flex gap-2 rounded-full border border-white/20",
                    "bg-soft-blue text-primary-new px-4 py-1.5",
                    "text-[14px] font-medium tracking-widest uppercase sm:text-center",
                  )}
                >
                  <Headphones className="w-4 h-4" />
                  For Guests
                </span>
              </motion.div>

              <div>
                <motion.h1
                  variants={fadeUp}
                  className={cn(
                    "font-bold leading-[1.08] text-white",
                    "text-[3.5rem] max-lg:text-[2.5rem] max-md:text-[2rem] sm:text-center",
                  )}
                >
                  Left Something Behind?
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="md:text-nowrap text-white leading-relaxed text-[18px] sm:text-center"
                >
                  Get your lost items returned from any hotel — fast, secure,
                  and fully insured.
                </motion.p>
              </div>

              <motion.div
                variants={fadeUp}
                className="hidden md:flex flex-wrap gap-3"
              >
                {badges.map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center text-[14px]">
                      <Image
                        src={icon}
                        alt={label}
                        width={40}
                        height={40}
                        className="pointer-events-none select-none"
                      />
                    </span>
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-0 sm:px-0 px-2 w-full">
              <motion.div
                variants={fadeUp}
                className={cn(
                  "rounded-3xl bg-white",
                  "p-6 flex flex-col sm:ap-1",
                  "shadow-soft h-fit",
                  "w-full px-4 sm:min-w-[300px]",
                )}
              >
                {steps.map((step) => (
                  <div
                    key={step.n}
                    className={cn(
                      "flex flex-col gap-1 rounded-lg p-4 transition-colors",
                      step.active
                        ? "bg-surface-soft-blue border-l-4 border-accent"
                        : "border-l-4 border-transparent",
                    )}
                  >
                    <div className="flex flex-col items-start pt-0.5">
                      <span className="text-[10px] font-bold tracking-widest text-text-placeholder uppercase">
                        Step {step.n}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1">
                      <p
                        className={cn(
                          "font-bold text-text-strong",
                          step.active ? "text-base" : "text-sm",
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-text-subtle">{step.sub}</p>

                      {step.active && (
                        <>
                          <Link
                            href="#"
                            className="mt-1 text-xs font-semibold text-accent hover:underline"
                          >
                            {step.link}
                          </Link>
                          <div
                            className={cn(
                              "mt-3 flex items-center gap-2 rounded-[12px] border border-border-input",
                              "bg-white px-3 py-2.5 shadow-sm max-w-[350px]",
                            )}
                          >
                            <Search className="w-4 h-4 text-text-placeholder shrink-0" />
                            <span className="text-sm text-text-placeholder">
                              Search by hotel name or location
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-2 px-4">
                  <Link
                    href="/#found"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full",
                      "bg-gradient-to-r from-active to-primary-new transition-colors",
                      "px-7 py-3.5 text-sm font-semibold text-white",
                    )}
                  >
                    Recover My Item
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex md:w-90 sm:w-80 sm:mt-6 shrink-0 items-center justify-center overflow-hidden"
              >
                <Image
                  src={mobile}
                  alt="App mobile screenshot"
                  className="pointer-events-none select-none"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
