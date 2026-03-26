import AboutHeroSection from "@/components/about-us/about-hero-section";
import OurMissionSection from "@/components/about-us/our-mission-section";
import WeCare from "@/components/about-us/we-care";
import WhoIsThis from "@/components/about-us/who-is-this";
import WhyItWorks from "@/components/about-us/why-it-works";
import AboutCTASection from "@/components/common/about-cta-section";

export default function page() {
  return (
    <div>
      <AboutHeroSection />
      <OurMissionSection />
      <WeCare />
      <WhoIsThis />
      <WhyItWorks />
      <AboutCTASection
        title="Ready to Transform Your Lost & Found?"
        description="Join hundreds of hotels delivering exceptional guest experiences with SendUBack"
        buttonText="Get Started Today"
        buttonLink="/"
      />
    </div>
  );
}
