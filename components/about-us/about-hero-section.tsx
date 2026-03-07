"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ICONS } from "@/assets";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/about-banner.png";
import rightMockup from "@/assets/about-right-img.png";

const statsCards = [
  {
    icon: ICONS.AboutItems,
    title: "10,000+",
    subtitle: "Items Successfully Returned",
  },
  {
    icon: ICONS.AboutCountries,
    title: "40+",
    subtitle: "Countries Served",
  },
  {
    icon: ICONS.AboutHotels,
    title: "300+",
    subtitle: "Partner Hotels",
  },
];

export default function AboutHeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A142D] pb-16 pt-48 md:pb-24"
      style={{
        backgroundImage: `url(${heroBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-full lg:w-1/2 text-white items-start text-left space-y-8"
          >
            <div className="space-y-2 max-w-lg">
              <h1 className="text-4xl lg:text-[44px] leading-tight font-bold tracking-tight">
                About SendUBack
              </h1>
              <p className="text-base font-medium text-white text-[20px]">
                Helping hotels and guests reconnect with what matters most.
              </p>
              <p className="text-sm font-normal text-white mt-7 leading-relaxed">
                We've built a modern platform that makes returning lost items
                seamless, secure, and stress-free. From luxury hotels to budget
                stays, SendUBack ensures every forgotten item finds its way
                home.
              </p>
            </div>

            <Link href="/" className="w-full md:w-fit">
              <button
                className={cn(
                  "inline-flex items-center justify-center gap-2",
                  "bg-white text-primary font-semibold",
                  "rounded-full w-full lg:rounded-2xl px-8 py-4 transition-all hover:scale-105",
                  "text-base sm:text-lg hover:shadow-lg",
                )}
              >
                Get Started
                <ArrowRight className="w-5 h-5 font-semibold" />
              </button>
            </Link>

            <div className="flex flex-wrap lg:flex-nowrap justify-start md:justify-center lg:justify-start gap-4 mt-8 lg:mt-12 w-full lg:w-[105%]">
              {statsCards.map((card, idx) => {
                const iconSrc = card.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    className={cn(
                      "flex flex-col items-center justify-center text-center",
                      "bg-white/10 border border-white/30 rounded-2xl",
                      "p-[12px] gap-[12px] flex-1 lg:flex-none min-w-[140px] max-w-[50%]",
                      "shadow-[0px_2px_8px_0px_rgba(0,0,0,0.05)]",
                      "backdrop-blur-sm",
                    )}
                  >
                    <div>
                      {iconSrc ? (
                        <Image
                          src={iconSrc}
                          alt={card.title}
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-white/20 rounded-md" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 items-center">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[13px] sm:text-sm text-white leading-tight">
                        {card.subtitle}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0 relative"
          >
            <div className="relative w-full md:max-w-2xl aspect-4/3 lg:aspect-auto lg:h-[600px]">
              <Image
                src={rightMockup}
                alt="SendUBack Platform Preview"
                fill
                priority
                className="object-contain lg:object-right"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
