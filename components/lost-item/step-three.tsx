"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Search,
  Home,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Pencil,
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
  SearchBar,
  StepHeader,
  TwoCol,
} from "./common";
import {
  LostItemFormData,
  useLostItemForm,
} from "@/contexts/lost-item-form.context";
import { useSearchLocationsQuery } from "@/redux/features/locations/locationApi";
import { toast } from "sonner";
import {
  useAddShippingMutation,
  useGetLostItemQuery,
} from "@/redux/features/shipping/shippingApi";
import FormFooter from "./form-footer";
import { useParams } from "next/navigation";
import { CountrySelect } from "./country-select";
import { Controller } from "react-hook-form";

const RECENT_ADDRESSES_KEY = "recent_delivery_addresses";
const MAX_RECENT = 5;

interface RecentAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  countryCode: string;
}

type ViewState = "select" | "recipient" | "confirmed";

function getRecentAddresses(): RecentAddress[] {
  try {
    const raw = localStorage.getItem(RECENT_ADDRESSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentAddress(addr: RecentAddress) {
  try {
    const existing = getRecentAddresses();
    const filtered = existing.filter((a) => a.name !== addr.name);
    const updated = [addr, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_ADDRESSES_KEY, JSON.stringify(updated));
  } catch {}
}

const addressFields = [
  "sendAddress",
  "sendStreet",
  "sendCountry",
  "sendState",
  "sendCity",
  "sendPostalCode",
  "sendCountryCode",
];

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
    // @ts-ignore
    const isValid = await form.trigger(addressFields);

    if (!isValid) return;

    const values = form.getValues();

    const recent: RecentAddress = {
      name: values.sendAddress || "",
      street: values.sendStreet || "",
      city: values.sendCity || "",
      state: values.sendState || "",
      country: values.sendCountry || "",
      postalCode: values.sendPostalCode || "",
      countryCode: values.sendCountryCode || "",
    };

    saveRecentAddress(recent);

    onConfirm();
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-3"
    >
      <SearchBar
        placeholder={"Search for your address"}
        readOnly
        onClick={onSearch}
      />
      <div className="text-center">
        <LinkButton onClick={onSearch}>Search instead</LinkButton>
      </div>

      <Card className="p-5 sm:p-6 space-y-4">
        <Field label="Place Name" error={errors.sendAddress?.message}>
          <Input
            {...register("sendAddress", {
              required: "Place Name is required",
            })}
            placeholder="Enter Place Name"
          />
        </Field>

        <Field label="Street Address" error={errors.sendStreet?.message}>
          <Input
            {...register("sendStreet", {
              required: "Street address is required",
            })}
            placeholder="Enter street address"
          />
        </Field>

        <TwoCol mobileLayout="twoCol">
          <Field label="City" error={errors.sendCity?.message}>
            <Input {...register("sendCity")} placeholder="Enter city" />
          </Field>
          <Field label="State / Region" error={errors.sendState?.message}>
            <Input
              {...register("sendState", { required: "State is required" })}
              placeholder="Enter state"
            />
          </Field>
        </TwoCol>

        <TwoCol mobileLayout="twoCol">
          <Field label="Country" error={errors.sendCountryCode?.message}>
            <Controller
              name="sendCountryCode"
              control={form.control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <CountrySelect
                  value={field.value}
                  onChange={(code, label) => {
                    field.onChange(code);
                    form.setValue("sendCountry", label);
                  }}
                  error={errors.sendCountryCode?.message}
                />
              )}
            />
          </Field>

          <Field label="Postcode" error={errors.sendPostalCode?.message}>
            <Input
              {...register("sendPostalCode", {
                required: "Postcode is required",
              })}
              placeholder="Enter postcode"
            />
          </Field>
        </TwoCol>

        <GradientButton onClick={handleConfirm}>
          Confirm Location
        </GradientButton>
      </Card>
    </motion.div>
  );
}

