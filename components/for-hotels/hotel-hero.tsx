"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ICONS } from "@/assets";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/for-hotels-banner.png";
import dashboardImg from "@/assets/new-img/new-hero-dashboard.png";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: ICONS.HotelBox,
    title: "Log items in seconds",
  },
  {
    icon: ICONS.HotelBell,
    title: "Auto-notify guests",
  },
  {
    icon: ICONS.HotelHassle,
    title: "Hassle-free shipping",
  },
  {
    icon: ICONS.HotelHassle,
    title: "Liability-free shipping",
  },
];

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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const primaryBtnClasses = cn(
  "w-full sm:w-auto h-14 rounded-xl md:rounded-lg lg:rounded-2xl",
  "bg-hotel-hero-btn hover:bg-hotel-hero-btn-hover px-10 text-[17px]",
  "font-bold text-white transition-all shadow-xl",
);

const secondaryBtnClasses = cn(
  "w-full sm:w-auto h-14 rounded-xl md:rounded-lg lg:rounded-2xl",
  "border-transparent bg-white px-10 text-[17px] font-bold",
  "text-hotel-hero-btn-text hover:bg-white/90 transition-transform hover:scale-105 shadow-xl",
);

export default function HotelHero() {
  const router = useRouter();
  return (
    <section
      className="relative w-full overflow-hidden bg-hotel-hero-bg pb-16 pt-48 lg:pb-32"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="z-10 relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col w-full lg:w-[55%] text-white items-start text-left space-y-4"
          >
            <motion.div
              variants={fadeUpVariants}
              className="space-y-6 max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-hotel-hero-badge-border/30 bg-hotel-hero-badge-bg py-2 px-5 backdrop-blur-sm">
                <p className="text-sm font-semibold text-hotel-hero-badge-text">
                  Trusted by 500+ Hotels Worldwide
                </p>
              </div>

              <h1 className="text-4xl md:text-[44px] leading-normal font-bold tracking-tight text-white mb-2">
                The Lost & Found{" "}
                <span className="hidden lg:inline">Platform</span>{" "}
                <br className="hidden md:block" />
                <span className="text-hotel-hero-highlight">
                  Built for Modern Hotels
                </span>
              </h1>

              <p className="text-white text-lg  max-w-xl leading-relaxed">
                Automate item tracking, guest notifications, and international
                shipping in one unified dashboard. Eliminate liability and
                delight your guests with seamless recovery.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="flex flex-col sm:flex-row gap-4 w-full pt-2"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <Button className={primaryBtnClasses}>Register Business</Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => router.replace("/contact")}
                className={secondaryBtnClasses}
              >
                Book a Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              className="grid grid-cols-2 gap-y-8 gap-x-6 mt-2 w-full max-w-lg pt-4"
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex flex-col lg:flex-row items-center gap-4"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-hotel-hero-icon shrink-0 shadow-lg">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="text-[15px] md:text-base font-semibold text-white leading-tight">
                    {feature.title}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-[50%] flex justify-center items-center mt-6 lg:mt-0 relative"
          >
            <div className="relative w-full max-w-4xl">
              <Image
                src={dashboardImg}
                alt="Dashboard Preview"
                priority
                className="w-full max-h-[700px] object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
