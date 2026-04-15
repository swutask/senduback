import FAQHero from "@/components/common/faq-hero";
import FAQAccordianSection from "@/components/common/faq-accordian-section";
import StillHaveQuestions from "@/components/common/have-questions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description:
    "Find answers to common questions about SendUBack's lost and found service for hotels, airports, and guests. Learn how item returns work.",
  alternates: {
    canonical: "https://senduback.com/faq",
  },
  openGraph: {
    title: "FAQ | SendUBack Lost & Found",
    description:
      "Frequently asked questions about SendUBack's lost and found service.",
    url: "https://senduback.com/faq",
  },
};

export default function page() {
  return (
    <div>
      <FAQHero />
      <FAQAccordianSection />
      <StillHaveQuestions />
    </div>
  );
}
