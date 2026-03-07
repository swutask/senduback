"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Headphones } from "lucide-react";
import bg from "@/assets/contact-hero-bg.png";
import { ICONS } from "@/assets";
import Link from "next/link";

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

const ShareIcon = () => (
  <Image src={ICONS["ContactSubmit"]} alt="card_icon" width={20} height={20} />
);

const stats = [
  { icon: ICONS["ItemsReturned"], label: "10,000+ Items Returned" },
  { icon: ICONS["ContactPartner"], label: "300+ Partner Hotels" },
  { icon: ICONS["ResponseHour"], label: "1-2 Hour Response" },
];

export default function ContactHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden",
        "min-h-[652px]",
        "flex items-center justify-center",
        "pt-32 md:pt-20 pb-7",
      )}
    >
      <Image
        src={bg}
        alt=""
        fill
        priority
        className="object-cover object-center select-none pointer-events-none"
        sizes="100vw"
        aria-hidden="true"
      />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className={cn(
          "relative z-10 flex flex-col",
          "items-start text-left px-5 gap-5 w-full",
          "md:items-center md:text-center md:px-[135px] md:gap-6",
        )}
      >
        <motion.div variants={fadeUpVariants}>
          <span
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2 rounded-full",
              "text-sm font-medium bg-soft-blue text-primary-new",
            )}
          >
            <Headphones className="w-4 h-4" />
            Contact Support
          </span>
        </motion.div>

        <div className="flex flex-col gap-3 md:items-center">
          <motion.h1
            variants={fadeUpVariants}
            className={cn(
              "font-bold leading-tight text-white",
              "text-[2rem] md:text-[3rem]",
            )}
          >
            Contact SendUBack Support
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className={cn(
              "font-medium leading-relaxed text-white",
              "text-[0.95rem] max-w-sm",
              "md:text-[1.25rem] md:max-w-xl",
            )}
          >
            Our team is here to help. Get in touch and we&apos;ll respond within
            1-2 hours during business hours.
          </motion.p>
        </div>

        <div className="flex flex-col gap-7 md:flex-col-reverse w-full">
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col w-full gap-3 md:flex-row md:w-auto md:items-center md:justify-center md:gap-4 mt-1"
          >
            <Link
              href={"#contact-form"}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[14px]",
                "bg-gradient-to-b from-blue-deep to-blue-medium hover:to-blue-500 transition-colors",
                "text-white font-medium text-base w-full md:w-auto",
              )}
            >
              Send a Message
              <ShareIcon />
            </Link>

            <Link href={"#reach-out"} className="w-full md:w-auto">
              <button
                className={cn(
                  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[14px]",
                  "bg-white/10 hover:bg-white/20 md:bg-white md:text-[#0B3B8F] transition-colors",
                  "border border-white/40 text-white font-medium text-base md:border-[#0B3B8F]",
                  "w-full md:w-auto hover:text-white hover:border-white",
                )}
              >
                View Help Center
              </button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-6 w-full mt-2",
              "md:flex md:flex-row md:items-center md:justify-center md:gap-6 md:w-auto md:mt-0",
            )}
          >
            {stats.map(({ icon, label }, i) => (
              <div
                key={label}
                className={cn(
                  "flex flex-col items-start gap-2",
                  i === stats.length - 1 && stats.length % 2 !== 0
                    ? "col-span-2 md:col-span-1"
                    : "",
                  "md:flex-row md:items-center",
                )}
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full md:w-8 md:h-8 flex-shrink-0">
                  <Image
                    src={icon}
                    alt={label}
                    width={40}
                    height={40}
                    className="md:w-5 md:h-5"
                  />
                </span>
                <span className="text-white text-[15px] font-medium leading-snug md:text-[16px] md:whitespace-nowrap">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
