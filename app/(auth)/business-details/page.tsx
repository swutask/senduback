"use client";

import { BusinessDetailsForm } from "@/components/auth/BusinessDetailsForm";
import SigninForm from "@/components/auth/signin-form";
import Image from "next/image";

export default function SiginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 md:p-4"
      style={{ background: "linear-gradient(0deg, #092F60 0%, #092F60 100%)" }}
    >
      <div className="flex flex-col justify-center py-10">
        <div className="mb-6">
          <Image
            src={require("@/assets/BusinessDetailsForm.png")}
            alt="send u back logo"
            width={500}
            height={500}
            className="w-20 h-20 mx-auto mb-4"
          />
          <div className="mb-2 text-center text-white">
            <h2 className="text-2xl font-bold mb-1">SendUBack</h2>
            <p className="text-sm">Complete your business profile</p>
          </div>
        </div>

        <BusinessDetailsForm />
        <p className="text-white text-center mt-3">
          © 2026 SendUBack. All rights reserved.{" "}
        </p>
      </div>
    </div>
  );
}
