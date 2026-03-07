"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";

interface SocialLink {
  icon: typeof Facebook;
  label: string;
  href: string;
  color: string;
}

export default function SocialLinks() {
  const socialLinks: SocialLink[] = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com",
      color: "hover:text-primary-600",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com",
      color: "hover:text-pink-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com",
      color: "hover:text-primary-400",
    },
  ];

  return (
    <div className="flex gap-6">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors text-gray-600 ${social.color}`}
          >
            <Icon className="w-8 h-8" />
          </a>
        );
      })}
    </div>
  );
}
