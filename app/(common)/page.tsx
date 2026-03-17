import TrustSection from "@/components/common/trust-section";
import FoundAtSection from "@/components/common/found-at-section";
import GetStarted from "@/components/common/get-started";
import HomeHero from "@/components/common/home-hero";
import StatsSection from "@/components/common/stats-counter-section";
import Testimonials from "@/components/common/testimonial-carousel";
import WhyChoose from "@/components/common/why-chooses";
import WorksForBusinesses from "@/components/common/works-for-businesses";
import { HowItWorksGuests } from "@/components/common/how-it-works-guests";
import HashScrollHandler from "@/components/common/scroll-handler";

export default function page() {
  return (
    <div className="min-h-screen">
      <HashScrollHandler />

      <div id="home">
        <HomeHero />
      </div>

      <StatsSection />

      <div id="found" className="scroll-mt-8">
        <FoundAtSection />
      </div>

      <div id="guests" className="scroll-mt-8">
        <HowItWorksGuests />
      </div>

      <div id="businesses" className="scroll-mt-8">
        <WorksForBusinesses />
      </div>

      <div id="whyguest">
        <WhyChoose variant={"guests"} />
      </div>

      <div id="feedback">
        <Testimonials />
      </div>

      <div id="whyhotels">
        <WhyChoose />
      </div>

      <div id="faq">
        <TrustSection type="general" />
      </div>

      <div id="get_started">
        <GetStarted />
      </div>

      {/* <LostAndFoundSection /> */}
    </div>
  );
}
