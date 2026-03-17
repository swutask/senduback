"use client";

import { Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loading() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1000); // 1000ms = 1 second

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <Image
          src={require("@/assets/logo.png")}
          alt="SendUBack logo"
          width={500}
          height={500}
          className="w-56 h-full"
        />
        <Loader
          size={150}
          className="animate-spin mt-4"
          style={{ color: "#FF0000" }}
        />
      </div>
    </div>
  );
}
