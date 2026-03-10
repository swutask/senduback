"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getImageUrl } from "@/lib/utils";
import {
  useCreatePropertyMutation,
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
} from "@/redux/features/property/propertyApi";
import { Building2, MapPin, Phone, Upload, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AddPropertyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId?: string | null;
  userId?: string | null;
}

export function AddPropertyFormModal({
  open,
  onOpenChange,
  propertyId,
  userId,
}: AddPropertyFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    propertyImage: [] as File[],
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    setAsDefault: false,
    status: "",
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const params = useParams();
  const businessId = params.manageProperties as string;
  console.log("businessId", businessId);

  // Fetch property data if in edit mode
  const { data: propertyData, isLoading: isFetching } = useGetPropertyByIdQuery(
    propertyId || "",
    {
      skip: !propertyId || !open,
    },
  );

  const [createProperty, { isLoading: isCreating }] =
    useCreatePropertyMutation();
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();

  const isLoading = isCreating || isUpdating || isFetching;

  // Pre-populate form when property data is loaded
  useEffect(() => {
    if (propertyId && propertyData?.data && open) {
      const p = propertyData.data;
      setFormData({
        propertyName: p.propertyName || "",
        propertyType: p.propertyType || "",
        propertyImage: [],
        addressLine1: p.addressLine1 || "",
        addressLine2: p.addressLine2 || "",
        city: p.city || "",
        postcode: p.postcode || "",
        country: p.country || "",
        contactEmail: p.contactEmail || "",
        contactPhone: p.contactPhone || "",
        website: p.website || "",
        setAsDefault: p.propertyType === "Default",
        status: p.status || "Active",
      });
    } else if (!propertyId && open) {
      // Reset form for fresh add
      setFormData({
        propertyName: "",
        propertyType: "",
        propertyImage: [],
        addressLine1: "",
        addressLine2: "",
        city: "",
        postcode: "",
        country: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
        setAsDefault: false,
        status: "",
      });
      setPreviewUrls([]);
      setStep(1);
    }
  }, [propertyId, propertyData, open]);

  // Clean up blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        propertyImage: [...prev.propertyImage, ...fileArray],
      }));

      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removePreview = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      propertyImage: prev.propertyImage.filter((_, i) => i !== index),
    }));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddProperty = async () => {
    const toastId = toast.loading(
      propertyId ? "Updating property..." : "Adding property...",
    );
    const formDataObj = new FormData();

    // Add all text fields
    formDataObj.append("propertyName", formData.propertyName);
    formDataObj.append("propertyType", formData.propertyType);
    formDataObj.append("addressLine1", formData.addressLine1);
    formDataObj.append("addressLine2", formData.addressLine2);
    formDataObj.append("city", formData.city);
    formDataObj.append("postcode", formData.postcode);
    formDataObj.append("country", formData.country);
    formDataObj.append("contactEmail", formData.contactEmail);
    formDataObj.append("contactPhone", formData.contactPhone);
    if (formData.website) formDataObj.append("website", formData.website);
    if (formData.status) formDataObj.append("status", formData.status);
    formDataObj.append("setAsDefault", String(formData.setAsDefault));

    // Add userId if provided
    if (userId) {
      formDataObj.append("userId", userId);
    }

    // Add multiple images if present
    if (formData.propertyImage && formData.propertyImage.length > 0) {
      formData.propertyImage.forEach((file) => {
        formDataObj.append("propertyImage", file);
      });
    }

    try {
      let response;
      if (propertyId) {
        response = await updateProperty({
          id: propertyId,
          data: formDataObj,
        }).unwrap();
      } else {
        response = await createProperty(formDataObj).unwrap();
      }

      if (response.success) {
        toast.success(
          propertyId
            ? "Property updated successfully!"
            : "Property added successfully!",
          { id: toastId },
        );
        onOpenChange(false);
        setStep(1);
        setFormData({
          propertyName: "",
          propertyType: "",
          propertyImage: [],
          addressLine1: "",
          addressLine2: "",
          city: "",
          postcode: "",
          country: "",
          contactEmail: "",
          contactPhone: "",
          website: "",
          setAsDefault: false,
          status: "",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${propertyId ? "update" : "add"} property`,
        { id: toastId },
      );
    }
  };

  const getStepIcon = (stepNum: number) => {
    if (stepNum === 1) return <Building2 size={24} />;
    if (stepNum === 2) return <MapPin size={24} />;
    return <Phone size={24} />;
  };

  const getStepLabel = (stepNum: number) => {
    if (stepNum === 1) return "Basic Info";
    if (stepNum === 2) return "Address";
    return "Contact";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:min-w-3xl h-[80vh] overflow-y-auto rounded-xl p-0 border-0">
        <div className="bg-blue-600 text-white p-4 md:p-6 py-3! rounded-t-lg flex items-center justify-between ">
          <DialogTitle className="text-white text-lg">
            {propertyId ? "Edit Property Details" : "Add Property Details"}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white hover:opacity-80"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-2 md:p-8 space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between ">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 md:w-12 h-8 md:h-12 rounded-full border-2 ${
                    stepNum < step
                      ? "bg-green-500 border-green-500 text-white"
                      : stepNum === step
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-gray-200 border-gray-300 text-gray-500"
                  }`}
                >
                  {stepNum < step ? (
                    <span className="text-white font-bold">✓</span>
                  ) : (
                    getStepIcon(stepNum)
                  )}
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-gray-700">
                    {getStepLabel(stepNum)}
                  </p>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      stepNum < step ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="propertyName"
                    placeholder="e.g., Hilton Liverpool"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="propertyType"
                    placeholder="e.g., Hotel, Apartment"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg md:p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="property-image"
                    />
                    <label
                      htmlFor="property-image"
                      className="cursor-pointer block"
                    >
                      <Upload
                        className="mx-auto mb-2 text-gray-400"
                        size={32}
                      />
                      <p className="text-gray-600">
                        Click to upload property image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                  </div>
                  {formData.propertyImage.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removePreview(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {propertyId &&
                    propertyData?.data?.propertyImage &&
                    formData.propertyImage.length === 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {propertyData.data.propertyImage.map(
                          (img: string, index: number) => (
                            <div key={index} className="relative aspect-square">
                              <img
                                src={getImageUrl(img)}
                                alt={`Current ${index}`}
                                className="w-full h-full object-cover rounded-lg border"
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="addressLine1"
                    placeholder="123 Main Street"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <Input
                    type="text"
                    name="addressLine2"
                    placeholder="Suite 100"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode
                    </label>
                    <Input
                      type="text"
                      name="postcode"
                      placeholder="10001"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="country"
                    placeholder="US"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="contactEmail"
                    placeholder="property@example.com"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    name="contactPhone"
                    placeholder="+44 1234 567890"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <Input
                    type="url"
                    name="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2 bg-transparent"
                >
                  ← Back
                </Button>
              )}
              {step === 1 && (
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="gap-2"
                >
                  Cancel
                </Button>
              )}
            </div>
            <span className="text-sm text-gray-500">Step {step} of 3</span>
            <div>
              {step < 3 && (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                >
                  Next →
                </Button>
              )}
              {step === 3 && (
                <Button
                  onClick={handleAddProperty}
                  className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                  disabled={isLoading}
                >
                  {isLoading
                    ? propertyId
                      ? "Updating..."
                      : "Adding..."
                    : propertyId
                      ? "Update Property"
                      : "Add Property"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
