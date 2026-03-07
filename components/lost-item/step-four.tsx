"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ClassValue } from "clsx";
import {
  CreditCard,
  Zap,
  Truck,
  Shield,
  DollarSign,
  Info,
  CheckCircle2,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ShippingRate } from "@/lib/Types";
import LoadingSpinner from "@/lib/loading-spinner";
import { useCreatePaymentMutation } from "@/redux/features/payment/paymentApi";
import {
  useAddInsuranceMutation,
  useAddSelectedRateMutation,
  useGetShippingRatesMutation,
} from "@/redux/features/shipping/shippingApi";
import { cn } from "@/lib/utils";
import { fadeUp, StepHeader } from "./common";
import { useLostItemForm } from "@/contexts/lost-item-form.context";
import { ShippingFooter } from "./form-footer";

function cn_input(...extra: ClassValue[]) {
  return cn(
    "w-full h-11 rounded-xl border border-slate-200 bg-white px-4",
    "text-[14px] text-slate-700 placeholder:text-slate-400",
    "outline-none transition-all",
    "focus:border-[#1D6FF2] focus:ring-2 focus:ring-[#1D6FF2]/10",
    ...extra,
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] font-bold text-[#0d1b8e] mb-3">{children}</p>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
        checked ? "bg-[#1D6FF2]" : "bg-slate-200",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function DeliveryCard({
  option,
  selected,
  onClick,
}: {
  option: ShippingRate;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon = option.shippingType === "express" ? Zap : Truck;
  const isRecommended = option.shippingType === "express";

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      type="button"
      className={cn(
        "relative flex-1 flex items-center gap-3 p-4 rounded-2xl border text-left",
        "transition-all duration-200 cursor-pointer bg-[#f0f7ff]",
        selected
          ? "border-[#1D6FF2] shadow-md"
          : "border-slate-100 hover:border-slate-300 shadow-sm",
      )}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-4/5 text-nowrap -translate-x-1/2  bg-[#1D6FF2] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
          Most Popular
        </span>
      )}

      {selected && (
        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-[#1D6FF2] flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          selected ? "bg-[#1D6FF2]" : "bg-slate-100",
        )}
      >
        <Icon
          className={cn("w-5 h-5", selected ? "text-white" : "text-slate-400")}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-[14px] font-bold", "text-[#0d1b8e]")}>
          <span>
            {option.shippingType?.charAt(0).toUpperCase() +
              option.shippingType?.slice(1)}
          </span>{" "}
          Delivery
        </p>
        <p className="text-[12px] text-slate-400 mt-0.5">{option.duration}</p>
      </div>

      <p
        className={cn(
          "text-[15px] font-bold shrink-0",
          selected ? "text-[#0d1b8e]" : "text-slate-600",
        )}
      >
        £{option.price.toFixed(2)}
      </p>
    </motion.button>
  );
}

function InsuranceCard({
  declaredValue,
  enabled,
  onToggle,
  isRateSelected,
  apiInsuranceCost,
}: {
  declaredValue: number;
  enabled: boolean;
  onToggle: () => void;
  isRateSelected: boolean;
  apiInsuranceCost: number;
}) {
  const displayCost = apiInsuranceCost;
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card
        className={cn(
          "p-4 sm:p-5 flex items-start gap-4 transition-all duration-300 bg-[#f0f7ff] border-[#9ecbfd]",
        )}
      >
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
          <Shield className="w-5 h-5 text-[#1D6FF2]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#0d1b8e]">
            Insurance Coverage
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Fully insured up to{" "}
            <span className="font-bold text-slate-700">
              £{declaredValue.toFixed(2)}
            </span>
          </p>
          <p className="text-[12px] text-slate-400">
            Covers loss, damage &amp; theft
          </p>
          {!isRateSelected && (
            <p className="text-[11px] text-amber-500 mt-1">
              Select a delivery option first
            </p>
          )}
          {enabled && isRateSelected && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1D6FF2]" />
              <span className="text-[12px] font-semibold text-[#1D6FF2]">
                Insurance included
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <Toggle
            checked={enabled}
            onChange={onToggle}
            disabled={!isRateSelected}
          />
          <p className="text-[13px] font-bold text-[#1D6FF2]">
            {!!displayCost && `£${displayCost.toFixed(2)}`}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

function OrderSummary({
  shippingCost,
  insuranceEnabled,
  insuranceCost,
  totalCost,
}: {
  shippingCost: number;
  insuranceEnabled: boolean;
  insuranceCost: number;
  totalCost: number;
}) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible">
      <Card className="p-5 sm:p-6 mt-2">
        <p className="text-[15px] font-bold text-[#0d1b8e] mb-4">
          Order Summary
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-slate-600">Shipping Cost</p>
            <p className="text-[14px] font-medium text-slate-700">
              £{shippingCost.toFixed(2)}
            </p>
          </div>

          <AnimatePresence>
            {insuranceEnabled && insuranceCost > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between overflow-hidden"
              >
                <p className="text-[14px] text-slate-600">Insurance Coverage</p>
                <p className="text-[14px] font-medium text-slate-700">
                  £{insuranceCost.toFixed(2)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
          <p className="text-[15px] font-bold text-[#0d1b8e]">Total</p>
          <p
            className="text-[20px] font-bold text-[#0d1b8e]"
            style={{
              background: "linear-gradient(110.24deg,#0099FF,#000080)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            £{totalCost.toFixed(2)}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ShippingStep() {
  const router = useRouter();
  const { state, actions } = useLostItemForm();

  const orderId = state.orderId;

  const [getShippingRates, { data, isLoading: shippingLoading }] =
    useGetShippingRatesMutation();
  const [addSelectedRate] = useAddSelectedRateMutation();
  const [addInsurance, { isLoading: addInsuranceLoading }] =
    useAddInsuranceMutation();
  const [createPayment, { isLoading: paymentLoading }] =
    useCreatePaymentMutation();

  const [selectedRateId, setSelectedRateId] = useState<string>("");
  const [isRateSelected, setIsRateSelected] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [insuranceCost, setInsuranceCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [declaredValue, setDeclaredValue] = useState("");
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const parsedValue = parseFloat(declaredValue) || 0;
  const hasValue = parsedValue > 0;

  useEffect(() => {
    if (!orderId) return;
    getShippingRates(orderId)
      .unwrap()
      .catch(() => {});
  }, [orderId, getShippingRates]);

  useEffect(() => {
    if (!data?.data?.length) return;

    const express = data.data.find(
      (rate: ShippingRate) => rate.shippingType === "express",
    );

    if (express && !selectedRateId) {
      handleSelectRate(express._id);
    }
  }, [data]);

  const handleSelectRate = async (id: string) => {
    setSelectedRateId(id);
    try {
      const res = await addSelectedRate({ orderId, id }).unwrap();
      if (res?.success) {
        setIsRateSelected(true);
        setTotalCost(res?.data?.total_cost || 0);
        setShippingCost(res?.data?.shipping_cost || 0);
        setInsuranceCost(res?.data?.insurance?.insuranceCost || 0);
        toast.success("Delivery option selected successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to select delivery option");
    }
  };

  const handleToggleInsurance = async () => {
    if (!isRateSelected) return;

    const next = !insuranceEnabled;
    setInsuranceEnabled(next);

    if (next && hasValue) {
      await saveInsurance(next, parsedValue);
    } else if (!next) {
      await saveInsurance(false, parsedValue);
    }
  };

  const saveInsurance = async (isInsured: boolean, productValue: number) => {
    try {
      const res = await addInsurance({
        orderId,
        insurance: { isInsured, productValue },
      }).unwrap();
      if (res?.success) {
        setTotalCost(res?.data?.total_cost || 0);
        setShippingCost(res?.data?.shipping_cost || 0);
        setInsuranceCost(res?.data?.insurance?.insuranceCost || 0);
        toast.success(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update insurance");
    }
  };

  const handleDeclaredValueBlur = async () => {
    if (insuranceEnabled && isRateSelected && hasValue) {
      await saveInsurance(true, parsedValue);
    }
  };

  const handlePay = async () => {
    if (!isRateSelected) {
      toast.error("Please select a delivery option before payment");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }
    try {
      const res = await createPayment(orderId).unwrap();
      if (res?.url) {
        toast.success("Redirecting to Stripe checkout");
        router.push(res.url);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Payment initialization failed");
    }
  };

  const canPay = isRateSelected && agreed;

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-5 pb-24 sm:pb-40">
        <div className="w-full max-w-3xl space-y-10">
          <StepHeader
            Icon={CreditCard}
            title="Shipping &amp; Insurance"
            subtitle="Choose your delivery speed and protect your item"
            step={4}
          />

          <div>
            <SectionTitle>Choose Delivery Option</SectionTitle>

            {shippingLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                {data?.data?.map((option: ShippingRate) => (
                  <DeliveryCard
                    key={option._id}
                    option={option}
                    selected={selectedRateId === option._id}
                    onClick={() => handleSelectRate(option._id)}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[15px] font-bold text-[#0d1b8e]">
                Declared Item Value
              </p>
              <span className="text-red-400 text-[15px] font-bold">*</span>
              <button
                type="button"
                className="text-slate-400 hover:text-[#1D6FF2] transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[13px] text-slate-400 mb-2">
              Enter the value of your item to enable insurance options
            </p>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="number"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                onBlur={handleDeclaredValueBlur}
                placeholder="Enter value"
                className={cn_input(
                  "pl-10 h-12",
                  "disabled:bg-gray-100 disabled:cursor-not-allowed",
                )}
                min="0"
                disabled={insuranceEnabled}
              />
            </div>
          </div>

          <AnimatePresence>
            {hasValue && selectedRateId && (
              <motion.div
                key="value-extras"
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.35, staggerChildren: 0.08 },
                }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-8"
              >
                <InsuranceCard
                  declaredValue={parsedValue}
                  enabled={insuranceEnabled}
                  onToggle={handleToggleInsurance}
                  isRateSelected={isRateSelected}
                  apiInsuranceCost={insuranceCost}
                />

                {addInsuranceLoading && (
                  <div className="flex items-center gap-2 text-[13px] text-slate-400 px-1">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating insurance...</span>
                  </div>
                )}

                {isRateSelected && (
                  <OrderSummary
                    shippingCost={shippingCost}
                    insuranceEnabled={insuranceEnabled}
                    insuranceCost={insuranceCost}
                    totalCost={totalCost}
                  />
                )}

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setAgreed((v) => !v)}
                    className={cn(
                      "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                      agreed
                        ? "bg-[#1D6FF2] border-[#1D6FF2]"
                        : "border-slate-300 group-hover:border-[#1D6FF2]",
                    )}
                  >
                    {agreed && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] text-slate-700">
                      I agree to the{" "}
                      <span className="font-bold text-[#0d1b8e] underline cursor-pointer">
                        Terms &amp; Conditions and Privacy Policy.
                      </span>
                    </p>
                    <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                      By continuing, I confirm that the hosting business is not
                      liable once the item is handed to SendUBack. If insurance
                      is not selected, SendUBack cannot refund loss or damage
                      during transit.
                    </p>
                  </div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ShippingFooter
        total={totalCost}
        showTotal={isRateSelected}
        canPay={canPay}
        onBack={() => {
          actions.goToStep("delivery");
          actions.setView("confirmed");
        }}
        onPay={handlePay}
        isLoading={paymentLoading}
        disabled={addInsuranceLoading}
      />
    </>
  );
}
