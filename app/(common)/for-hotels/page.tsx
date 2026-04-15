import React from "react";
import HotelHero from "@/components/for-hotels/hotel-hero";
import DashboardHotelTeams from "@/components/for-hotels/dashboard-hotel-teams";
import HowItWorks from "@/components/for-hotels/how-it-works";
import WhyChooseUs from "@/components/for-hotels/why-choose-us";
import AboutCTASection from "@/components/common/about-cta-section";
import TrustSection from "@/components/common/trust-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Hotels | Lost & Found Management for Hotels",
  description:
    "SendUBack helps hotels manage lost items with a simple dashboard. Register your property and offer guests secure, trackable item returns. Free to set up.",
  alternates: {
    canonical: "https://senduback.com/for-hotels",
  },
  openGraph: {
    title: "For Hotels | SendUBack Lost & Found Management",
    description:
      "Hotel lost and found management made simple. Help guests recover lost items with SendUBack.",
    url: "https://senduback.com/for-hotels",
  },
};

export default function ForHotelsPage() {
  return (
    <div className="min-h-screen">
      <HotelHero />
      <DashboardHotelTeams />
      <HowItWorks />
      <WhyChooseUs />
      <TrustSection type="hotel" />
      <AboutCTASection
        title="Ready to simplify lost & found?"
        description="Free to set up. No monthly fees."
        buttonText="Register Your Property"
        buttonLink="/contact"
      />
    </div>
  );
}
