"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ICONS } from "@/assets";

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ICONS.ZeroLiabilityPng,
    title: "Zero Liability",
    description:
      "Once the item is handed to SendUBack, we manage delivery, tracking, and claims.",
  },
  {
    icon: ICONS.ZeroCostPng,
    title: "Zero Cost",
    description:
      "Hotels don't pay shipping fees — guests cover the costs during booking.",
  },
  {
    icon: ICONS.MinimalEffortPng,
    title: "Minimal Effort",
    description:
      "Once the item is handed to SendUBack, we manage delivery, tracking, and claims.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <motion.div
    variants={cardVariants}
    className="flex flex-col items-center text-center bg-white rounded-2xl p-8 lg:p-[42px] shadow-[0px_10px_40px_0px_rgba(0,0,0,0.03)]"
  >
    <div className="w-16 h-16 shrink-0 mb-6">
      <Image
        src={feature.icon}
        alt={feature.title}
        width={64}
        height={64}
        className="w-full h-full object-contain"
      />
    </div>

    <h3 className="text-xl lg:text-[22px] font-bold text-primary-new mb-3 leading-[140%]">
      {feature.title}
    </h3>

    <p className="text-[15px] lg:text-[16px] text-text-gray leading-[160%] max-w-[280px]">
      {feature.description}
    </p>
  </motion.div>
);

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-hotel-section-bg py-10 lg:py-20">
      <div className="max-w-[1170px] mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center gap-12 lg:gap-16"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.h2
              variants={fadeUpVariants}
              className="text-[32px] md:text-[40px] font-bold text-primary-new leading-[130%]"
            >
              Why hotels choose us
            </motion.h2>
          </div>

          <motion.div
            variants={containerVariants}
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