function AddressSelectView({ onSelect }: { onSelect: () => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [recentAddresses, setRecentAddresses] = useState<RecentAddress[]>([]);
  const { form, actions } = useLostItemForm();
  const address = form.watch("sendAddress");

  const { data, isLoading } = useSearchLocationsQuery(
    { search: address },
    { skip: !address },
  );

  useEffect(() => {
    setRecentAddresses(getRecentAddresses());
  }, []);

  const handleManual = () => {
    actions.setView("manual");
  };

  const applyLocation = (loc: {
    name: string;
    country?: string;
    state?: string;
    street1?: string;
    city?: string;
    postal_code?: string;
    countryCode?: string;
  }) => {
    const { setValue } = form;
    setValue("sendAddress", loc.name);
    setValue("sendCountry", loc.country || "");
    setValue("sendState", loc.state || "");
    setValue("sendStreet", loc.street1 || "");
    setValue("sendCity", loc.city || "");
    setValue("sendPostalCode", loc.postal_code || "");
    setValue("sendCountryCode", loc.countryCode || "");

    const recent: RecentAddress = {
      name: loc.name,
      street: loc.street1 || "",
      city: loc.city || "",
      state: loc.state || "",
      country: loc.country || "",
      postalCode: loc.postal_code || "",
      countryCode: loc.countryCode || "",
    };
    saveRecentAddress(recent);
    setRecentAddresses(getRecentAddresses());
  };

  const handleSuggestionSelect = (loc: any) => {
    applyLocation(loc);
    setShowSuggestions(false);
    onSelect();
  };

  const handlePickRecent = (addr: RecentAddress) => {
    setSelected(addr.name);
    applyLocation({
      name: addr.name,
      country: addr.country,
      state: addr.state,
      street1: addr.street,
      city: addr.city,
      postal_code: addr.postalCode,
      countryCode: addr.countryCode,
    });
    setTimeout(() => onSelect(), 150);
  };

  const addressData = data?.data ?? [];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-5"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search for your address"
          className="pl-11 h-12"
          {...form.register("sendAddress")}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {showSuggestions && address && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : addressData?.length ? (
              <ul>
                {addressData.map((item: any) => (
                  <li
                    key={item.id}
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
        <LinkButton onClick={handleManual}>
          Can't find it? Add location manually
        </LinkButton>
      </div>

      {recentAddresses.length > 0 && (
        <div>
          <p className="text-[13px] font-bold text-[#000080] mb-3">
            Recent Addresses
          </p>
          <div className="space-y-3">
            {recentAddresses.map((addr) => {
              const isSelected = selected === addr.name;
              const subtitle = [
                addr.street,
                addr.city,
                addr.state,
                addr.country,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <button
                  key={addr.name}
                  onClick={() => handlePickRecent(addr)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border text-left",
                    "transition-all duration-200 shadow-sm",
                    isSelected
                      ? "border-[#1D6FF2] bg-blue-50/60"
                      : "border-slate-100 bg-white hover:border-[#1D6FF2]/40 hover:bg-slate-50/60",
                  )}
                >
                  <IconBadge icon={MapPin} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[14px] font-bold truncate",
                        isSelected ? "text-[#000080]" : "text-[#0d1b8e]",
                      )}
                    >
                      {addr.name}
                    </p>
                    {subtitle && (
                      <p className="text-[12px] text-slate-500 truncate mt-0.5">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      isSelected ? "border-[#1D6FF2]" : "border-slate-300",
                    )}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1D6FF2]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function RecipientFormView({
  onEdit,
  onConfirm,
}: {
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const { form } = useLostItemForm();
  const sendAddress = form.watch("sendAddress");
  const streetAddress = form.watch("sendStreet");
  const {
    formState: { errors },
  } = form;

  const handleConfirm = async () => {
    const isValid = await form.trigger([
      "sendEmail",
      "sendMobilePhone",
      "sendFullName",
    ]);

    if (!isValid) return;

    onConfirm();
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <Card className="flex items-center gap-4 p-4 sm:p-5">
        <IconBadge icon={MapPin} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
            Delivery Address
          </p>
          <p className="text-[14px] font-bold text-[#0d1b8e] mt-0.5 truncate">
            {sendAddress}
          </p>
          <p className="text-[14px] mt-0.5 truncate">{streetAddress}</p>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1D6FF2] hover:text-[#000080] transition-colors shrink-0"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </button>
      </Card>

      <Card className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <User className="w-4 h-4 text-[#1D6FF2]" />
          <p className="text-[15px] font-bold text-[#0d1b8e]">
            Who's receiving this?
          </p>
        </div>

        <Field label="Recipient Name *" error={errors?.sendFullName?.message}>
          <IconInput
            icon={User}
            {...form.register("sendFullName", {
              required: "Full name is required",
            })}
            placeholder="Full name"
          />
        </Field>

        <TwoCol>
          <Field
            label="Phone Number *"
            error={errors?.sendMobilePhone?.message}
          >
            <IconInput
              icon={Phone}
              type="tel"
              {...form.register("sendMobilePhone", {
                required: "Mobile Phone is required",
              })}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label="Email *" error={errors?.sendEmail?.message}>
            <IconInput
              icon={Mail}
              type="email"
              {...form.register("sendEmail", {
                required: "Email is Required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="email@example.com"
            />
          </Field>
        </TwoCol>

        <GradientButton onClick={handleConfirm}>Confirm Address</GradientButton>
      </Card>
    </motion.div>
  );
}

function ConfirmedView({ onChange }: { onChange: () => void }) {
  const { form } = useLostItemForm();

  const label = form.watch("sendFullName");
  const lines = form.watch("sendStreet");
  const phone = form.watch("sendMobilePhone");
  const state = form.watch("sendState");
  const country = form.watch("sendCountry");

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="border border-[#1D6FF2]/20 bg-[#F0F7FF] p-5 sm:p-6 flex gap-4">
        <IconBadge icon={Home} />
        <div className="flex-1 space-y-1">
          <p className="text-[15px] font-bold text-[#0d1b8e]">{label}</p>

          <p className="text-[13px] text-slate-500">{lines}</p>
          <p className="text-[13px] text-slate-500">{state}</p>
          <p className="text-[13px] text-slate-500">{country}</p>
          <p className="text-[13px] text-slate-500">{phone}</p>
          <div className="flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-5 h-5" fill="#1D6FF2" stroke="white" />{" "}
            <span className="text-[13px] font-bold text-[#1D6FF2]">
              Confirmed
            </span>
          </div>
        </div>
        <button
          onClick={onChange}
          className="shrink-0 text-[13px] font-semibold text-[#1D6FF2] hover:text-[#000080] transition-colors"
        >
          Change
        </button>
      </Card>
    </motion.div>
  );
}

export default function DeliveryStep() {
  const { state, actions, form } = useLostItemForm();

  const params = useParams();
  const itemTypesId = (params.id as string)?.toLowerCase();

  const headerProps = {
    select: {
      title: "Where should we deliver?",
      subtitle: "Select or enter your delivery address",
    },
    recipient: {
      title: "Where should we deliver?",
      subtitle: "Select or enter your delivery address",
    },
    confirmed: { title: "Delivery Confirmation" },
  }[state.view as ViewState];

  const { data: lostItemData, isLoading: isLostItemLoading } =
    useGetLostItemQuery(itemTypesId);

  const lostItemId = lostItemData?.data?._id;

  const [addShipping, { isLoading }] = useAddShippingMutation();

  const handlePrev = () => {
    if (form.watch("selectedItems").length) {
      actions.goToStep("item-details");
      actions.setView("item-list");
      return;
    }
    actions.prevStep();
  };

  const onSubmit = async (data: LostItemFormData) => {
    if (!data.selectedItems || data.selectedItems.length === 0) {
      toast.error("Please add at least one item before continuing");
      return;
    }

    try {
      const res = await addShipping({
        address_from: {
          placeName: data.placeName,
          businessName: data?.businessName,
          name: data.name,
          street1: data.street1,
          street2: data.street2,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.countryCode,
          countryName: data.country ?? data.countryName,
          phone: data.phone,
          email: data.email,
        },
        address_to: {
          name: data.sendFullName,
          street1: data.sendStreet,
          street2: data.address2,
          city: data.sendCity,
          state: data.sendState,
          postal_code: data.sendPostalCode,
          country: data.sendCountryCode,
          countryName: data.sendCountry,
          phone: data.sendMobilePhone,
          email: data.sendEmail,
        },
        parcel: data.selectedItems.map((item) => ({
          itemType: item.subcategory,
          name: item.name,
          description: item.description || "",
        })),
        lostItemId: lostItemId,
        notes: data.notes,
      });

      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Shipping details saved successfully",
        );

        actions.setOrderId(res?.data?.data?._id);
        // router.push(`/orders/${itemTypesId}/${res?.data?.data?._id}`);
        actions.nextStep();
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Shipping submission error:", error);
    }
  };

  const handleNext = form.handleSubmit(onSubmit);

  return (
    <>
      <div className="w-full flex flex-col items-center px-4 py-5 pb-24 sm:pb-40">
        <div className="w-full max-w-[640px]">
          <StepHeader Icon={Home} {...headerProps} step={3} />

          <AnimatePresence mode="wait">
            {state.view === "select" && (
              <AddressSelectView
                key="select"
                onSelect={() => actions.setView("recipient")}
              />
            )}

            {state.view === "manual" && (
              <ManualView
                key="manual"
                onSearch={() => actions.setView("select")}
                onConfirm={() => {
                  actions.setView("recipient");
                }}
              />
            )}

            {state.view === "recipient" && (
              <RecipientFormView
                key="recipient"
                onEdit={() => actions.setView("select")}
                onConfirm={() => {
                  actions.setView("confirmed");
                }}
              />
            )}

            {state.view === "confirmed" && (
              <ConfirmedView
                key="confirmed"
                onChange={() => {
                  actions.setView("select");
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <FormFooter
        onBack={handlePrev}
        onNext={handleNext}
        nextLabel={isLoading ? "Loading..." : "Shipping"}
        disableBack={isLostItemLoading}
        disableNext={state.view !== "confirmed" || isLoading}
      />
    </>
  );
}
