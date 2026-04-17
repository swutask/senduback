"use client";
import Footer from "@/components/shared/footer";
import Header from "@/components/navigation/navbar";
import React from "react";
import { usePathname } from "next/navigation";
import SupportButton from "@/components/shared/support-button";

export default function layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname.includes("/orders") ||
    pathname.includes("/payments") ||
    pathname === "/send-you-back";
  return (
    <div className="">
      <Header />
      {children}
      {/* {!hideFooter && <WhatsAppButton />} */}
      {!hideFooter && <SupportButton />}
      {!hideFooter && <Footer />}
    </div>
  );
}
