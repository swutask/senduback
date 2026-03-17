// import PrivacyPolicyHero from "@/components/privacy-policy/privacy-policy-hero";
import PolicyHero from "@/components/common/policy-hero";
import RefundPolicy from "@/components/refund-policy/refund-policy";
import RefundPolicyHero from "@/components/refund-policy/refund-policy-hero";

export default function page() {
  return (
    <div>
      {/* <PrivacyPolicyHero /> */}
      <PolicyHero type={"private"} />
      <RefundPolicy />
    </div>
  );
}
