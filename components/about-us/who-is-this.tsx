"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/assets";
import bannerBg from "@/assets/who-is-this-banner.svg";
import { cn } from "@/lib/utils";
import Link from "next/link";

const guestFeatures = [
  "Report lost items in seconds from anywhere",
  "Track your item's journey with real-time updates",
  "Receive your belongings safely at your doorstep",
  "Zero hassle with prepaid, insured shipping",
];

const hotelFeatures = [
  "Streamline your lost & found operations",
  "Zero liability - we handle shipping & insurance",
  "Boost guest satisfaction with premium service",
  "Dashboard analytics to track all returns",
];

const cardClasses = cn(
  "flex-1 rounded-xl p-8 md:p-10 border border-white/10",
  "bg-white/5 backdrop-blur-xl flex flex-col shadow-2xl",
);

const iconWrapperClasses = cn(
  "w-16 h-16 rounded-2xl bg-linear-to-br from-[#0099FF] to-[#000080]",
  "flex items-center justify-center mb-8 shadow-lg",
);

const buttonClasses = cn(
  "w-full md:w-[60%] mt-auto bg-[#0099FF] hover:bg-[#000080]",
  "text-white rounded-[14px] h-14 text-base",
  "font-semibold transition-all group",
);

export default function WhoIsThis() {
  return (
    <section
      className="relative w-full py-20 md:py-32 overflow-hidden bg-who-is-this-bg"
      style={{
        backgroundImage: `url(${bannerBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight"
          >
            Who is this for?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-white"
          >
            Choose your role to get started quickly.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cardClasses}
          >
            <div className={iconWrapperClasses}>
              <Users className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-8">
              For Guests
            </h3>

            <ul className="space-y-5 flex-1 mb-10">
              {guestFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <Image
                    src={ICONS.CircleTick}
                    alt="Check"
                    className="w-5 h-5 mt-0.5 shrink-0"
                  />
                  <span className="text-base text-white leading-relaxed font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link href={"/#found"}>
              <Button className={buttonClasses}>
                Get My Item Back
                <ArrowRight className="w-[18px] h-[18px] ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cardClasses}
          >
            <div className={iconWrapperClasses}>
              <Building2 className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-semibold text-white mb-8">
              For Hotels
            </h3>

            <ul className="space-y-5 flex-1 mb-10">
              {hotelFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <Image
                    src={ICONS.CircleTick}
                    alt="Check"
                    className="w-5 h-5 mt-0.5 shrink-0"
                  />
                  <span className="text-base text-white leading-relaxed font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link href={"/for-hotels"}>
              <Button className={buttonClasses}>
                Manage Lost Items
                <ArrowRight className="w-[18px] h-[18px] ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
