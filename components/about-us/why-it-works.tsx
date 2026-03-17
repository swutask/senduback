"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ICONS } from "@/assets";

const CardIcon = ({ src }: { src: string }) => (
  <Image src={src} alt="card_icon" />
);

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <CardIcon src={ICONS["ZeroLiability"]} />,
    title: "Zero liability for hotels",
    description:
      "Once an item is handed over, SendUBack fully manages delivery, insurance, and claims, ensuring hotels have zero risk.",
  },
  {
    icon: <CardIcon src={ICONS["SimpleProcess"]} />,
    title: "Simple, structured process",
    description:
      "Replaces emails, phone calls, and spreadsheets with a single, clear workflow that saves staff time and reduces errors.",
  },
  {
    icon: <CardIcon src={ICONS["WeCareSecurity"] || ICONS["security"]} />,
    title: "Secure, insured delivery",
    description:
      "Every shipment is fully insured, tracked end-to-end, and managed professionally to ensure items are returned safely and reliably.",
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
    className="flex flex-col items-center text-center bg-linear-to-b from-we-care-from to-white border-t border-we-care-border rounded-2xl p-6 md:p-8 flex-1 min-w-0 shadow-sm"
  >
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
      {feature.icon}
    </div>

    <h3 className="text-xl font-semibold text-primary mb-3 leading-snug">
      {feature.title}
    </h3>

    <p className="text-[17px] text-we-care-text leading-relaxed">
      {feature.description}
    </p>
  </motion.div>
);

export default function WhyItWorks() {
  return (
    <section className="w-full bg-white py-20 pb-28">
      <div className="max-w-7xl mx-auto px-[35px] max-md:px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center gap-[52px] max-md:gap-8"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <motion.h2
              variants={fadeUpVariants}
              className="text-[34px] md:text-[38px] font-bold text-primary leading-tight tracking-tight"
            >
              Why It Works
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-[16px] text-slate-500 leading-relaxed"
            >
              A system designed for simplicity, security, and peace of mind
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
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
