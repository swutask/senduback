"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  fadeUp,
  Field,
  GradientButton,
  IconBadge,
  IconInput,
  Input,
  LinkButton,
  PLACEHOLDERS,
  SearchBar,
  StepHeader,
  TwoCol,
  useTypewriterPlaceholder,
} from "./common";
import { useLostItemForm } from "@/contexts/lost-item-form.context";
import { useParams } from "next/navigation";
import { useSearchLocationsQuery } from "@/redux/features/locations/locationApi";
import FormFooter from "./form-footer";
import { canProceed } from "./helper";
import { CountrySelect } from "./country-select";

function ManualView({
  onSearch,
  onConfirm,
}: {
  onSearch: () => void;
  onConfirm: () => void;
}) {
  const { form } = useLostItemForm();
  const {
    register,
    formState: { errors },
  } = form;

  const handleConfirm = async () => {
    const isValid = await form.trigger([
      "businessName",
      "street1",
      "city",
      "state",
      "countryCode",
    ]);

    if (!isValid) return;

    onConfirm();
  };

  const animatedPlaceholder = useTypewriterPlaceholder(PLACEHOLDERS);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-3"
    >
      <SearchBar
        placeholder={animatedPlaceholder}
        readOnly
        onClick={onSearch}
      />
      <div className="text-center">
        <LinkButton onClick={onSearch}>Search instead</LinkButton>
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <Field
          label="Business / Place Name"
          error={errors.businessName?.message}
        >
          <Input
            {...register("businessName", {
              required: "Business / Place Name is required",
            })}
            placeholder="Enter business name"
          />
        </Field>

        <Field label="Street Address" error={errors.street1?.message}>
          <Input
            {...register("street1", {
              required: "Street address is required",
            })}
            placeholder="Enter street address"
          />
        </Field>

        <TwoCol mobileLayout="twoCol">
          <Field label="City" error={errors.city?.message}>
            <Input
              {...register("city", { required: "City is required" })}
              placeholder="Enter city"
            />
          </Field>
          <Field label="State / Region" error={errors.state?.message}>
            <Input
              {...register("state", { required: "State is required" })}
              placeholder="Enter state"
            />
          </Field>
        </TwoCol>

        <TwoCol mobileLayout="twoCol">
          <Field label="Country" error={errors.countryCode?.message}>
            <CountrySelect
              value={form.watch("countryCode")}
              onChange={(code, label) => {
                form.setValue("countryCode", code);
                form.setValue("countryName", label);
                form.setValue("country", label);
              }}
              error={errors.countryCode?.message}
            />
          </Field>

          <Field label="Postcode" error={errors.postalCode?.message}>
            <Input {...register("postalCode")} placeholder="Enter postcode" />
          </Field>
        </TwoCol>

        <GradientButton onClick={handleConfirm}>
          Confirm Location
        </GradientButton>
      </Card>
    </motion.div>
  );
}

