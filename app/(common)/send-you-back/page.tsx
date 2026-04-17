import HeroSection from "@/components/send-you-back/hero-section";
import StatsSection from "@/components/send-you-back/stats-section";
import AboutSection from "@/components/send-you-back/about-section";
import HowItWorksSection from "@/components/send-you-back/how-it-works";
import ItemTypesSection from "@/components/send-you-back/item-types";
import TestimonialsSection from "@/components/send-you-back/testimonial-section";
import WhyChooseSection from "@/components/send-you-back/why-chose";
import FAQSection from "@/components/send-you-back/faq-section";
import ForHotelsSection from "@/components/send-you-back/for-hotels";
import CTASection from "@/components/send-you-back/cta-section";
import PageFooter from "@/components/send-you-back/footer-section";

export const metadata = {
  title: "Send You Back — The Smarter Way to Return Lost Items",
  description:
    "Send You Back (also known as Send U Back or SendUBack) is the leading hotel lost and found return service. Recover items left at hotels quickly, safely, and hassle-free.",
  keywords: [
    "send you back",
    "send u back",
    "senduback",
    "hotel lost and found return service",
    "send me back my stuff",
    "lost item hotel",
    "hotel lost property return",
  ],
};

export default function page() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <HowItWorksSection />
      <ItemTypesSection />
      <TestimonialsSection />
      <WhyChooseSection />
      <FAQSection />
      <ForHotelsSection />
      <CTASection />
      <PageFooter />
    </main>
  );
}
