"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ICONS } from "@/assets";
import { cn } from "@/lib/utils";
import leftMockup from "@/assets/team-left-img.png";

const features = [
  {
    id: "smart-inventory",
    title: "Smart Inventory Search",
    description:
      "Instantly locate any item with advanced filtering and real-time status tracking.",
    icon: ICONS.BlueMagnifyIcon,
  },
  {
    id: "automated-outreach",
    title: "Automated Guest Outreach",
    description:
      "Send personalized notifications via email or SMS as soon as an item is logged.",
    icon: ICONS.BlueElectricIcon,
  },
  {
    id: "zero-liability",
    title: "Zero Liability Framework",
    description:
      "Digital signatures and audit trails protect your property from liability claims.",
    icon: ICONS.BlueShieldIcon,
  },
  {
    id: "global-shipping",
    title: "Global Shipping Engine",
    description:
      "Automated customs forms and discounted rates for worldwide guest delivery.",
    icon: ICONS.BlueGlobeIcon,
  },
];

export default function DashboardHotelTeams() {
  const [activeFeature, setActiveFeature] = useState<string>("zero-liability");

  return (
    <section className="w-full bg-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-10 lg:mb-20 flex flex-col items-center gap-4">
          <h2 className="text-4xl font-bold text-primary-new leading-[150%] tracking-normal">
            Dashboard Built for Hotel Teams
          </h2>
          <p className="text-lg font-normal text-text-gray leading-[150%] tracking-normal max-w-4xl">
            Empower your housekeeping and concierge staff with tools that
            actually save time and reduce stress.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 max-w-[1170px] mx-auto w-full">
          <div className="w-full lg:max-w-[716px] shrink-0 relative">
            <div className="relative w-full aspect-4/3 lg:aspect-716/422">
              <Image
                src={leftMockup}
                alt="Dashboard Interface"
                fill
                className="object-contain text-white"
                priority
              />
            </div>
          </div>

          <div className="w-full lg:max-w-[430px] flex flex-col gap-4">
            {features.map((feature) => {
              const isActive = activeFeature === feature.id;

              return (
                <div
                  key={feature.id}
                  className={cn(
                    "flex flex-col p-6 rounded-2xl cursor-pointer transition-all duration-300",
                    "max-lg:bg-white max-lg:border-hotel-dashboard-border max-lg:shadow-[0px_3px_6px_-4px_rgba(0,0,0,0.1)] border border-transparent",
                    isActive &&
                      "lg:bg-white lg:border-hotel-dashboard-border-active lg:shadow-[0px_3px_6px_-4px_rgba(0,0,0,0.1)]",
                    !isActive && "lg:bg-transparent lg:hover:bg-slate-50/50",
                  )}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex items-center justify-center w-[40px] h-[40px] md:w-[36px] md:h-[36px] rounded-[10px] shrink-0 transition-colors duration-300",
                        "max-lg:bg-hotel-dashboard-icon-bg-mobile max-lg:text-white",
                        isActive
                          ? "lg:bg-hotel-dashboard-icon-bg-active lg:text-white"
                          : "lg:bg-hotel-dashboard-icon-bg lg:text-hotel-dashboard-icon-text",
                      )}
                    >
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={24}
                        height={24}
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          "max-lg:brightness-0 max-lg:invert",
                          isActive && "lg:brightness-0 lg:invert",
                        )}
                      />
                    </div>

                    <h3
                      className={cn(
                        "text-lg font-bold leading-[130%]",
                        isActive
                          ? "text-hotel-dashboard-card-title"
                          : "text-hotel-dashboard-card-title",
                      )}
                    >
                      {feature.title}
                    </h3>
                  </div>

                  <div className="hidden lg:block overflow-hidden">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.04, 0.62, 0.23, 0.98],
                          }}
                        >
                          <p className="text-sm text-hotel-dashboard-card-desc font-medium leading-[150%] pl-[64px] pt-2 pb-2">
                            {feature.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="lg:hidden mt-3 pl-14 md:pl-[76px]">
                    <p className="text-[16px] text-text-gray leading-[150%]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
