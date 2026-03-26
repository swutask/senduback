import FAQAccordianSection from "@/components/common/faq-accordian-section";
import FAQHero from "@/components/common/faq-hero";
import StillHaveQuestions from "@/components/common/have-questions";

export default function page() {
  return (
    <div>
      <FAQHero />
      <FAQAccordianSection />
      <StillHaveQuestions />
    </div>
  );
}
