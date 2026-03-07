"use client";

import { Button } from "@/components/ui/button";
import Document from "@/assets/for-guests/Step 1 Go to www.senduback.com.png";
import Delivery from "@/assets/for-guests/Step 2 Book your shipment .png";
import Credit from "@/assets/for-guests/Step 3 Pay Securly.png";
import Location from "@/assets/for-guests/Step 4 Track your order .png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Step {
  id: number;
  title: string;
  image: StaticImageData;
}

const DEFAULT_STEPS: Step[] = [
  { id: 1, title: "Tell us about the item", image: Delivery },
  { id: 2, title: "Confirm pickup & delivery", image: Document },
  { id: 3, title: "Pay securely", image: Credit },
  { id: 4, title: "Track to your door", image: Location },
];

interface HowItWorksProps {
  steps?: Step[];
  onBookNow?: () => void;
}

export function WorksForGuestsSection({
  steps = DEFAULT_STEPS,
  onBookNow,
}: HowItWorksProps) {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-16 md:py-24 px-4 lg:px-8 bg-[linear-gradient(180deg,#e6f2ff_0%,#e6f2ff_8%,white_8%,white_92%,#e6f2ff_92%,#e6f2ff_100%)] overflow-hidden">
      <div className="max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
            How it works for <span className="text-primary-new">Guests</span>
          </h2>
          <p className="md:text-xl leading-relaxed">
            Get your lost item back in 4 simple steps
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 md:py-10"
        >
          {steps.map((step, index) => {
            const fromLeft = index < 2;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative text-center bg-secondary rounded-3xl overflow-hidden hover:scale-105 duration-300 ease-in"
              >
                <div className="w-full md:h-72 mb-4 flex items-center justify-center">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className="absolute bottom-17 right-2 w-9 h-9 flex items-center justify-center font-bold text-white border backdrop-blur-3xl"
                  style={{
                    borderRadius: "11.333px",
                    borderStyle: "outset",
                    background:
                      "linear-gradient(0deg, #0087EF -28.99%, rgba(0, 0, 0, 0.20) 109.6%)",
                  }}
                >
                  0{step.id}
                </div>

                <h3 className="md:text-lg font-semibold text-black pb-4">
                  {step.title}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center"
        >
          <Link href="/#found">
            <Button
              onClick={onBookNow}
              className="text-white px-9 py-6 rounded-2xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
            >
              Book Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
