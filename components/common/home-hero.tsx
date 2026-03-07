"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Building2, Package } from "lucide-react";
import heroImg from "@/assets/new-img/new-hero-dashboard.png";
import bgImage from "@/assets/new-img/HERO.png";
import Image from "next/image";
import { ICONS } from "@/assets";

export default function HomeHero() {
  return (
    <section
      style={{
        backgroundImage: `url(${bgImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingBottom: "60px",
      }}
      className="relative overflow-hidden text-white pt-44 pb-12 lg:pt-64 lg:pb-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-size-[32px_32px]" />
      </div>

      <div className="relative mx-auto max-w-[1170px] px-6  lg:px-4">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl xl:max-w-2xl"
          >
            <div className="mb-8 inline-flex items-center gap-4 rounded-t-4xl bg-linear-to-b from-[#0099ff25] to-transparent p-2 pr-6 shadow-sm ">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <Image
                  src={ICONS["HeroCube"]}
                  alt={"hero-icon"}
                  width={40}
                  height={40}
                  className="rounded-xl shrink-0"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight text-white">
                  10,000+
                </span>
                <span className="text-sm font-medium text-white">
                  Items Successfully Returned
                </span>
              </div>
            </div>

            <h1 className="text-[28px] font-extrabold leading-normal tracking-tight sm:text-5xl lg:text-[44px]">
              <span className="">
                The Smarter Way to Return Lost Items
                {/* Return <span className="text-[#00BFFF]">Lost</span> Hotel Items
                <br />
                <span className="text-xl font-medium">
                  Fast &amp; Worldwide
                </span> */}
              </span>
              {/* <span className="hidden lg:inline">
                Return <span className="text-[#00BFFF]">Lost</span> Hotel
                <br />
                Items - <span className="text-[#00BFFF]">Fast</span> &amp;
                <br />
                Worldwide.
              </span> */}
            </h1>

            <p className=" max-w-lg text-base leading-[1.6] text-white sm:text-base">
              SendUBack helps guests get lost items back while hotels manage
              them through a smart dashboard
              {/* <span className="lg:hidden">
                {" "}
                We handle the pickup, packing, and international delivery.
              </span> */}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row lg:mt-12 z-20">
              <Link href="#found" className="w-full sm:w-auto">
                <Button className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-[#0099FF] to-[#000080] px-8 text-[16px] font-bold text-white hover:opacity-90 sm:w-auto shadow-[0_1px_2px_rgba(0,0,128,0.05)] transition-all">
                  <User className="h-5 w-5" />
                  Get My Item Back
                </Button>
              </Link>

              <Link href="/for-hotels" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full border-transparent bg-white px-8 text-[16px] font-semibold text-[#071a33] hover:bg-white/90 sm:w-auto transition-transform hover:scale-105"
                >
                  <Building2 className="h-5 w-5" />
                  Manage Lost Items
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className=""
          >
            <div className="mx-auto w-full">
              <img
                src={heroImg.src}
                alt="Dashboard preview"
                className="h-auto w-full rounded-[1.25rem] object-cover select-none pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
