"use client";

import bg from "@/assets/hero-section-bg.png";
import { Button } from "../ui/button";
import { CareAboutSection } from "./care-about-section";
import FeatureCards from "./feature-cards";
import OurMission from "./our-mission";
import Link from "next/link";

export default function AboutHero() {
  return (
    <>
      <section
        className="px-4 md:px-8 overflow-hidden flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bg.src}) `,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "calc(100vh - 250px)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 overflow-hidden text-center">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            About Us
          </h2>
          <p className="w-full md:w-2xl mx-auto text-lg md:text-2xl">
            At SendUBack, we help people reconnect with the things that matter
            to them – even after they've checked out, flown home, or moved on to
            their next destination.
          </p>
          <div className="flex justify-center mt-8">
            <Link href={"/#found"}>
              <Button
                className="flex items-center gap-5 text-white px-9 py-6 rounded-2xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
                variant={"ghost"}
                style={{
                  boxShadow: "0px 40px 70px rgba(0, 150, 255, 0.2)",
                }}
              >
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <OurMission />
      <CareAboutSection />
      <FeatureCards />
    </>
  );
}
