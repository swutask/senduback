"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ICONS } from "@/assets";
import missionImg from "@/assets/about-mission-img.svg";

const features = [
  {
    title: "Secure return process",
    description: "End-to-end encryption and verification at every step",
    icon: ICONS.AboutSequre,
  },
  {
    title: "Transparent tracking",
    description: "Real-time updates from hotel to your doorstep",
    icon: ICONS.AboutTransparent,
  },
  {
    title: "Trusted by hotels worldwide",
    description: "Global network spanning major hospitality brands",
    icon: ICONS.AboutWorldBlue,
  },
];

export default function OurMissionSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex flex-col space-y-10 lg:space-y-12"
          >
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <h2 className="text-4xl font-extrabold text-blog-hea   tracking-tight">
                Our Mission
              </h2>
              <p className="text-text-body text-lg  font-normal leading-relaxed max-w-xl">
                We believe that losing something shouldn't mean losing it
                forever. Our mission is to bridge the gap between hotels and
                guests, creating a seamless system that turns the stress of loss
                into the relief of recovery.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xl mx-auto lg:mx-0">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                    className="flex items-start gap-4 md:gap-5 text-left"
                  >
                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#0096FF]">
                      {Icon && (
                        <Image
                          src={Icon}
                          alt={feature.title}
                          width={32}
                          height={32}
                          className="w-7 h-7 md:w-8 md:h-8"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 md:gap-1.5 pt-1">
                      <h3 className="text-xl font-semibold text-blog-he ">
                        {feature.title}
                      </h3>
                      <p className="text-text-body text-base">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden">
              <Image
                src={missionImg}
                alt="Our Mission Graphic"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
