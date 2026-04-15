import PolicyContent from "@/components/common/policy-content";
import PolicyHero from "@/components/common/policy-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Privacy Policy",
  description:
    "Read SendUBack's privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://senduback.com/privacy-policy-new",
  },
  openGraph: {
    title: "New Privacy Policy | SendUBack",
    description: "SendUBack privacy policy - how we protect your data.",
    url: "https://senduback.com/privacy-policy-new",
  },
};

export default function page() {
  return (
    <div>
      <PolicyHero type={"private"} />
      <PolicyContent type="privacy" />
    </div>
  );
}
