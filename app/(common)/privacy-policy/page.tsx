import PolicyHero from "@/components/common/policy-hero";
import RefundPolicy from "@/components/refund-policy/refund-policy";

export default function page() {
  return (
    <div>
      {/* <PrivacyPolicyHero /> */}
      <PolicyHero type={"private"} />
      <RefundPolicy />
    </div>
  );
}
