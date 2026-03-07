import AboutCTASection from "@/components/common/about-cta-section";
import TrustSection from "@/components/common/trust-section";
import GuestHero from "@/components/for-guests/for-guests-hero";

export default function page() {
  return (
    <div>
      <GuestHero />
      <TrustSection />
      <AboutCTASection />
    </div>
  );
}
