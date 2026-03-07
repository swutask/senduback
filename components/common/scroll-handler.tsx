"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function HashScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const element = document.querySelector(hash);
    if (!element) return;

    setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [pathname, searchParams]);

  return null;
}
