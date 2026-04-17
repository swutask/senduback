"use client";

import {
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Items Returned" },
  { value: 500, suffix: "+", label: "Hotel Partners" },
  { value: 30, suffix: "+", label: "Countries Served" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.floor(latest));

  const [display, setDisplay] = useState(0);

  useMotionValueEvent(rounded, "change", (latest) => {
    setDisplay(latest);
  });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, {
        duration: 2,
        ease: "easeOut",
      });
    }
  }, [isInView, value, motionValue]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
export default function StatsSection() {
  return (
    <section
      className="border-y"
      style={{
        borderColor: "rgb(241, 245, 249)",
        backgroundColor: "rgb(250, 251, 252)",
      }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center py-8 px-6">
            <p
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ color: "rgb(59, 130, 246)" }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>

            <p
              className="text-sm font-medium mt-1"
              style={{ color: "rgb(148, 163, 184)" }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
