"use client";

import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function GlobalLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary">
        <div className="flex flex-col items-center">
          <Image
            src={require("@/assets/logo.png")}
            alt="SendUBack logo"
            width={500}
            height={500}
            className="w-56 h-full"
          />
          <LoaderCircle
            size={120}
            className="animate-spin mt-4 text-primary"
            // style={{ color: "#FF0000" }}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
