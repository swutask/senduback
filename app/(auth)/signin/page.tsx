"use client";

import SigninForm from "@/components/auth/signin-form";
import Image from "next/image";

export default function SiginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 md:p-4"
      style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    >
      <div className="w-md flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8">
        <div className="mb-1">
          <Image
            src={require("@/assets/logo.png")}
            alt="send u back logo"
            width={500}
            height={500}
            className="w-52 mx-auto "
          />
        </div>

        <div className="mb-2 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to your SendUBack account
          </p>
        </div>
        <SigninForm />
      </div>
    </div>
  );
}
