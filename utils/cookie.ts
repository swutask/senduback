export type CookieConsent = "accepted" | "rejected" | null;

export function getCookieConsent(): CookieConsent {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )cookie_consent=([^;]+)/);
  const value = match?.[2];

  if (value === "accepted" || value === "rejected") return value;
  return null;
}

export function setCookieConsent(value: CookieConsent) {
  if (!value || typeof document === "undefined") return;

  document.cookie = `cookie_consent=${value}; path=/; max-age=31536000; SameSite=Lax`;
}
