import AboutCTASection from "@/components/common/about-cta-section";
import TrustSection from "@/components/common/trust-section";
import GuestHero from "@/components/for-guests/for-guests-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Guests | Recover Lost Items",
  description:
    "Recover your lost items left at hotels, airports, or events with SendUBack. Book secure, insured door-to-door returns. Track your item and get it back safely.",
  alternates: {
    canonical: "https://senduback.com/for-guests",
  },
  openGraph: {
    title: "For Guests | SendUBack Lost Item Recovery",
    description:
      "Recover lost items from hotels and businesses with SendUBack's secure return service.",
    url: "https://senduback.com/for-guests",
  },
};

export default function page() {
  return (
    <div>
      <GuestHero />
      <TrustSection />
      <AboutCTASection />
    </div>
  );
}
