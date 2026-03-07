"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  animate,
  type Variants,
  type TargetAndTransition,
} from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ICONS } from "@/assets";

interface StatConfig {
  id: string;
  target: number;
  format: (v: number) => string;
  label: string;
  icon: string;
  cardDelay: number;
  iconDelay: number;
  countDelay: number;
}

const STATS: StatConfig[] = [
  {
    id: "items",
    target: 10000,
    format: (v) =>
      v >= 10000
        ? "10,000+"
        : v >= 1000
          ? `${Math.floor(v / 1000)},${String(Math.floor(v % 1000)).padStart(3, "0")}`
          : String(Math.floor(v)),
    label: "Items Successfully Returned",
    icon: ICONS["StatsCube"],
    cardDelay: 0,
    iconDelay: 0.12,
    countDelay: 0.28,
  },
  {
    id: "countries",
    target: 40,
    format: (v) => `${Math.floor(v)}+`,
    label: "Countries Served",
    icon: ICONS["StatsGlobe"],
    cardDelay: 0.14,
    iconDelay: 0.26,
    countDelay: 0.42,
  },
  {
    id: "hotels",
    target: 300,
    format: (v) => `${Math.floor(v)}+`,
    label: "Partner Hotels",
    icon: ICONS["StatsHotels"],
    cardDelay: 0.28,
    iconDelay: 0.4,
    countDelay: 0.56,
  },
];

interface CounterProps {
  target: number;
  format: (v: number) => string;
  inView: boolean;
  delay?: number;
}

function Counter({ target, format, inView, delay = 0 }: CounterProps) {
  const [val, setVal] = useState<number>(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const timeout = setTimeout(() => {
      const controls = animate(0, target, {
        duration: 2.4,
        ease: [0.12, 0.9, 0.22, 1.0] as [number, number, number, number],
        onUpdate: (v) => setVal(v),
        onComplete: () => setVal(target),
      });

      return () => controls.stop();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [inView, target, delay]);

  return <span>{format(val)}</span>;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (d: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: d,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const iconVariants: Variants = {
  hidden: { scale: 0.3, opacity: 0, rotate: -12 },
  visible: (d: number): TargetAndTransition => ({
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      delay: d,
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

interface StatCardProps {
  stat: StatConfig;
  inView: boolean;
}

function StatCard({ stat, inView }: StatCardProps) {
  return (
    <motion.div
      custom={stat.cardDelay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{
        y: -7,
        boxShadow: "0 20px 48px var(--stats-card-hover-shadow)",
        transition: { duration: 0.2, ease: "easeOut" as const },
      }}
      className={cn(
        "bg-white rounded-2xl",
        "flex flex-col items-center gap-4",
        "px-8 py-10",
        "shadow-[0_2px_16px_var(--stats-card-shadow)]",
        "cursor-default select-none will-change-transform",
      )}
    >
      <motion.div
        custom={stat.iconDelay}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={iconVariants}
        className={cn(
          "w-14 h-14 rounded-[14px]",
          "flex items-center justify-center",
        )}
      >
        <Image src={stat.icon} alt="stats_icon" width={40} height={40} />
      </motion.div>

      <p
        className={cn(
          "text-[2.25rem] font-semibold leading-none",
          "tracking-tight text-stats-count",
          "tabular-nums text-center min-w-28",
        )}
      >
        <Counter
          target={stat.target}
          format={stat.format}
          inView={inView}
          delay={stat.countDelay}
        />
      </p>

      <p className="text-sm font-semibold text-stats-label text-center leading-snug">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col items-center",
        "bg-stats-section-bg",
        "px-[213px] py-20 gap-[52px]",
        "max-md:px-4 max-md:gap-8",
      )}
    >
      <motion.header
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <h2
          className={cn(
            "font-bold leading-tight text-stats-heading",
            "text-[2.25rem] max-md:text-[1.875rem]",
          )}
        >
          Trusted by Guests &amp; Hotels Worldwide
        </h2>

        <p className="text-base text-stats-subtext font-medium max-w-sm md:text-nowrap">
          Helping thousands of guests recover what matters most.
        </p>
      </motion.header>

      <div
        className={cn("grid w-full gap-6", "grid-cols-3 max-md:grid-cols-1")}
      >
        {STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} inView={inView} />
        ))}
      </div>
    </section>
  );
}
