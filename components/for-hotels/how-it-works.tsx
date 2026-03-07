"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ICONS } from "@/assets";

import logFoundItems from "@/assets/log-found-items.png";
import notifyUser from "@/assets/notify-user.png";
import teamLeftImg from "@/assets/courier.png";

const steps = [
  {
    id: 1,
    title: "Log found item",
    description:
      "Log the found item in seconds using the SendUBack dashboard. No paperwork, no emails, no follow-ups.",
    features: [
      "Log the found item in seconds using the SendUBack dashboard",
      "No paperwork, no emails, no follow-ups",
    ],
    image: logFoundItems,
    imagePosition: "right",
  },
  {
    id: 2,
    title: "Notify the guest",
    description:
      "Send a secure booking link to the guest. The guest completes delivery details and payment directly on SendUBack.",
    features: [
      "Send a secure booking link to the guest",
      "The guest completes delivery details and payment directly on SendUBack",
    ],
    image: notifyUser,
    imagePosition: "left",
  },
  {
    id: 3,
    title: "Hand Over to Courier",
    description:
      "Simply hand the item to the SendUBack courier. Shipping, tracking, insurance, and support are fully handled by SendUBack.",
    features: [
      "Simply hand the item to the SendUBack courier",
      "Shipping, tracking, insurance, and support are fully handled by SendUBack",
    ],
    image: teamLeftImg,
    imagePosition: "right",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HowItWorks() {
  return (
    <section className="w-full bg-hotel-section-bg py-10 lg:py-20 overflow-hidden">
      <motion.div
        className="max-w-[1170px] mx-auto px-4 md:px-8 flex flex-col gap-16 lg:gap-32"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div
          variants={itemVariants}
          className="text-center flex flex-col items-center gap-4"
        >
          <h2 className="text-4xl md:text-[40px] font-bold text-primary-new leading-[130%] tracking-normal">
            How it works
          </h2>
          <p className="text-base md:text-lg font-normal text-text-gray leading-[150%] tracking-normal">
            Return guest items in 3 simple steps
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 w-full">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center lg:justify-between gap-6 w-full",
                step.imagePosition === "left"
                  ? "lg:flex-row-reverse"
                  : "lg:flex-row",
              )}
            >
              <motion.div
                variants={itemVariants}
                className="w-full flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center justify-center w-[54px] h-[54px] rounded-full bg-linear-to-b from-blue-deep to-blue-mid text-white text-2xl font-bold shrink-0 mb-6">
                    {step.id}
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-primary-new leading-[130%] mb-4">
                    {step.title}
                  </h3>
                  <p className="text-base text-text-gray md:text-left leading-[160%] mb-8">
                    {step.description}
                  </p>
                </div>

                <div className="flex flex-col gap-4 items-start w-fit mx-auto lg:mx-0">
                  {step.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1 md:gap-3 text-left w-full"
                    >
                      <Image
                        src={ICONS.BlueCircleTick}
                        alt="Check"
                        width={20}
                        height={20}
                        className="w-5 h-5 shrink-0 mt-[2px]"
                      />
                      <span className="text-text-gray text-base text-center md:text-left leading-[150%] max-w-[300px] lg:max-w-none">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="w-full lg:w-1/2 shrink-0"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  width={600}
                  height={354}
                  className={cn(
                    "w-full h-auto rounded-[16px]",
                    step.id === 3 && "w-100 md:ml-18 max-h-136 aspect-1/2",
                  )}
                  priority={step.id === 1}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
