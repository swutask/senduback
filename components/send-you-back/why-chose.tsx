"use client";

import { ShieldCheck, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Insured",
    description:
      "Every shipment is fully insured and trackable from pickup to delivery.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "We work with hotels across 30+ countries on every continent.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Most items are shipped within 48 hours of your request.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
