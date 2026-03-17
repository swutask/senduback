"use client";

import Image from "next/image";
import trust from "@/assets/trust.svg";
import security from "@/assets/security.svg";
import sustainability from "@/assets/sustainability.svg";
import support from "@/assets/support.svg";
import { BlueUnderline } from "../shared/blue-underline";

// Interface for feature data
interface Feature {
  title: string;
  description: string;
  icon: string; // Path to SVG icon
}

// Default features data
const DEFAULT_FEATURES: Feature[] = [
  {
    title: "Trust & transparency",
    description: "Clear communication, honest pricing, and full visibility",
    icon: trust,
  },
  {
    title: "Security & privacy",
    description: "We handle personal data and item details with care",
    icon: security,
  },
  {
    title: "Sustainability",
    description:
      "Returning items means less waste and fewer things being thrown away",
    icon: sustainability,
  },
  {
    title: "Human Support",
    description: "Real help when something goes wrong",
    icon: support,
  },
];

interface CareAboutSectionProps {
  features?: Feature[];
}

export function CareAboutSection({
  features = DEFAULT_FEATURES,
}: CareAboutSectionProps) {
  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-[#e6f2ff]">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden ">
        {/* Section Title */}
        <div className="mb-16 ">
          <h2 className=" text-4xl md:text-5xl font-bold text-center text-foreground mb-4">
            What We Care About
          </h2>
          <BlueUnderline />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white p-6 rounded-xl shadow-lg hover:scale-105 duration-300 ease-in"
            >
              {/* Card Container */}
              <div className="">
                {/* Icon/Illustration */}
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={200}
                  height={200}
                  className="w-20 h-20 mb-5"
                />
              </div>

              {/* Feature Title */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
