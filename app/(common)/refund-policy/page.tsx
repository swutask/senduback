import PolicyHero from "@/components/common/policy-hero";
import RefundPolicy from "@/components/refund-policy/refund-policy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Learn about SendUBack's refund policy for our lost and found shipping services.",
  alternates: {
    canonical: "https://senduback.com/refund-policy",
  },
  openGraph: {
    title: "Refund Policy | SendUBack",
    description: "SendUBack refund policy.",
    url: "https://senduback.com/refund-policy",
  },
};

export default function page() {
  return (
    <div>
      <PolicyHero />
      <RefundPolicy />
    </div>
  );
}
