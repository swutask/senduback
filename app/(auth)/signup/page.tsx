"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 md:p-4"
      style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    >
      <div className="flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8">
        {/* Logo */}
        <div className="mb-1">
          <Image
            src={require("@/assets/logo.png")}
            alt="send u back logo"
            width={500}
            height={500}
            className="w-52 mx-auto"
          />
        </div>

        <div className="mb-2 text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            We're upgrading your experience
          </h2>
          <p className="text-gray-600 text-sm mb-2">
            We're currently enhancing SendUBack with new features for hotels.
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Hotel registrations are temporarily paused while we complete these
            improvements.
          </p>
          <p className="text-gray-600 text-sm mb-5">
            If you'd like early access or a quick demo, our team would be happy
            to assist.
          </p>
          <Link
            href="/contact"
            className="inline-block text-white px-6 py-3 font-semibold"
          >
            <motion.button
              whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex items-center justify-center gap-2 font-semibold text-white rounded-xl",
                "bg-gradient-to-r from-[#0099FF] to-[#000080]",
                "px-8 py-4 text-[15px]",
              )}
            >
              Contact Us
            </motion.button>
          </Link>
        </div>
      </div>
    </div>

    // <div
    //   className="min-h-screen flex items-center justify-center p-2 md:p-4"
    //   style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    // >
    //   <div className="w-full max-w-7xl bg-[#EFF2FD] rounded-3xl shadow-2xl overflow-hidden">
    //     <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 md:p-8">
    //       {/* Left Column - Form */}
    //       <div className="col-span-2 flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8">
    //         {/* Logo */}
    //         <div className="mb-1">
    //           <Image
    //             src={require("@/assets/logo.png")}
    //             alt="send u back logo"
    //             width={500}
    //             height={500}
    //             className="w-72 md:w-96 mx-auto"
    //           />
    //         </div>

    //         {/* Form Header */}
    //         <div className="mb-2">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-1">
    //             Create your account
    //           </h2>
    //           <p className="text-gray-600 text-sm">
    //             Get started with our platform today
    //           </p>
    //         </div>

    //         {/* Form */}
    //         <SignupForm />
    //       </div>

    //       {/* Right Column - Hero Section */}
    //       <div className="col-span-3 bg-[#F4F7FF] hidden lg:flex flex-col justify-between rounded-2xl overflow-hidden">
    //         {/* Hero Image */}
    //         <div className="overflow-hidden w-full h-[95%]">
    //           <Image
    //             src={require("@/assets/auth-image.png")}
    //             alt="SendUBack Delivery"
    //             width={500}
    //             height={500}
    //             className="w-full h-full object-cover"
    //           />
    //         </div>

    //         {/* Hero Text */}
    //         <div className="space-y-4 p-8">
    //           <h3 className="text-[42px] font-bold text-gray-900 leading-tight">
    //             Experience your lost & found{" "}
    //             <span className="text-blue-600">like never before!</span>
    //           </h3>
    //           <p className="text-gray-600 text-lg leading-relaxed">
    //             Effortlessly manage and recover lost items with our powerful
    //             platform
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
