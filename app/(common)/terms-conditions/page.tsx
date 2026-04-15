import TermsAndConditions from "@/components/terms-conditions/terms-conditions";
import TermsConditionsHero from "@/components/terms-conditions/terms-conditions-hero";
import HaveQuestions from "@/components/common/have-questions";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read SendUBack's terms and conditions for using our lost and found service for hotels, airports, and guests.",
  alternates: {
    canonical: "https://senduback.com/terms-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | SendUBack",
    description: "SendUBack terms and conditions.",
    url: "https://senduback.com/terms-conditions",
  },
};

export default function page() {
  return (
    <div>
      <TermsConditionsHero />
      <TermsAndConditions />
      <div className="block md:hidden">
        <HaveQuestions />
      </div>
    </div>
  );
}
