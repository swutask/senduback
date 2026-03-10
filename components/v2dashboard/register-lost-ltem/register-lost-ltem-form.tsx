"use client";

import QRScannerModal from "@/components/dashboard/lost-items-list/QRScannerModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, getImageUrl } from "@/lib/utils";
import {
  useGetLostItemByIdQuery,
  useRegisterLostItemMutation,
  useUpdateLostItemMutation,
  useUploadLostItemImageMutation,
} from "@/redux/features/lostItem/lostitemApi";
import { useGetMyPropertiesQuery } from "@/redux/features/property/propertyApi";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  InfoIcon,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export type RegisterItemData = {
  itemName: string;
  foundLocation: string;
  dateFound: string;
  internalNotes: string;
  photos: File[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  property: string;
  sendRecoveryLink: boolean;
  existingImages?: string[];
  countryCode?: string;
};

const STEP_LABELS = [
  { number: 1, label: "Item Details", id: "item-details" },
  { number: 2, label: "Guest Details", id: "guest-details" },
  { number: 3, label: "Review & Actions", id: "review-actions" },
  { number: 4, label: "Item Photos", id: "item-photos" },
];

export function RegisterLostItemForm({ onCancel }: { onCancel?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterItemData>({
    itemName: "",
    foundLocation: "",
    dateFound: "",
    internalNotes: "",
    photos: [],
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    property: "",
    sendRecoveryLink: false,
    existingImages: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newlyRegisteredId, setNewlyRegisteredId] = useState<string | null>(
    null,
  );
  const [shouldCloseQRModal, setShouldCloseQRModal] = useState(false);
  const [socketImages, setSocketImages] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.45:3000";

  const searchParams = useSearchParams();
  const itemId = searchParams.get("id");
  const router = useRouter();

  // Fetch item data if in edit mode
  const { data: itemResponse, isLoading: isFetchingItem } =
    useGetLostItemByIdQuery(itemId || "", {
      skip: !itemId,
    });

  const itemData = itemResponse?.data;

  useEffect(() => {
    if (itemData) {
      console.log("Single Item Data:", itemData);
      setFormData({
        itemName: itemData.itemName || "",
        foundLocation: itemData.locationFound || "",
        dateFound: itemData.dateFound
          ? new Date(itemData.dateFound).toISOString().split("T")[0]
          : "",
        internalNotes: itemData.itemDescription || "",
        photos: [], // We don't populate File objects from API, but we might show existing images later
        guestName: itemData.guestName || "",
        guestEmail: itemData.guestEmail || "",
        guestPhone: itemData.guestPhone || "",
        property: itemData.property?._id || itemData.property || "",
        sendRecoveryLink: false,
        existingImages: itemData.images || [],
      });
    }
  }, [itemData]);

  // backende api
  const [registerLostItem, { isLoading: isRegistering }] =
    useRegisterLostItemMutation();
  const [updateLostItem, { isLoading: isUpdatingItem }] =
    useUpdateLostItemMutation();
  const [uploadImage, { isLoading: isUploading }] =
    useUploadLostItemImageMutation();

  // property item
  const { data: properties } = useGetMyPropertiesQuery({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // QR Modal by Upload image from phone

  const handleQRModalClose = () => {
    setShouldCloseQRModal(false);
  };

  const initializeSocketConnection = (id: string) => {
    console.log(`Socket listening on: getImages::${id}`);

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(baseURL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error(
        "Cannot connect to real-time server. Mobile uploads may not work.",
      );
    });

    socket.on(`getImages::${id}`, (data) => {
      console.log("Received socket data:", data);
      setShouldCloseQRModal(true);
      if (data && data.images && Array.isArray(data.images)) {
        setSocketImages((prev) => {
          const newImages = [...prev];
          data.images.forEach((imagePath: string) => {
            if (!newImages.includes(imagePath)) {
              newImages.push(imagePath);
            }
          });

          if (newImages.length > prev.length) {
            toast.success(
              `${newImages.length - prev.length} new image(s) uploaded from mobile!`,
            );
          }

          return newImages;
        });
      }
      // Redirect to lost items list after a short delay to allow toast to be seen
      setTimeout(() => {
        router.push("/dashboard/lost-items");
      }, 1500);
    });

    socketRef.current = socket;
  };

  useEffect(() => {
    if (currentStep === 4) {
      const activeId = itemId || newlyRegisteredId;
      if (activeId) {
        initializeSocketConnection(activeId);
      }
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentStep, itemId, newlyRegisteredId]);

  const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos].slice(0, 3),
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.itemName.trim())
        newErrors.itemName = "Item name is required";
      if (!formData.foundLocation.trim())
        newErrors.foundLocation = "Found location is required";
      if (!formData.property) newErrors.property = "Property is required";
    } else if (step === 2) {
      // Guest fields are now optional
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (id: string | null) => {
    if (!id) return;
    if (formData.photos.length > 0) {
      toast.info("Uploading photos...");
      for (const photo of formData.photos) {
        const photoData = new FormData();
        photoData.append("lostImage", photo);
        await uploadImage({ id, formData: photoData }).unwrap();
      }
    }
  };

  const handleRegister = async (payload: any) => {
    try {
      const res = await registerLostItem(payload).unwrap();
      const newId = res?.data?._id;
      if (newId) {
        setNewlyRegisteredId(newId);
        toast.success("Lost item registered successfully!");
        setCurrentStep(4);
      }
    } catch (err: any) {
      console.error("Failed to register lost item:", err);
      toast.error(err?.data?.message || "Failed to register lost item");
    }
  };

  const handleUpdate = async (id: string, payload: any) => {
    try {
      await updateLostItem({ id, data: payload }).unwrap();
      toast.success("Lost item updated successfully!");
      setCurrentStep(4);
    } catch (err: any) {
      console.error("Failed to update lost item:", err);
      toast.error(err?.data?.message || "Failed to update lost item");
    }
  };

  const handleSubmit = async () => {
    if (!formData.property) {
      toast.error("Please select a property in the first step.");
      return;
    }

    const payload = {
      itemName: formData.itemName,
      itemDescription: formData.internalNotes,
      dateFound: formData.dateFound
        ? new Date(formData.dateFound).toISOString()
        : new Date().toISOString(),
      locationFound: formData.foundLocation,
      guestName: formData.guestName,
      guestPhone: formData.guestPhone,
      guestEmail: formData.guestEmail,
      property: formData.property,
    };

    if (itemId) {
      const res = await handleUpdate(itemId, payload);
      console.log("updated", res);
    } else {
      const res = await handleRegister(payload);
      console.log("registered", res);
    }
  };

  const StepIndicator = () => (
    <div className="bg-[#EBECF0] rounded-sm overflow-hidden mb-6">
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#047BD2" />
            <stop offset="1" stopColor="#045EB3" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-center">
        {STEP_LABELS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div
              key={step.id}
              className="flex-1 relative h-8 sm:h-12 flex items-center justify-center"
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H185L200 20L185 40H0V0Z"
                  fill={
                    isCompleted || isActive ? "url(#activeGradient)" : "#E5E7EB"
                  }
                  className="transition-colors duration-300"
                />
              </svg>
              <div className="relative z-10 flex items-center gap-1 sm:gap-2 px-1">
                {isCompleted ? (
                  <CheckCircle2
                    size={16}
                    className="text-white sm:w-5 sm:h-5"
                  />
                ) : (
                  <span
                    className={`text-xs sm:text-sm font-bold ${isActive ? "text-white" : "text-gray-600"}`}
                  >
                    {step.number}
                  </span>
                )}
                <span
                  className={`hidden sm:inline text-xs sm:text-sm font-semibold ${isCompleted || isActive ? "text-white" : "text-gray-600"}`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full md:max-w-4xl bg-white shadow-2xl border border-white/40 rounded-2xl">
      <div className="p-2 md:p-8 pb-6 border-b">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
        >
          <ArrowLeft size={18} />
          Back to Lost Items
        </Link>

        {/* Header */}
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {itemId ? "Update Lost Item" : "Register Lost Item"}
          </h1>
          <StepIndicator />
        </div>
      </div>

      {/* Form Content */}
      <Card className="p-3 md:p-8 pt-6 border-0 shadow-none ">
        {/* Step 1: Item Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Step 1: Item Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <Label
                  htmlFor="itemName"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  name="itemName"
                  placeholder="e.g., Gold Watch"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={cn(
                    "border-gray-300 py-4",
                    errors.itemName &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.itemName && (
                  <p className="text-xs text-red-500 mt-1">{errors.itemName}</p>
                )}
              </div>

              {/* Property */}
              <div>
                <Label
                  htmlFor="property"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Property <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.property}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, property: value }))
                  }
                >
                  <SelectTrigger
                    id="property"
                    className={cn(
                      "border-gray-300 py-4! w-full",
                      errors.property && "border-red-500",
                    )}
                  >
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties?.data?.map((prop: any) => (
                      <SelectItem
                        className="text-black! font-medium hover:bg-gray-200!"
                        key={prop._id}
                        value={prop._id}
                      >
                        {prop.propertyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.property && (
                  <p className="text-xs text-red-500 mt-1">{errors.property}</p>
                )}
              </div>

              {/* Found Location */}
              <div>
                <Label
                  htmlFor="foundLocation"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Found Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="foundLocation"
                  name="foundLocation"
                  placeholder="e.g., Main Lobby, Room 302"
                  value={formData.foundLocation}
                  onChange={handleInputChange}
                  className={cn(
                    "border-gray-300 py-4",
                    errors.foundLocation && "border-red-500",
                  )}
                />
                {errors.foundLocation && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.foundLocation}
                  </p>
                )}
              </div>

              {/* Date Found */}
              <div>
                <Label
                  htmlFor="dateFound"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Date Found
                </Label>
                <Input
                  id="dateFound"
                  name="dateFound"
                  type="date"
                  value={formData.dateFound}
                  onChange={handleInputChange}
                  className="border-gray-300 py-4"
                />
              </div>

              {/* Internal Notes */}
              <div>
                <Label
                  htmlFor="notes"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Internal Notes / Description
                </Label>
                <Textarea
                  id="notes"
                  name="internalNotes"
                  placeholder="e.g., Gold wristwatch with leather strap"
                  value={formData.internalNotes}
                  onChange={handleInputChange}
                  className="border-gray-300 py-4 h-24"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Guest Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Step 2: Guest Details
              </h2>
              <p className="text-md text-gray-600 mt-2">Guest details</p>
              <p className="text-md text-gray-600">
                Please provide complete guest information for proper delivery
                and contact.
              </p>
            </div>

            <div className="space-y-4">
              {/* Guest Name */}
              <div>
                <Label
                  htmlFor="guestName"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Guest Name
                </Label>
                <Input
                  id="guestName"
                  name="guestName"
                  placeholder="John Doe"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  className={cn(
                    "border-gray-300 py-4",
                    errors.guestName &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.guestName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.guestName}
                  </p>
                )}
              </div>
              {/* Guest Email */}
              <div>
                <Label
                  htmlFor="guestEmail"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Guest Email
                </Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  className={cn(
                    "border-gray-300 py-4",
                    errors.guestEmail &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                />
                {errors.guestEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.guestEmail}
                  </p>
                )}
              </div>
              {/* Guest Phone */}

              <div>
                <Label
                  htmlFor="guestPhone"
                  className="text-md font-medium text-gray-900 mb-2 block"
                >
                  Guest Phone Number
                </Label>

                <div className="flex gap-4 items-center ">
                  {/* <Select
                    value={formData.countryCode}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, countryCode: value }))
                    }
                  >
                    <SelectTrigger className="w-28 border-gray-400 py-3">
                      <SelectValue placeholder="+1" />
                    </SelectTrigger>

                    <SelectContent className="max-h-64 overflow-y-auto">
                      {countryCodes.map((country) => (
                        <SelectItem className="text-black font-medium" key={country.code} value={country.code}>
                          {country.code} {country.dial_code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  {/* <PhoneCall className="size-7 text-primary" /> */}

                  <Input
                    id="guestPhone"
                    name="guestPhone"
                    placeholder="5551234567"
                    value={formData.guestPhone}
                    onChange={handleInputChange}
                    className={cn(
                      "border-gray-400 py-3 flex-1",
                      errors.guestPhone &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                  />
                </div>
                {errors.guestPhone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.guestPhone}
                  </p>
                )}
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <InfoIcon size={16} className="text-blue-600" />
              <AlertDescription className="text-blue-800 ml-2">
                If an email is provided, the recovery link can be sent
                automatically.
              </AlertDescription>
            </Alert>

            {/* Send Recovery Link */}
            <div className="flex items-center gap-2 pt-2">
              <RadioGroup
                defaultValue={formData.sendRecoveryLink ? "yes" : "no"}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="send-link" />
                  <Label
                    htmlFor="send-link"
                    className="text-md text-gray-700 cursor-pointer"
                  >
                    Send recovery link automatically after saving
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-transparent"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                Continue <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Actions */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Review & Actions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Item Details Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Item details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Property</p>
                    <p className="font-medium text-gray-900">
                      {properties?.data?.find(
                        (p: any) => p._id === formData.property,
                      )?.propertyName || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Item Name</p>
                    <p className="font-medium text-gray-900">
                      {formData.itemName || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Found location</p>
                    <p className="font-medium text-gray-900">
                      {formData.foundLocation || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Found date & time</p>
                    <p className="font-medium text-gray-900">
                      {formData.dateFound || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Internal notes</p>
                    <p className="font-medium text-gray-900">
                      {formData.internalNotes || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Guest & Delivery */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Guest & delivery
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-md font-medium text-gray-900 mb-2 block">
                      Guest Name
                    </Label>
                    <Input
                      placeholder="Enter Guest Name"
                      type="text"
                      value={formData.guestName}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          guestName: e.target.value,
                        }));
                        if (errors.guestName) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.guestName;
                            return newErrors;
                          });
                        }
                      }}
                      className={cn(
                        "border-gray-300 py-4",
                        errors.guestName &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                    />
                    {errors.guestName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.guestName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-md font-medium text-gray-900 mb-2 block">
                      Guest Email
                    </Label>
                    <Input
                      placeholder="Enter Guest Email"
                      type="email"
                      value={formData.guestEmail}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          guestEmail: e.target.value,
                        }));
                        if (errors.guestEmail) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.guestEmail;
                            return newErrors;
                          });
                        }
                      }}
                      className={cn(
                        "border-gray-300 py-4",
                        errors.guestEmail &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
                    />
                    {errors.guestEmail && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.guestEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-gray-600">Guest Phone</p>
                    <p className="font-medium text-gray-900">
                      {formData.guestPhone || "Not provided"}
                    </p>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <InfoIcon size={16} className="text-blue-600" />
                    <AlertDescription className="text-blue-800 ml-2">
                      If you send the link, the guest will receive an email to
                      arrange return of their item.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-transparent"
              >
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isRegistering || isUpdatingItem}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  {isRegistering || isUpdatingItem
                    ? "Processing..."
                    : "Save & Continue to Photos"}
                  {!isRegistering && !isUpdatingItem && (
                    <ChevronRight size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Item Photos */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Step 4: Item Photos
              </h2>
              <p className="text-md text-gray-600">Add photos of the item</p>
              <p className="text-xs text-gray-500 mt-1">
                Photos help guests quickly confirm their item.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div>
                <label className="block border-2 border-dashed border-gray-400 rounded-lg py-3 p-6 text-center cursor-pointer hover:border-gray-400 transition">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="font-medium text-gray-700">
                    Drag & drop photos here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Up to 3 photos (JPG/PNG)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotosUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* QR Upload */}
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Upload size={18} />
                  Upload from phone (Scan QR)
                </p>

                <QRScannerModal
                  lostItemId={itemId || newlyRegisteredId || undefined}
                  isInline={true}
                  onMobileUploadComplete={
                    shouldCloseQRModal ? handleQRModalClose : undefined
                  }
                />
              </div>
            </div>

            {/* Image Previews */}
            <div className="space-y-4">
              {/* Existing Images (Edit mode) */}
              {formData.existingImages &&
                formData.existingImages.length > 0 && (
                  <div>
                    <p className="text-md font-medium text-gray-900 mb-2">
                      Existing Photos
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      {formData.existingImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={getImageUrl(img)}
                            alt="Existing"
                            width={100}
                            height={100}
                            className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Newly Uploaded Photos */}
              {formData.photos.length > 0 && (
                <div>
                  <p className="text-md font-medium text-gray-900 mb-2">
                    New Photos ({formData.photos.length}/3)
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={URL.createObjectURL(photo)}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                        />
                        <button
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              photos: prev.photos.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Socket Images (Mobile Uploads) */}
              {socketImages.length > 0 && (
                <div className="space-y-3 mt-6">
                  <p className="text-md font-medium text-gray-900 mb-2">
                    Uploaded from Mobile
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {socketImages.length} image(s) received from mobile device
                  </p>
                  <div className="flex gap-4 flex-wrap">
                    {socketImages.map((imagePath, index) => (
                      <div key={index} className="relative">
                        <div className="w-24 h-24 rounded-lg overflow-hidden border shadow-sm">
                          <img
                            src={`${baseURL}${imagePath}`}
                            alt={`Mobile Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-image.jpg";
                            }}
                          />
                        </div>
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1 rounded">
                          Mobile
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Skip Option */}
            <div className="flex items-center gap-2">
              <RadioGroup defaultValue="no-skip">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="skip" id="skip" />
                  <Label
                    htmlFor="skip"
                    className="text-md text-gray-700 cursor-pointer"
                  >
                    Skip photos for now
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-transparent"
              >
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/lost-items")}
                  className="bg-transparent"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={async () => {
                    await handleImageUpload(itemId || newlyRegisteredId);
                    router.push("/dashboard/lost-items");
                  }}
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  {isUploading ? "Uploading..." : "Finish & Save Photos"}
                  {!isUploading && <ChevronRight size={18} />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
