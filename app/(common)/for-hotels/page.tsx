import React from "react";
import HotelHero from "@/components/for-hotels/hotel-hero";
import DashboardHotelTeams from "@/components/for-hotels/dashboard-hotel-teams";
import HowItWorks from "@/components/for-hotels/how-it-works";
import WhyChooseUs from "@/components/for-hotels/why-choose-us";
import AboutCTASection from "@/components/common/about-cta-section";
import TrustSection from "@/components/common/trust-section";

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
