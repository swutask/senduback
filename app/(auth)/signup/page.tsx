"use client";

import { SignupForm } from "@/components/auth/signup-form";
import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 md:p-4"
      style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    >
      <div className="flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8">
        {/* Logo */}
        <div className="mb-1">
          <Link href="/">
            <Image
              src={require("@/assets/logo.png")}
              alt="send u back logo"
              width={500}
              height={500}
              className="w-52 mx-auto"
            />
          </Link>
        </div>

        {/* Form Header */}
        <div className="mb-2 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-gray-600 text-sm">
            Get started with our platform today
          </p>
        </div>
        {/* Form */}
        <SignupForm />
      </div>
    </div>
  );
}
