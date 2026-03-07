"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ICONS } from "@/assets";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

const STEPS: Step[] = [
  {
    id: "1",
    number: "01",
    title: "Log item in dashboard",
    description: "Quick photo upload and guest matching",
    icon: ICONS["LogItem"],
  },
  {
    id: "2",
    number: "02",
    title: "Notify the guest",
    description: "Automated alerts, guest confirms and pays",
    icon: ICONS["NotifyBell"],
  },
  {
    id: "3",
    number: "03",
    title: "Hand over to courier",
    description: "Scheduled pickup, full tracking included",
    icon: ICONS["CourierIcon"],
  },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function SectionHeader({
  inView,
  align = "center",
}: {
  inView: boolean;
  align?: "center" | "left";
}) {
  return (
    <motion.header
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={headerVariants}
      className={cn(
        "flex flex-col gap-3 text-nowrap",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
      )}
    >
      <h2 className="font-bold leading-tight text-[#0D1B6E] text-[2.25rem] max-md:text-[2rem] ">
        How it works for{" "}
        <span className="bg-hightlight-heading bg-clip-text text-transparent">
          Hotels
        </span>
      </h2>
      <p className="text-[#9CA3C5] font-medium text-base">
        Return guest items in 3 simple steps
      </p>
    </motion.header>
  );
}

function CTAButtons({
  inView,
  fullWidth = false,
}: {
  inView: boolean;
  fullWidth?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={buttonVariants}
      transition={{ delay: 0.65 }}
      className={cn(
        "flex gap-4",
        fullWidth ? "flex-col w-full" : "flex-row items-center justify-center",
        "flex-col md:flex-row w-full md:w-auto text-nowrap",
      )}
    >
      <Link href={"/register"} className="w-full">
        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "flex items-center justify-center gap-2 font-semibold text-white rounded-full",
            "bg-gradient-to-r from-[#0099FF] to-[#000080]",
            "px-8 py-4 text-[15px] w-full",
            fullWidth && "w-full",
          )}
        >
          Register Business{" "}
          <span>
            <ArrowRight className="h-5 w-5" />
          </span>
        </motion.button>
      </Link>

      <Link href={"/"} className="w-full">
        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
          whileTap={{ scale: 0.97 }}
          className={cn(
            "flex items-center justify-center gap-2 font-semibold rounded-full",
            "border border-[#0099FF] text-[#0099FF] bg-white",
            "px-8 py-4 text-[15px] w-full",
            fullWidth && "w-full",
          )}
        >
          Learn More{" "}
          <span>
            <ArrowRight className="h-5 w-5" />
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
}

function DesktopCard({
  step,
  index,
}: {
  step: Step;
  index: number;
  inView: boolean;
}) {
  const isLast = index === STEPS.length - 1;

  return (
    <>
      <div className="relative z-20">
        <motion.div
          variants={itemVariants}
          whileHover={{
            y: -5,
            boxShadow: "12px 14px 20px 0px rgba(0,0,0,0.12)",
            transition: { duration: 0.2, ease: "easeOut" as const },
          }}
          className={cn(
            "bg-white rounded-[10px] border border-[#FFF2E7]",
            "shadow-[7.94px_8.36px_11.71px_0px_rgba(0,0,0,0.09)]",
            "pt-1 pr-[15px] pb-[15px] pl-[15px]",
            "flex flex-col gap-2.5",
            "will-change-transform cursor-default",
            "w-[15.58rem] h-[18.56rem]",
          )}
        >
          <div className="flex items-center justify-left">
            <span className="text-[1.5rem] font-bold text-[#73c1fe] tabular-nums">
              {step.number}
            </span>
            <div
              className={cn(
                "flex items-center justify-center",
                "absolute left-1/2 -translate-x-1/2",
              )}
            >
              <Image
                src={ICONS["DotCardIcon"]}
                alt="card_icon"
                width={32}
                height={32}
              />
            </div>
          </div>

          <div
            className={cn(
              "rounded-[12px] flex flex-col items-center justify-start",
              "bg-[#f0f5ff]",
              "p-5 h-full",
            )}
          >
            <Image src={step.icon} alt={step.title} width={56} height={56} />
            <div className="flex flex-col items-center gap-1.5 px-1">
              <h3 className="font-bold text-[#0D1B6E] text-[1rem] leading-snug text-center">
                {step.title}
              </h3>
              <p className="text-[#9CA3C5] text-[0.8rem] leading-relaxed text-center">
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {!isLast && (
        <Image
          src={ICONS["ArrowRight"]}
          alt="arrow"
          width={16}
          height={32}
          className="md:flex hidden"
        />
      )}
    </>
  );
}

