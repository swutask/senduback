"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import authImg from "@/assets/logo.png";
import authImg2 from "@/assets/logo.png";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{
        background: "linear-gradient(46deg, #FFF 47.95%, #B4D4F4 61.22%)",
      }}
    >
      <div className="lg:block">
        <Image
          src={require("@/assets/abstract-lines.svg")}
          alt="hero"
          width={150}
          height={150}
          className="absolute left-0 -bottom-16 z-10 w-80 h-auto"
        />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 gap-10">
        <div className="flex-1 hidden lg:flex flex-col items-center justify-center">
          <Image
            src={require("@/assets/hero-bg.png")}
            alt="Hero background"
            width={500}
            height={500}
            className="w-[600px] -scale-x-100"
          />

          <h2 className="text-4xl font-bold">
            Experience your lost & found <br />
            <span className="text-primary">like never before!</span>
          </h2>
        </div>

        <div className="flex-1 px-4 w-full md:w-2/3 h-screen flex flex-col items-center justify-center">
          <div className="w-full lg:w-2/3 flex flex-col items-center justify-center py-10 bg-white rounded-xl z-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
            <Link href={"/"}>
              <Image
                src={require("@/assets/logo.png")}
                alt="hero"
                width={200}
                height={200}
                className="mb-2"
              />
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
