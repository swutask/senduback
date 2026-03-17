"use client";
import step1 from "@/assets/why-hotel/Zero Liability.png";
import step2 from "@/assets/why-hotel/Zero Cost.png";
import step3 from "@/assets/why-hotel/Minimal effort.png";
import step4 from "@/assets/why-hotel/Step 1 .png";
import step5 from "@/assets/why-hotel/Step 2.png";
import step6 from "@/assets/why-hotel/Step 3.png";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { motion } from "framer-motion";

export function WhyChooseHotels() {
  const features = [
    {
      id: 1,
      title: "Zero Liability",
      description:
        "Once the item is handed to SenduBack, we manage delivery, tracking, and claims.",
      image: step1,
    },
    {
      id: 2,
      title: "Zero Cost",
      description:
        "Hotels don’t pay shipping fees — guests cover the costs during booking.",
      image: step2,
    },
    {
      id: 3,
      title: "Minimal Effort",
      description:
        "Staff only log the item, share the guest link, and hand the parcel to the courier.",
      image: step3,
    },
    {
      id: 4,
      title: "Add item to dashboard.",
      description:
        "Log the found item in seconds using the SendUBack dashboard. No paperwork, no emails, no follow-ups.",
      image: step4,
    },
    {
      id: 5,
      title: "Notify guest",
      description:
        "Send a secure booking link to the guest. The guest completes delivery details and payment directly on SendUBack.",
      image: step5,
    },
    {
      id: 6,
      title: "Hand over to courier",
      description:
        "Simply hand the item to the SendUBack courier. Shipping, tracking, insurance, and support are fully handled by SendUBack.",
      image: step6,
    },
  ];

  return (
    <section className="relative w-full bg-[linear-gradient(to_top,#e6f2ff_2%,white_2%)] overflow-hidden py-16  lg:pb-28">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header section with title and subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} // start 50px below
          whileInView={{ opacity: 1, y: 0 }} // slide up to original position
          viewport={{ once: true, amount: 0.3 }} // trigger when 30% visible
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-2">
            Why <span className="text-primary-new">‘’Hotels‘’</span> Choose
            SendUBack
          </h2>
          <p className="md:text-xl leading-relaxed px-10 md:px-0">
            A faster, safer way to return lost items — without extra admin or
            liability.
          </p>
        </motion.div>

        {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center bg-secondary rounded-3xl overflow-hidden hover:scale-105 duration-300 ease-in"
              >
        
                <div className="h-80 ">
                  <Image
                    src={feature?.image}
                    alt={feature?.title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div> */}

        <motion.div
          initial={{ opacity: 0, y: 30 }} // Start slightly below and invisible
          whileInView={{ opacity: 1, y: 0 }} // Slide up into view
          viewport={{ once: true, amount: 0.3 }} // Trigger once when 30% visible
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileTap={{ scale: 0.95 }}
        >
          <Carousel className="mx-auto mt-14 max-w-6xl">
            <CarouselContent className="gird grid-cols-3">
              {features.map((feature) => (
                <CarouselItem
                  key={feature.id}
                  className="basis-1/2 lg:basis-1/3 flex"
                >
                  {/* Card */}
                  <div className="bg-secondary rounded-3xl overflow-hidden flex flex-col h-full w-full">
                    {/* Image */}
                    <div className="md:h-80 w-full">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-6 flex flex-col flex-1">
                      <h3 className="mb-2 text-lg md:text-xl font-semibold text-gray-900">
                        {feature.title}
                      </h3>

                      <p className="text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation */}
            {/* Mobile bottom arrows */}
            <div className="flex lg:hidden justify-center gap-4 mt-10">
              <CarouselPrevious className="static bg-primary-new text-white border-none hover:bg-secondary" />
              <CarouselNext className="static bg-primary-new text-white border-none hover:bg-secondary" />
            </div>

            {/* Desktop side arrows */}
            <div className="hidden lg:block">
              <CarouselPrevious className="bg-primary-new text-white border-none hover:bg-secondary" />
              <CarouselNext className="bg-primary-new text-white border-none hover:bg-secondary" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}
