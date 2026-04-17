"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  CookieConsent,
  getCookieConsent,
  setCookieConsent,
} from "@/utils/cookie";

function ShieldIcon() {
  return (
    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="52"
        height="52"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-white"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      </svg>
    </div>
  );
}

interface CookiePreferencesProps {
  forceVisible?: boolean;
  cookiePolicyHref?: string;
  privacyPolicyHref?: string;
}

const targetRoutes = ["/dashboard"];

export default function CookiePreferences({
  forceVisible = false,
  cookiePolicyHref = "/cookie-policy",
  privacyPolicyHref = "/privacy-policy",
}: CookiePreferencesProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (forceVisible || getCookieConsent() === null) {
      setVisible(false);

      const t = setTimeout(() => {
        setVisible(true);
      }, 1300);

      return () => clearTimeout(t);
    }
  }, [pathname, forceVisible]);

  const dismiss = (consent: CookieConsent) => {
    setCookieConsent(consent);
    setVisible(false);
  };

  const handleAccept = () => {
    dismiss("accepted");
  };

  const handleReject = () => {
    dismiss("rejected");
  };

  if (targetRoutes.some(r => pathname.startsWith(r))) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-desc"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 0.95 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
              duration: 1,
            }}
            className="fixed inset-x-0 bottom-4 z-50 mx-auto w-full max-w-[520px] px-4 will-change-transform"
          >
            <div className="rounded-2xl border overflow-hidden border-gray-200 bg-white shadow-2xl shadow-black/10">
              <div className="h-1.5 w-full bg-blue-600" />

              <div className="px-5 pb-5 pt-4">
                <div className="flex items-center gap-3">
                  <ShieldIcon />
                  <div>
                    <h2
                      id="cookie-title"
                      className="text-[15px] font-bold text-gray-900"
                    >
                      Cookie Preferences
                    </h2>
                    <p className="text-[12px] text-blue-500">
                      Your privacy matters to us
                    </p>
                  </div>
                </div>

                <div className="my-3 h-px bg-gray-100" />

                <p
                  id="cookie-desc"
                  className="text-[13.5px] leading-relaxed text-gray-600"
                >
                  We use cookies to improve your experience and ensure the
                  website functions properly. Read our{" "}
                  <a
                    href={cookiePolicyHref}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Cookie Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href={privacyPolicyHref}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  to learn more.
                </p>

                <div className="mt-4 flex gap-2.5">
                  <button
                    onClick={handleReject}
                    className={cn(
                      "flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2",
                      "text-[13px] font-semibold text-gray-700",
                      "transition-colors hover:bg-gray-50",
                    )}
                  >
                    Reject All
                  </button>

                  <button
                    onClick={handleAccept}
                    className={cn(
                      "flex-1 rounded-lg bg-blue-600 px-3 py-2",
                      "text-[13px] font-semibold text-white",
                      "transition-colors hover:bg-blue-700",
                    )}
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
  }, []);

  const reset = () => {
    document.cookie =
      "cookie_consent=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setConsent(null);
  };

  return { consent, reset };
}
