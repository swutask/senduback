import { ICONS } from "@/assets";

export type MenuLayout = "simple" | "twoColumn";

export interface MenuItem {
  label: string;
  href?: string;
  description?: string;
  highlight?: boolean;
  icon?: any;
}

export interface MenuColumn {
  items: MenuItem[];
}

export type MenuKey = "guests" | "hotels" | "help" | "legal" | null;

export function getMenuData(key: MenuKey): MenuColumn[] {
  switch (key) {
    case "guests":
      return [
        {
          items: [
            {
              label: "Get My Item Back",
              highlight: true,
              icon: ICONS["itemBox"],
              href: "/#found",
            },
            { label: "Track My Return", icon: ICONS["track"] },
          ],
        },
        {
          items: [
            {
              label: "How It Works",
              description: "(Guests)",
              icon: ICONS["how"],
              href: "/#guests",
            },
            { label: "Shipping & Insurance", icon: ICONS["shipping"] },
            {
              label: "Refund Policy",
              description: "(Guest related)",
              icon: ICONS["refund"],
              href: "/refund-policy",
            },
          ],
        },
      ];

    case "hotels":
      return [
        {
          items: [
            {
              label: "Register Business",
              highlight: true,
              icon: ICONS["register"],
              href: "/signup",
            },
            { label: "Book Demo", icon: ICONS["bookDemo"] },
          ],
        },
        {
          items: [
            {
              label: "How It Works",
              description: "(Hotels)",
              icon: ICONS["how"],
              href: "/#businesses",
            },
            { label: "Features", icon: ICONS["features"] },
            { label: "Security & Compliance", icon: ICONS["security"] },
          ],
        },
      ];

    case "help":
      return [
        {
          items: [
            {
              label: "Help Center",
              icon: ICONS["helpCenter"],
              href: "/contact",
            },
            { label: "FAQ", icon: ICONS["faq"], href: "/faq" },
            { label: "Contact Us", icon: ICONS["contactUs"], href: "/contact" },
            { label: "Shipping Protection & Claims", icon: ICONS["shipping"] },
          ],
        },
      ];

    case "legal":
      return [
        {
          items: [
            { label: "Terms of Service", href: "/terms-conditions" },
            { label: "Privacy Policy", href: "/privacy-policy" },
            { label: "Refund Policy", href: "/refund-policy" },
            { label: "Cookie Policy", href: "/cookie-policy" },
          ],
        },
      ];

    default:
      return [];
  }
}

export const MOBILE_NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Help Center", href: "/contact" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];
