"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Wifi, Truck, Calculator, Tag, Check, Package } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type StepStatus = "pending" | "active" | "done";

interface LoadingStep {
  id: number;
  label: string;
  icon: React.ElementType;
  duration: number;
}

const LOADING_STEPS: LoadingStep[] = [
  {
    id: 0,
    label: "Connecting to global network...",
    icon: Wifi,
    duration: 1400,
  },
  { id: 1, label: "Finding best carriers...", icon: Truck, duration: 1800 },
  {
    id: 2,
    label: "Calculating shipping rates...",
    icon: Calculator,
    duration: 1600,
  },
  { id: 3, label: "Getting best prices for you...", icon: Tag, duration: 1200 },
];

function StepRow({ step, status }: { step: LoadingStep; status: StepStatus }) {
  const Icon = step.icon;
  const isDone = status === "done";
  const isActive = status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: status === "pending" ? 0.35 : 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex items-center gap-4"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
          isDone && "bg-[#1D6FF2]",
          isActive && "bg-blue-50",
          status === "pending" && "bg-slate-100",
        )}
      >
        {isDone ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        ) : (
          <Icon
            className={cn(
              "w-4 h-4 transition-colors duration-300",
              isActive ? "text-[#1D6FF2]" : "text-slate-400",
            )}
          />
        )}
      </div>

      <span
        className={cn(
          "text-[14px] transition-all duration-300",
          isDone && "text-slate-500 font-medium",
          isActive && "text-[#0d1b8e] font-bold",
          status === "pending" && "text-slate-400 font-normal",
        )}
      >
        {step.label}
      </span>
    </motion.div>
  );
}

function SpinningOrb() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{
          background: "radial-gradient(circle, #0099FF 0%, #000080 100%)",
        }}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 96 96" className="w-full h-full">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#1D6FF2"
            strokeWidth="2"
            strokeDasharray="12 8"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-2"
      >
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="#0099FF"
            strokeWidth="1.5"
            strokeDasharray="6 20"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0099FF 0%, #000080 100%)",
        }}
      >
        <Package className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}

function BouncingDots() {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#1D6FF2]"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.18,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let idx = 0;

    const advance = () => {
      if (idx < LOADING_STEPS.length - 1) {
        const delay = LOADING_STEPS[idx].duration;
        const timer = setTimeout(() => {
          idx++;
          setActiveStep(idx);
          advance();
        }, delay);
        return () => clearTimeout(timer);
      } else {
        const final = setTimeout(
          () => onComplete?.(),
          LOADING_STEPS[idx].duration,
        );
        return () => clearTimeout(final);
      }
    };

    const cleanup = advance();
    return cleanup;
  }, [onComplete]);

  const getStatus = (stepIdx: number): StepStatus => {
    if (stepIdx < activeStep) return "done";
    if (stepIdx === activeStep) return "active";
    return "pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#F6FAFF] flex items-center justify-center px-4 pt-10 md:pt-0"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        <SpinningOrb />

        <div className="text-center space-y-1">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0d1b8e] leading-tight">
            Finding Best Shipping Prices
          </h2>
          <p className="text-[14px] text-slate-400">
            Please wait while we search our global network…
          </p>
        </div>

        {/* Steps */}
        <div className="w-full space-y-4">
          {LOADING_STEPS.map((step) => (
            <StepRow key={step.id} step={step} status={getStatus(step.id)} />
          ))}
        </div>

        <BouncingDots />
      </div>
    </motion.div>
  );
}

export function BookingConfirmed({
  onNewBooking,
}: {
  onNewBooking?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-[#F6FAFF] flex items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
        <div className="relative">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(29,111,242,0.2) 0%, transparent 70%)",
            }}
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(29,111,242,0.12) 0%, transparent 70%)",
            }}
          />

          <div
            className="absolute -inset-6 rounded-full opacity-25 blur-2xl"
            style={{
              background:
                "radial-gradient(circle, #0099FF 0%, transparent 70%)",
            }}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: 0.1,
            }}
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0099FF 0%, #000080 100%)",
            }}
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.path
                  d="M7 16l6 6 12-12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.35, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-[26px] sm:text-[30px] font-bold text-[#0d1b8e] leading-tight">
            Booking Confirmed!
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed max-w-[400px] mx-auto">
            Your item return request has been submitted. We'll send you a
            confirmation email with tracking details shortly.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.7 }}
          whileHover={{ y: -1, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.97 }}
          onClick={onNewBooking}
          className="h-12 px-8 rounded-xl text-white font-semibold text-[15px] transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(110.24deg, #0099FF 0%, #000080 100%)",
            boxShadow: "0px 1px 2px 0px #0000800D",
          }}
        >
          Start New Booking
        </motion.button>
      </div>
    </motion.div>
  );
}