function ConfirmedView({ onChange }: { onChange: () => void }) {
  const [contactOpen, setContactOpen] = useState(false);
  const { form } = useLostItemForm();

  const {
    watch,
    register,
    formState: { errors },
  } = form;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <Card className="p-4 sm:p-5 flex items-center gap-4 bg-[#F3F8FF]">
        <IconBadge icon={Building2} />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#000080] truncate">
            {watch("businessName") || watch("placeName")}
          </p>
          <p className="text-[13px] text-slate-500 truncate mt-0.5">
            {watch("street1")}
          </p>
          <p className="text-[13px] text-slate-500 truncate mt-0.5">
            {watch("country")}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1D6FF2]" />
            <span className="text-[12px] font-semibold text-[#1D6FF2]">
              Confirmed
            </span>
          </div>
        </div>
        <LinkButton onClick={onChange} className="text-[13px] shrink-0">
          Change
        </LinkButton>
      </Card>

      <Card
        className={cn(
          "overflow-hidden bg-[#F5F5F7]",
          contactOpen && "bg-white",
        )}
      >
        <button
          onClick={() => setContactOpen((o) => !o)}
          className="w-full flex items-center gap-3 p-4 sm:p-5 text-left hover:bg-slate-50/60 transition-colors"
        >
          <IconBadge icon={User} size="sm" variant="outline" />
          <div className="flex-1">
            <p className="text-[14px] font-bold text-[#000080]">
              Know someone at the hotel?
            </p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Optional – helps us locate your item faster
            </p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300",
              contactOpen && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {contactOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4">
                <Field label="Contact Name" error={errors?.name?.message}>
                  <IconInput
                    icon={User}
                    {...register("name")}
                    placeholder="e.g. John at the front desk"
                  />
                </Field>
                <TwoCol>
                  <Field label="Email (optional)" error={errors.email?.message}>
                    <IconInput
                      icon={Mail}
                      type="email"
                      placeholder="staff@hotel.com"
                      {...register("email", {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </Field>
                  <Field label="Phone (optional)" error={errors.phone?.message}>
                    <IconInput
                      icon={Phone}
                      type="tel"
                      placeholder="+44 123 456 789"
                      {...register("phone")}
                    />
                  </Field>
                </TwoCol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function SearchView({ onManual }: { onManual: () => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { form, actions } = useLostItemForm();
  const params = useParams();
  const itemTypesId = (params.id as string)?.toLowerCase();
  const location = form.watch("location");

  const { data, isLoading: isLocationLoading } = useSearchLocationsQuery(
    { type: itemTypesId, search: location },
    { skip: !location },
  );

  const locationData = data?.data ?? [];

  const animatedPlaceholder = useTypewriterPlaceholder(PLACEHOLDERS);

  const handleSuggestionSelect = (loc: any) => {
    const { setValue } = form;
    setValue("location", loc.name);
    setValue("street1", loc.street1);
    setValue("city", loc.city);
    setValue("country", loc.country);
    setValue("state", loc.state);
    setValue("postalCode", loc.postal_code);
    setValue("countryCode", loc.countryCode);
    setValue("placeName", loc.name);
    setShowSuggestions(false);

    actions.setView("confirmed");
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative">
        <SearchBar
          {...form.register("location")}
          placeholder={animatedPlaceholder}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {showSuggestions && location && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {isLocationLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : locationData?.length ? (
              <ul>
                {locationData.map((item: any, index: number) => (
                  <li
                    key={`${item.id}-${index}`}
                    onMouseDown={() => handleSuggestionSelect(item)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-700">{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500">
                No locations found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <LinkButton onClick={onManual}>
          Can't find it? Add location manually
        </LinkButton>
      </div>
    </motion.div>
  );
}

export default function LocationStep() {
  const { form, state, actions } = useLostItemForm();

  const selectedItems = form.watch("selectedItems");

  const handleNextStep = async () => {
    const isValid = await canProceed(state, form);
    if (!isValid) return;

    if (selectedItems.length) {
      actions.goToStep("item-details");
      actions.setView("item-list");
      return;
    }

    if (state.view !== "confirmed") {
      actions.setView("confirmed");
      return;
    }

    return actions.nextStep();
  };

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-5 flex-1 pb-24 sm:pb-40">
        <div className="w-full max-w-[640px]">
          <StepHeader
            Icon={MapPin}
            title="Where was the item found?"
            subtitle="Search for the location or enter the address manually"
            step={1}
          />

          <AnimatePresence mode="wait">
            {state.view === "search" && (
              <SearchView
                key="search"
                onManual={() => actions.setView("manual")}
              />
            )}
            {state.view === "manual" && (
              <ManualView
                key="manual"
                onSearch={() => actions.setView("search")}
                onConfirm={() => {
                  actions.setView("confirmed");
                }}
              />
            )}
            {state.view === "confirmed" && (
              <ConfirmedView
                key="confirmed"
                onChange={() => {
                  actions.setView("search");
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <FormFooter
        onBack={actions.prevStep}
        onNext={handleNextStep}
        nextLabel={state.view === "confirmed" ? "Item Details" : "Next"}
        disableBack={state.currentStep === "location"}
        disableNext={
          state.view === "manual" ||
          (state.view === "search" && !form.watch("placeName"))
        }
      />
    </>
  );
}
