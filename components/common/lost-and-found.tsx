"use client";

import { Button } from "@/components/ui/button";
import lostandfoundbg from "@/assets/lost-and-found-bg.png";
import Link from "next/link";

export default function LostAndFoundSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0096FF] py-20 text-white"
      style={{
        backgroundImage: `url(${lostandfoundbg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center px-4 py-16 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">
          Partner with us for smarter lost & found.
        </h1>

        <p className="mt-4 max-w-2xl text-sm md:text-base">
          Let us handle your lost & found, from guest requests to courier pickup
          and delivery. Save staff time, keep guests happy, and stay fully
          organized.
        </p>

        <div className="mt-6 flex-1 flex flex-col md:flex-row items-center justify-start gap-6 ">
          {/* <Button
            className="w-full md:w-auto border px-10 text-white bg-transparent  hover:bg-[#002E60] hover:border-primary hover:text-white rounded-2xl font-semibold hover:scale-105 ease-in"
            variant={"outline"}
          >
            Book a demo
          </Button> */}
          <Link href={"/register"}>
            <Button
              className="w-full md:w-auto font-semibold px-8 bg-[#002E60] border border-[#002E60]  text-white  hover:bg-primary/85/80 hover:border-primary hover:text-white rounded-2xl hover:scale-105 ease-in"
              variant={"ghost"}
            >
              Register your business
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
