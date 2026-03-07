"use client";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ICONS } from "@/assets";

const CardIcon = ({ src }: { src: string }) => (
  <Image src={src} alt="card_icon" width={44} height={44} />
);

const ArrowRightIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

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
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant: "primary" | "outline";
  href?: string;
}

const Card = ({
  icon,
  title,
  description,
  buttonLabel,
  buttonVariant,
  href = "#",
}: CardProps) => (
  <motion.div
    variants={cardVariants}
    whileHover={{ y: -4, transition: { duration: 0.25, ease: "easeOut" } }}
    className="relative flex flex-col items-center text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-100 overflow-hidden flex-1"
  >
    <div className="absolute top-0 left-1 right-1 h-1 rounded-b-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800" />

    <div className="flex items-center justify-center mb-5 mt-4">{icon}</div>

    <h3 className="text-[20px] font-bold text-[#0d1b8e] mb-3">{title}</h3>

    <p className="text-[16px] text-slate-500 leading-relaxed mb-7 ">
      {description}
    </p>

    <a
      href={href}
      className={`
        sm:w-fit w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200
        ${
          buttonVariant === "primary"
            ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 shadow-md shadow-blue-200"
            : "border-2 border-slate-200 text-[#0d1b8e] hover:border-blue-300 hover:bg-blue-50"
        }
      `}
    >
      {buttonLabel}
      <ArrowRightIcon />
    </a>
  </motion.div>
);

export default function GetStarted() {
  return (
    <section className="bg-fade-white w-full">
      <div className="max-w-[1440px] mx-auto px-[135px] max-md:px-4 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col items-center gap-[52px]"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div variants={fadeUpVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/60 text-blue-500 text-[11px] font-semibold uppercase tracking-[0.12em]">
                <Image
                  src={ICONS["star"]}
                  alt="card_icon"
                  width={14}
                  height={14}
                />
                Get Started
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              className="text-[42px] max-md:text-[36px] font-bold text-[#0d1b8e] leading-tight tracking-tight"
            >
              Ready to get started?
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="text-[16px] text-slate-500 leading-relaxed max-w-[520px]"
            >
              Whether you're a guest recovering a lost item or a hotel
              streamlining operations — we've got you covered.
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-[820px] mx-auto">
            <Card
              icon={<CardIcon src={ICONS["deliveryBox"]} />}
              title="For Guests"
              description="Get your lost items back quickly, securely, and fully tracked"
              buttonLabel="Get My Item Back"
              buttonVariant="primary"
              href="/#found"
            />
            <Card
              icon={<CardIcon src={ICONS["hotels"]} />}
              title="For Hotels"
              href="/for-hotels"
              description="Streamline your lost & found with zero cost and zero hassle"
              buttonLabel="For Hotels"
              buttonVariant="outline"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
