"use client";

import { motion, useInView, type Variants } from "framer-motion";

import airbnb from "@/lib/icons/airbnb.png";
import airport from "@/lib/icons/airport.png";
import event from "@/lib/icons/event.png";
import hospital from "@/lib/icons/hospital.png";
import hotel from "@/lib/icons/hotel.png";
import intercityBus from "@/lib/icons/intercity-bus.png";
import museum from "@/lib/icons/museum.png";
import rentCar from "@/lib/icons/rent-car.png";
import ship from "@/lib/icons/ship.png";
import trainStation from "@/lib/icons/train-station.png";
import travelAgency from "@/lib/icons/travel-agency.png";
import stadiumIcon from "@/lib/icons/Stadium-or-sport-arena.png";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { Category, CategoryCardV2 } from "./category-card";
import { ICONS } from "@/assets";
import Image from "next/image";

const CATEGORIES: Category[] = [
  { id: "1", key: "hotel", label: "Hotel", icon: hotel },
  { id: "2", key: "airport", label: "Airport", icon: airport },
  { id: "3", key: "car-rental", label: "Car Rental", icon: rentCar },
  { id: "4", key: "ship", label: "Ship", icon: ship },
  { id: "5", key: "airbnb", label: "Airbnb", icon: airbnb },
  { id: "6", key: "hospital", label: "Hospital", icon: hospital },
  { id: "7", key: "travel-agency", label: "Travel", icon: travelAgency },
  { id: "8", key: "event", label: "Event", icon: event },
  { id: "9", key: "museum", label: "Museum", icon: museum },
  { id: "10", key: "intercity-bus", label: "Bus", icon: intercityBus },
  { id: "11", key: "train-station", label: "Train", icon: trainStation },
  { id: "12", key: "stadium", label: "Stadium", icon: stadiumIcon },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.2 },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export default function FoundAtSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className={cn(
        "flex flex-col items-center",
        "bg-white px-[200px] py-20 gap-0 md:gap-8",
        "max-md:bg-found-mobile-bg max-md:px-4 gap-6",
      )}
    >
      <motion.header
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={headerVariants}
        className="flex flex-col items-center md:gap-3 gap-2 text-center"
      >
        <h2
          className={cn(
            "font-bold leading-tight",
            "md:text-[2.25rem] text-[1.5rem]",
          )}
        >
          <span className="text-found-heading">Where was your item </span>
          <span className="bg-hightlight-heading bg-clip-text text-transparent">
            found?
          </span>
        </h2>

        <p className="text-found-subtext font-medium md:text-base text-[14px] max-w-xs md:max-w-sm text-nowrap">
          Choose the location where your item was found.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={gridVariants}
        className={cn(
          "grid grid-cols-3 gap-2 w-full",
          "md:flex md:flex-wrap md:justify-center md:gap-3",
        )}
      >
        {CATEGORIES.map((category) => (
          <div key={category.id} className="md:w-[138px] md:flex-none">
            <CategoryCardV2 category={category} />
          </div>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={badgeVariants}
        transition={{ delay: 0.6 }}
        className="flex items-center gap-6 text-badge-blue"
      >
        {[
          { icon: ICONS["SecureIcon"], label: "Secure" },
          { icon: ICONS["TrackableIcon"], label: "Trackable" },
          { icon: ICONS["TrustedIcon"], label: "Trusted" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 text-sm text-black"
          >
            <Image src={icon} alt={label} width={14} height={14} />
            <span>{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
