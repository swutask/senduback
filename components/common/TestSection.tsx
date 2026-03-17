"use client";

import airbnb from "@/lib/icons/airbnb.svg";
import airport from "@/lib/icons/airport.svg";
import event from "@/lib/icons/event.svg";
import hospital from "@/lib/icons/Hospital.svg";
import hotel from "@/lib/icons/hotel.svg";
import intercityBus from "@/lib/icons/intercity-bus.svg";
import museum from "@/lib/icons/museum.svg";
import rentCar from "@/lib/icons/rent-car.svg";
import ship from "@/lib/icons/ship.svg";
import travelAgency from "@/lib/icons/travel-agency.svg";
import { CategoryCard } from "./category-card";

import Image from "next/image";

export default function FoundAtSection2() {
  // Array of categories with their icons (using emoji for beginners)
  const categories = [
    { id: "1", key: "hotel-resort", label: "Hotel/Resort", emoji: hotel },
    { id: "2", key: "airport", label: "Airport", emoji: airport },
    { id: "3", key: "car-rental", label: "Car rental", emoji: rentCar },
    { id: "4", key: "ship", label: "Ship", emoji: ship },
    { id: "5", key: "airbnb", label: "Airbnb", emoji: airbnb },
    { id: "6", key: "hospital", label: "Hospital", emoji: hospital },
    {
      id: "7",
      key: "travel-agency",
      label: "Travel Agency",
      emoji: travelAgency,
    },
    { id: "8", key: "event", label: "Event", emoji: event },
    { id: "9", key: "museum", label: "Museum", emoji: museum },
    {
      id: "10",
      key: "intercity-bus",
      label: "Intercity Bus",
      emoji: intercityBus,
    },
  ];

  return (
    <section
      className="relative min-h-screen py-32 px-4 overflow-hidden bg-[#e6f2ff]"
      // style={{
      //   backgroundImage: `url(${bgImge2.src})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "right",
      //   // backgroundRepeat: "no-repeat",
      // }}
    >
      <div className="lg:block">
        <Image
          src={require("@/assets/abstract-lines.svg")}
          alt="hero"
          width={200}
          height={200}
          className="absolute top-0 right-6 z-40 w-80 h-auto hidden lg:block"
        />

        <Image
          src={require("@/assets/abstract-lines.svg")}
          alt="hero"
          width={150}
          height={150}
          className="absolute left-0 bottom-0 z-40 w-80 h-auto"
        />
        {/* hero backgorund image */}
        <Image
          src={require("@/assets/Rectangle 3133.png")}
          alt="Hero background"
          width={1000}
          height={1000}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block z-30"
        />
      </div>

      {/* Wrap content in a relative z-50 container to ensure it's above the background images */}
      <div className="relative z-50 max-w-7xl mx-auto px-4 lg:px-0">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Forgot something?
          </h1>
          <p className="text-gray-600 text-lg">
            Select where your item was found, and we'll help you get it back in
            three simple steps.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
