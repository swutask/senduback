import AboutCTASection from "@/components/common/about-cta-section";
import GetStarted from "@/components/common/get-started";
import { ContactForm } from "@/components/contact/contact-form";
import ContactHero from "@/components/contact/contact-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SendUBack. Contact our team for hotel partnerships, guest inquiries, or support with lost item returns.",
  alternates: {
    canonical: "https://senduback.com/contact",
  },
  openGraph: {
    title: "Contact Us | SendUBack",
    description: "Contact SendUBack for lost and found services.",
    url: "https://senduback.com/contact",
  },
};

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
