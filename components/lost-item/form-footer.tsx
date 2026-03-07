"use client";

import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

interface FormFooterProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disableBack?: boolean;
  disableNext?: boolean;
}

export default function FormFooter({
  onBack,
  onNext,
  nextLabel = "Next",
  disableBack = false,
  disableNext = false,
}: FormFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-fade-blue">
      <div className="mx-auto h-[72px] sm:h-[91px] flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl">
        <button
          onClick={onBack}
          disabled={disableBack}
          style={{
            border: "1px solid #000080",
            boxShadow: "0px 1px 2px 0px #0000800D",
          }}
          className="
            flex items-center gap-2
            h-10 sm:h-11 px-4 sm:px-6
            text-[#000080] font-semibold text-sm sm:text-[15px]
            bg-transparent
            transition-all duration-200
            hover:bg-[#000080] hover:text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            rounded-lg
          "
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={disableNext}
          style={{
            background: "linear-gradient(110.24deg, #0099FF 0%, #000080 100%)",
            boxShadow: "0px 1px 2px 0px #0000800D",
          }}
          className="
            flex items-center gap-2
            h-10 sm:h-11 px-5 sm:px-7
            rounded-lg
            text-white font-semibold text-sm sm:text-[15px]
            transition-all duration-200
            hover:opacity-90
            active:scale-[0.97]
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ShippingFooter({
  total = 0,
  showTotal,
  canPay,
  isLoading,
  onBack,
  onPay,
  disabled = false,
}: {
  total?: number;
  showTotal: boolean;
  canPay: boolean;
  isLoading?: boolean;
  onBack?: () => void;
  onPay?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-fade-blue">
      <div className="max-w-4xl mx-auto h-[72px] sm:h-[91px] flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16">
        <button
          onClick={onBack}
          type="button"
          style={{
            border: "1px solid #000080",
            boxShadow: "0px 1px 2px 0px #0000800D",
          }}
          className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 rounded-lg text-[#000080] font-semibold text-sm sm:text-[15px] bg-transparent transition-all hover:bg-[#000080] hover:text-white"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {showTotal && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-right hidden sm:block"
          >
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
              Total
            </p>
            <p className="text-[17px] font-bold text-[#0d1b8e]">
              £{total.toFixed(2)}
            </p>
          </motion.div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={onPay}
            disabled={!canPay || isLoading || disabled}
            type="button"
            style={{
              background:
                "linear-gradient(110.24deg, #0099FF 0%, #000080 100%)",
              boxShadow: "0px 1px 2px 0px #0000800D",
            }}
            className="flex items-center gap-2 h-10 sm:h-11 px-5 sm:px-7 rounded-lg text-white font-semibold text-sm sm:text-[15px] transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span>Processing</span>
                <Loader className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                Complete Order &amp; Pay
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
