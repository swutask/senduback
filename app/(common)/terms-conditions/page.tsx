import TermsAndConditions from "@/components/terms-conditions/terms-conditions";
import TermsConditionsHero from "@/components/terms-conditions/terms-conditions-hero";
import HaveQuestions from "@/components/common/have-questions";
import React from "react";

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