function DesktopLayout() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center",
        "bg-[#F6FAFF] md:px-[135px] px-3 py-20 gap-[52px]",
        "min-h-[726px] justify-center",
      )}
    >
      <SectionHeader inView={inView} />

      <div className="relative">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="flex items-center justify-center gap-12 w-full flex-col md:flex-row"
        >
          {STEPS.map((step, index) => (
            <DesktopCard
              key={step.id}
              step={step}
              index={index}
              inView={inView}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={inView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "top center" }}
          className={cn(
            "pointer-events-none absolute",

            "left-1/2 -translate-x-1/2",
            "top-0",
            "h-[90%] w-4",
            "border-l-[3px] border-dashed",

            "md:top-[40%]",
            "md:h-4 md:w-[90%]",
            "md:border-l-0 md:border-t-[3px]",

            "border-primary-new/70",
          )}
        />
      </div>
      <CTAButtons inView={inView} />
    </div>
  );
}

const MOBILE_STEPS = [
  {
    id: "1",
    number: "01",
    title: "Find your location",
    description: "Select the hotel or property where you stayed",
    icon: ICONS["LocationIcon"],
  },
  {
    id: "2",
    number: "02",
    title: "Describe your item",
    description: "Tell us what you lost with key details",
    icon: ICONS["ClipBoardIcon"],
  },
  {
    id: "3",
    number: "03",
    title: "Choose delivery",
    description: "Pick how and where to receive your item",
    icon: ICONS["DeliveryIcon"],
  },
  {
    id: "4",
    number: "04",
    title: "Ship and pay",
    description: "Confirm shipping and pay securely online",
    icon: ICONS["PaymentCardIcon"],
  },
];

function MobileCard({ step }: { step: (typeof MOBILE_STEPS)[0] }) {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        variants={itemVariants}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "bg-white rounded-[20px]",
          "border border-white/30",
          "shadow-[0px_4px_24px_0px_rgba(0,0,128,0.06)]",
          "backdrop-blur-md",
          "p-8 flex flex-col justify-center items-center",
          "min-h-[130px] relative",
          "will-change-transform cursor-default",
        )}
      >
        <Image src={step.icon} alt="card_icon" width={64} height={64} />
        <div
          className={cn(
            "absolute -bottom-[0.1px] right-3",
            "translate-x-1/2 translate-y-1/2",
            "w-10 h-10 rounded-full",
            "bg-[#FBFCFD]",
            "flex items-center justify-center",
            "shadow-[0px_4px_24px_0px_#0000800F]",
          )}
        >
          <span className="text-blue-500 font-bold text-base tabular-nums">
            {step.number}
          </span>
        </div>
      </motion.div>

      <motion.div
        key={step.id}
        variants={itemVariants}
        className="flex flex-col gap-1 px-1"
      >
        <h3 className="font-bold text-[#0D1B6E] text-[18px] leading-snug text-center">
          {step.title}
        </h3>
        <p className="text-[#9CA3C5] text-[0.9rem] leading-relaxed text-center">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

function MobileLayout() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className={cn(
        "flex md:hidden flex-col",
        "bg-[#F6FAFF] px-4 py-20 gap-8",
        "min-h-[920px]",
      )}
    >
      <SectionHeader inView={inView} />

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-2 gap-3"
      >
        {MOBILE_STEPS.map((step) => (
          <MobileCard key={step.id} step={step} />
        ))}
      </motion.div>
      <CTAButtons inView={inView} fullWidth />
    </div>
  );
}

export default function HowItWorksHotels() {
  return (
    <>
      <DesktopLayout />
      {/* <MobileLayout /> */}
    </>
  );
}
