"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ICONS } from "@/assets";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Find Your Location",
    description: "Select the hotel or property where you stayed",
    icon: ICONS.cardLocation,
    content: (
      <div className="mt-6 flex w-full items-center rounded-xl bg-gray-50 border border-gray-100 shadow-xs">
        <div className="flex flex-1 items-center px-3">
          <Image
            src={ICONS.magnifier}
            alt="icon"
            className="mr-2 w-4 h-4 md:w-6 md:h-6"
            unoptimized
          />

          <Input
            type="text"
            placeholder="Search hotel or city"
            className="border-none p-0 bg-transparent placeholder:text-sm md:h-10 md:my-2  rounded-l-xl shadow-none focus-visible:ring-0 text-base"
            readOnly
          />
        </div>
        <Button className="h-full w-16 bg-linear-to-b rounded-r-xl from-active to-primary-new p-0 flex items-center justify-center shrink-0">
          <ArrowRight className="h-8 w-8" />
        </Button>
      </div>
    ),
  },
  {
    id: 2,
    title: "Describe Your Item",
    description: "Tell us what you lost with key details",
    icon: ICONS.bxDetail,
    content: (
      <div className="mt-6 flex flex-wrap justify-center gap-1 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-border-light px-4 py-2 text-sm text-gray-600 bg-white shadow">
          <Image
            src={ICONS.mdiCameraOutline}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Photo</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-border-light px-4 py-2 text-sm text-gray-600 bg-white shadow">
          <Image
            src={ICONS.icSharpCategory}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Category</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-border-light px-4 py-2 text-sm text-gray-600 bg-white shadow">
          <Image
            src={ICONS.materialSymbolsList}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Details</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Choose Delivery",
    description: "Pick how & where to receive your item",
    icon: ICONS.chooseDelivery,
    content: (
      <div className="mt-6 flex flex-wrap justify-center gap-1 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 bg-white shadow-sm">
          <Image
            src={ICONS.deliveryHome}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Home</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 px-4 py-2 text-[12px] sm:text-sm text-gray-600 bg-white shadow-sm">
          {" "}
          <Image
            src={ICONS.mynauiAeroplane}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />
          <span>Airport</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 px-4 py-2 text-[12px] sm:text-sm text-gray-600 bg-white shadow-sm">
          <Image
            src={ICONS.hotel}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />
          <span>Hotel</span>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Ship & Pay Securely",
    description: "Confirm shipping and pay online",
    icon: ICONS.riSecurePaymentFill,
    content: (
      <div className="mt-6 flex flex-wrap justify-center gap-1 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 px-4 py-2 text-[12px] sm:text-sm text-gray-600 bg-white shadow-sm">
          <Image
            src={ICONS.materialSymbolsShieldOutline}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 px-4 py-2 text-[12px] sm:text-sm text-gray-600 bg-white shadow-sm">
          <Image
            src={ICONS.ggTrack}
            alt="icon"
            width={24}
            height={24}
            unoptimized
          />

          <span>Track Your Item</span>
        </div>
      </div>
    ),
  },
];

export function HowItWorksGuests() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const clipPathValue = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
  );

  return (
    <section
      className="relative overflow-hidden py-20 lg:py-32"
      ref={containerRef}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-20 lg:mb-32">
          <h2 className="text-4xl md:text-5xl lg:text-[40px] font-bold text-primary-new tracking-tight mb-4">
            How it works for{" "}
            <span className="relative inline-block text-active">
              Guests
              <svg
                width="136"
                height="20"
                viewBox="0 0 136 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.696798 8.40416C0.46437 6.75378 0.231941 5.1034 -0.000487266 3.45302C2.34049 3.16548 4.61989 2.90131 6.931 2.64841C48.0903 -1.44158 92.2925 -3.26869 129.856 16.1926C131.891 17.2922 133.897 18.4688 135.837 19.7057C133.853 18.5399 131.809 17.4375 129.741 16.4147C91.6532 -1.58219 48.1735 1.85612 7.53208 7.36022C5.25272 7.69308 3.00513 8.03706 0.696798 8.40416Z"
                  fill="#0099FF"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-500 mt-4">
            Get your lost item back in{" "}
            <span className="text-active font-medium">4 simple steps</span>
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-4 bottom-[250px] hidden w-[2px] h-[80%] -translate-x-1/2 md:block z-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #D1D5DB 0px, #D1D5DB 14px, transparent 14px, transparent 26px)",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                clipPath: clipPathValue,
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--primary-new) 0px, var(--primary-new) 14px, transparent 14px, transparent 26px)",
              }}
            />
          </div>

          <div className="absolute left-1/2 top-0 bottom-[120px] block w-[4px] -translate-x-1/2 md:hidden z-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #D1D5DB 0px, #D1D5DB 14px, transparent 14px, transparent 26px)",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                clipPath: clipPathValue,
                backgroundImage:
                  "repeating-linear-gradient(to bottom, var(--primary-new) 0px, var(--primary-new) 14px, transparent 14px, transparent 26px)",
              }}
            />
          </div>

          <div className="relative space-y-40 md:space-y-0  mt-12 px-0">
            {steps.map((step, index) => {
              const isEven = index % 2 !== 0;
              const isLeft = !isEven;

              return (
                <div
                  key={step.id}
                  className="relative flex flex-col md:flex-row items-center justify-between w-full"
                >
                  <div className="absolute left-1/2 top-[35px] hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center justify-center z-10 w-[53px] h-[53px] bg-white rounded-full shadow-[0_1.41px_1.41px_rgba(0,0,0,0.25),inset_2.82px_2.82px_2.82px_rgba(0,0,0,0.25)]">
                    <div className="relative flex h-[39px] w-[39px] items-center justify-center rounded-full bg-linear-to-b from-active to-primary-new">
                      <span className="text-xl font-bold text-white">
                        {step.id}
                      </span>
                    </div>
                  </div>
                  {!isLeft && (
                    <div className="absolute top-[35px] left-[calc(50%+40px)] w-[75px] hidden md:flex items-center -translate-y-1/2 z-0">
                      <div className="h-[10px] w-[10px] shrink-0 rounded-full bg-linear-to-b from-active to-primary-new" />
                      <div
                        className="h-[2px] flex-1"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to right, var(--active) 0px, var(--active) 4px, transparent 4px, transparent 8px)",
                        }}
                      />
                      <div className="h-[10px] w-[10px] shrink-0 rounded-full bg-linear-to-b from-active to-primary-new" />
                    </div>
                  )}
                  {isLeft && (
                    <div className="absolute top-[35px] right-[calc(50%+40px)] w-[75px] hidden md:flex items-center -translate-y-1/2 z-0">
                      <div className="h-[10px] w-[10px] shrink-0 rounded-full bg-linear-to-b from-active to-primary-new" />
                      <div
                        className="h-[2px] flex-1"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(to right, var(--active) 0px, var(--active) 4px, transparent 4px, transparent 8px)",
                        }}
                      />
                      <div className="h-[10px] w-[10px] shrink-0 rounded-full bg-linear-to-b from-active to-primary-new" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "w-full md:max-w-[40%] z-10",
                      isEven ? "md:order-2" : "md:order-1",
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50, y: 20 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="relative rounded-2xl p-[1.5px] shadow-[0_4px_30px_rgba(0,153,255,0.08)] bg-linear-to-b from-active to-primary-new"
                    >
                      <div
                        className={cn(
                          "relative flex flex-col items-center text-center rounded-2xl bg-white px-4 py-6 sm:p-5 md:p-6 w-full h-full",
                        )}
                      >
                        <div className="absolute -top-[36px] left-1/2 -translate-x-1/2 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-linear-to-b from-active to-primary-new shadow-[0_8px_16px_rgba(0,153,255,0.2)] ring-8 ring-white">
                          <Image
                            src={step.icon}
                            alt={step.title}
                            width={32}
                            height={32}
                            className="h-8 w-8"
                            unoptimized
                          />
                        </div>

                        <div className="mt-8 w-full">
                          <h3 className="text-2xl font-bold text-primary-new mb-2">
                            {step.title}
                          </h3>
                          <p className="text-text-gray text-sm">
                            {step.description}
                          </p>

                          <div className="flex justify-center w-full">
                            {step.content}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div
                    className={cn(
                      "hidden w-full md:w-[45%] md:block",
                      isEven ? "md:order-1" : "md:order-2",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 lg:mt-12 flex flex-col items-center text-center">
          <p className="text-xl text-text-gray mb-8">
            Start your return in less than{" "}
            <span className="text-active font-semibold">2 minutes</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 mb-10 text-sm font-medium text-text-dark">
            <div className="flex items-center gap-2 text-[14px] text-[#000080CC]">
              <Image
                src={ICONS.materialSymbolsShieldOutlineCopy}
                alt="icon"
                width={24}
                height={24}
                unoptimized
              />

              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#000080CC]">
              <Image
                src={ICONS.ixElectricalEnergyFilled}
                alt="icon"
                width={24}
                height={24}
                unoptimized
              />

              <span>Fast</span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#000080CC]">
              <Image
                src={ICONS.tablerWorld}
                alt="icon"
                width={24}
                height={24}
                unoptimized
              />

              <span>Worldwide Delivery</span>
            </div>
          </div>

          <div className="flex flex-col items-center sm:flex-row gap-4 w-full md:max-w-md sm:w-auto">
            <Link href={"/#found"} className="w-full">
              <Button className="h-14 rounded-[8px] min-w-[232px] bg-linear-to-r from-active to-primary-new px-10 text-lg md:text-base font-medium text-white hover:opacity-90 shadow-[0_1px_2px_rgba(0,0,128,0.05)] transition-all w-full sm:w-auto">
                Get My Item Back
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href={"/for-guests"} className="w-full">
              <Button
                variant="outline"
                className="h-14 rounded-[8px] min-w-[232px] border border-active4D bg-white text-active px-10 text-lg md:text-base font-medium hover:bg-gray-50 focus:ring-0 w-full sm:w-auto shadow-xs"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
