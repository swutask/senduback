import PolicyContent from "@/components/common/policy-content";
import PolicyHero from "@/components/common/policy-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | SendUBack",
  description:
    "Learn how SendUBack uses cookies and similar technologies to improve your experience on our platform.",
  alternates: {
    canonical: "https://senduback.com/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | SendUBack",
    description: "SendUBack cookie policy - how we use cookies.",
    url: "https://senduback.com/cookie-policy",
  },
};

export default function page() {
  return (
    <div>
      <PolicyHero type={"cookie"} />
      <PolicyContent type="cookie" />
    </div>
  );
}
