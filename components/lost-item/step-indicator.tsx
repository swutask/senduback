"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Package, Truck, CreditCard } from "lucide-react";

export type Step = "location" | "item-details" | "delivery" | "shipping";

interface StepConfig {
  id: Step;
  label: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: "location",
    label: "Location",
    icon: <MapPin className="w-[14px] h-[14px]" />,
  },
  {
    id: "item-details",
    label: "Item Details",
    icon: <Package className="w-[14px] h-[14px]" />,
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: <Truck className="w-[14px] h-[14px]" />,
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: <CreditCard className="w-[14px] h-[14px]" />,
  },
];

interface StepIndicatorProps {
  currentStep: Step;
}

const getStepIndex = (step: Step) => steps.findIndex((s) => s.id === step);

const CIRCLE_SIZE = 38;
const LABEL_HEIGHT = 16;
const GAP = 6;
const LINE_BOTTOM = LABEL_HEIGHT + GAP + CIRCLE_SIZE / 2;

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full flex flex-col items-center pb-2 px-4">
      <div className="relative flex items-center w-full md:max-w-xl">
        <div
          className="absolute left-0 right-0 h-[2px] bg-slate-200 rounded-full"
          style={{ bottom: LINE_BOTTOM }}
        />

        <motion.div
          className="absolute left-0 h-[2px] bg-[#1D6FF2] rounded-full origin-left"
          style={{ bottom: LINE_BOTTOM }}
          initial={false}
          animate={{
            width:
              currentIndex === 0
                ? "0%"
                : `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        <div className="relative flex items-start justify-between w-full">
          {steps.map((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn(
                    "relative w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-white border-2 border-[#1D6FF2] shadow-[0_0_0_3px_rgba(29,111,242,0.13)]"
                      : isCompleted
                        ? "border-0 shadow-md"
                        : "bg-white border-2 border-slate-200",
                  )}
                  style={{
                    background: isCompleted
                      ? "linear-gradient(135deg, #0099FF 0%, #000080 100%)"
                      : undefined,
                  }}
                >
                  {isCompleted ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="white"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={cn(
                        "transition-colors duration-300",
                        isActive ? "text-[#1D6FF2]" : "text-slate-400",
                      )}
                    >
                      {step.icon}
                    </span>
                  )}
                </motion.div>

                <span
                  className={cn(
                    "text-[11px] whitespace-nowrap transition-colors duration-300",
                    isActive
                      ? "text-[#0d1b8e] font-bold"
                      : isCompleted
                        ? "text-[#1D6FF2] font-medium"
                        : "text-slate-400 font-medium",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
