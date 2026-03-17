"use client";

import { AnimatePresence, motion } from "framer-motion";
import StepIndicator, { Step } from "./step-indicator";
import LocationStep from "./step-one";
import ItemDetailsStep from "./step-two";
import DeliveryStep from "./step-three";
import ShippingStep from "./step-four";
import { BookingConfirmed, LoadingScreen } from "./screens";
import { useLostItemForm } from "@/contexts/lost-item-form.context";

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
};

export default function LostItemPage() {
  const { state, form, actions } = useLostItemForm();
  const { currentStep } = state;

  const isConfirmed = currentStep === "shipping" && state.view === "confirmed";
  const isLoading = currentStep === "shipping" && state.view === "loading";

  if (isLoading) {
    return (
      <LoadingScreen
        key="loading"
        onComplete={() => {
          actions.setView("select");
        }}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isConfirmed && (
        <BookingConfirmed key="confirmed" onNewBooking={form.reset} />
      )}

      {!isConfirmed && (
        <motion.div
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen flex flex-col"
        >
          <main className="relative flex-1 flex flex-col pt-30 md:pt-35">
            {!isLoading && <StepIndicator currentStep={currentStep as Step} />}

            <AnimatePresence mode="wait">
              {currentStep === "location" && (
                <motion.div
                  key="location"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  <LocationStep />
                </motion.div>
              )}

              {currentStep === "item-details" && (
                <motion.div
                  key="item-details"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  <ItemDetailsStep />
                </motion.div>
              )}

              {currentStep === "delivery" && (
                <motion.div
                  key="delivery"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  <DeliveryStep />
                </motion.div>
              )}

              {currentStep === "shipping" && (
                <motion.div
                  key="shipping"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex-1 flex flex-col"
                >
                  <ShippingStep />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
