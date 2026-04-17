// // import PrivacyPolicyHero from "@/components/privacy-policy/privacy-policy-hero";
// import PolicyHero from "@/components/common/policy-hero";
// import RefundPolicy from "@/components/refund-policy/refund-policy";
// import RefundPolicyHero from "@/components/refund-policy/refund-policy-hero";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Privacy Policy",
//   description:
//     "Read SendUBack's privacy policy to understand how we collect, use, and protect your personal information.",
//   alternates: {
//     canonical: "https://senduback.com/privacy-policy",
//   },
//   openGraph: {
//     title: "Privacy Policy | SendUBack",
//     description: "SendUBack privacy policy - how we protect your data.",
//     url: "https://senduback.com/privacy-policy",
//   },
// };

// export default function page() {
//   return (
//     <div>
//       {/* <PrivacyPolicyHero /> */}
//       <PolicyHero type={"private"} />
//       <RefundPolicy />
//     </div>
//   );
// }

import PolicyContent from "@/components/common/policy-content";
import PolicyHero from "@/components/common/policy-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read SendUBack's privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://senduback.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | SendUBack",
    description: "SendUBack privacy policy - how we protect your data.",
    url: "https://senduback.com/privacy-policy",
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

