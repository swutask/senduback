"use client";

import AboutCTASection from "@/components/common/about-cta-section";
import GetStarted from "@/components/common/get-started";
import { ContactForm } from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/contact-hero";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <ContactHero />
      <ContactForm />
      <GetStarted />
      <AboutCTASection />
    </div>
  );
}
