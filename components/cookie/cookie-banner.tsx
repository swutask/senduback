import CookiePreferences from "./preferences-modal";

interface CookieBannerProps {
  cookiePolicyHref?: string;
  privacyPolicyHref?: string;
}

export default function CookieBanner({
  cookiePolicyHref = "/cookie-policy",
  privacyPolicyHref = "/privacy-policy",
}: CookieBannerProps) {
  return (
    <CookiePreferences
      cookiePolicyHref={cookiePolicyHref}
      privacyPolicyHref={privacyPolicyHref}
    />
  );
}
