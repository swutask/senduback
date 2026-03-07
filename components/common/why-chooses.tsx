"use client";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ICONS } from "@/assets";
import { cn } from "@/lib/utils";

const CardIcon = ({ src }: { src: string }) => (
  <Image src={src} alt="card_icon" width={56} height={56} />
);

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface WhyChooseProps {
  variant?: "hotels" | "guests";
}

const hotelFeatures: Feature[] = [
  {
    icon: <CardIcon src={ICONS["StaffTime"]} />,
    title: "Save Staff Time",
    description: "Automated workflows replace manual coordination",
  },
  {
    icon: <CardIcon src={ICONS["PaymentIcon"]} />,
    title: "Guest Pays Online",
    description: "Zero cost to your property — guests cover shipping",
  },
  {
    icon: <CardIcon src={ICONS["StarRating"]} />,
    title: "Boost Guest Satisfaction",
    description: "Turn a negative moment into a 5-star experience",
  },
  {
    icon: <CardIcon src={ICONS["SupportIcon"]} />,
    title: "Dedicated Support",
    description: "Our team handles every enquiry end to end",
  },
];

const guestFeatures: Feature[] = [
  {
    icon: <CardIcon src={ICONS["TrustIcon"]} />,
    title: "Secure & Trusted",
    description: "End-to-end tracking with insured shipments",
  },
  {
    icon: <CardIcon src={ICONS["FastIcon"]} />,
    title: "Fast & Simple",
    description: "Request your item back in under 2 minutes",
  },
  {
    icon: <CardIcon src={ICONS["GlobeIcon"]} />,
    title: "Worldwide Delivery",
    description: "We ship to any address across the globe",
  },
  {
    icon: <CardIcon src={ICONS["HassleFree"]} />,
    title: "Hassle-Free",
    description: "No awkward calls — we handle everything",
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

const FeatureCard = ({
  feature,
  variant,
}: {
  feature: Feature;
  variant: WhyChooseProps["variant"];
}) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, transition: { duration: 0.22, ease: "easeOut" } }}
    className={cn(
      "flex flex-col items-center text-center bg-white rounded-2xl p-5 sm:p-7 shadow-sm flex-1 max-w-[238px]",
      variant === "hotels" && "max-w-[300px]",
    )}
  >
    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
      {feature.icon}
    </div>

    <h3 className="text-[12px] md:text-[16px] font-bold text-[#0d1b8e] mb-2.5 leading-snug">
      {feature.title}
    </h3>

    <p className="text-[14px] text-slate-500 leading-relaxed">
      {feature.description}
    </p>
  </motion.div>
);

export default function WhyChoose({ variant = "hotels" }: WhyChooseProps) {
  const isHotels = variant === "hotels";
  const features = isHotels ? hotelFeatures : guestFeatures;

  const heading = isHotels
    ? { prefix: "Why hotels choose ", highlight: "SendUBack" }
    : { prefix: "Why guests choose ", highlight: "SendUBack" };

  const subtext = isHotels
    ? "The smart solution for returning guest belongings"
    : "The easiest way to get your lost items returned";

  return (
    <section className="w-full bg-secondary">
      <div className="max-w-[1440px] mx-auto px-[35px] max-md:px-4 py-20">
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
              className="text-[38px] max-md:text-[34px] font-bold  text-[#0d1b8e] leading-tight tracking-tight"
            >
              {heading.prefix}{" "}
              <span className="inline-block bg-gradient-to-r from-hightlight-heading via-[#1d4ed8] to-[#1e3a8a] bg-clip-text text-transparent">
                {heading.highlight}
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUpVariants}
              className="text-[16px] text-slate-500 leading-relaxed"
            >
              {subtext}
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            className={cn(
              "w-fit grid md:grid-cols-4 gap-5",
              !isHotels && "grid-cols-2",
            )}
          >
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                variant={variant}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
