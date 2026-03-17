"use client";

import bg from "@/assets/hero-section-bg.png";
import Image from "next/image";

export default function PrivacyPolicyHero() {
  return (
    <section
      className="relative px-4 md:px-8 flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bg.src}) `,
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "calc(100vh - 300px)",
      }}
    >
      <div className="lg:block">
        <Image
          src={require("@/assets/abstract-lines.svg")}
          alt="hero"
          width={200}
          height={200}
          className="absolute top-0 right-6 z-40 w-80 h-auto hidden lg:block"
        />
      </div>

      <div className="max-w-7xl mx-auto lg:px-4 flex flex-col items-start justify-center text-white space-y-8">
        <div
          className="w-96 h-16 bg-gradient-to-b from-sky-400 to-blue-700 clip-shape text-3xl font-bold flex items-center justify-center "
          style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}
        >
          Privacy Policy
        </div>

        <p className=" text-2xl font-medium">
          At SendUBack, we help people reconnect with the things that matter to
          them – even after they've checked out, flown home, or moved on to
          their next destination.
        </p>
      </div>
    </section>
  );
}
