"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  CircleCheck,
  Info,
  Mail,
  MapPin,
  Phone,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useUpdateUserProfileMutation } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { selectAccessToken, setUser } from "@/redux/features/auth/authSlice";

type BusinessDetailsFormValues = {
  businessName: string;
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
};

export function BusinessDetailsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessDetailsFormValues>();

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentToken = useAppSelector(selectAccessToken);

  const [images, setImages] = useState<File[]>([]);

  const onSubmit = async (data: BusinessDetailsFormValues) => {
    try {
      const formData = new FormData();

      // Append image if available
      if (images.length > 0) {
        formData.append("image", images[0]);
      }

      // Backend expects data in this format
      const profileData = {
        businessName: data.businessName,
        addressLine1: data.address1,
        addressLine2: data.address2 || "",
        city: data.city,
        postcode: data.postcode,
        country: data.country,
        businessEmail: data.email,
        telephone: data.phone,
      };

      formData.append("data", JSON.stringify(profileData));

      const response = await updateUserProfile(formData).unwrap();

      if (response?.success) {
        // Update user state if the backend returns it
        if (response.data && currentToken) {
          dispatch(
            setUser({
              user: response.data,
              accessToken: currentToken,
            }),
          );
        }

        toast.success("Business details saved successfully!");
        router.push("/dashboard");
      } else {
        toast.error(response?.message || "Failed to save business details");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save business details");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2 text-blue-600">
            <CircleCheck className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Business Details</h2>
            <p className="text-sm text-gray-500">
              This information will be used for your default property
            </p>
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label className="text-sm font-semibold">Business Name *</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
            <Input
              className="h-11 pl-9 bg-gray-50 border-gray-200"
              placeholder="Your Business Name"
              {...register("businessName", {
                required: "Business name is required",
              })}
            />
          </div>
          {errors.businessName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.businessName.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-blue-600" />
            Business Address
          </div>

          <div>
            <label className="text-sm font-semibold">Address Line 1 *</label>
            <Input
              className="h-11 bg-gray-50 border-gray-200"
              placeholder="123 Main Street"
              {...register("address1", {
                required: "Address line 1 is required",
              })}
            />
            {errors.address1 && (
              <p className="text-sm text-red-500 mt-1">
                {errors.address1.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">Address Line 2</label>
            <Input
              className="h-11 bg-gray-50 border-gray-200"
              placeholder="Suite 100 (optional)"
              {...register("address2")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">City *</label>
              <Input
                className="h-11 bg-gray-50 border-gray-200"
                placeholder="City"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold">Postcode *</label>
              <Input
                className="h-11 bg-gray-50 border-gray-200"
                placeholder="Postcode"
                {...register("postcode", {
                  required: "Postcode is required",
                })}
              />
              {errors.postcode && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.postcode.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Country *</label>
            <Input
              className="h-11 bg-gray-50 border-gray-200"
              placeholder="Country"
              {...register("country", {
                required: "Country is required",
              })}
            />
            {errors.country && (
              <p className="text-sm text-red-500 mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Phone className="h-4 w-4 text-blue-600" />
            Contact Information
          </div>

          <div>
            <label className="text-sm font-semibold">Business Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                className="h-11 pl-9 bg-gray-50 border-gray-200"
                placeholder="ss@gmail.com"
                {...register("email", {
                  required: "Email is required",
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">
              Telephone (with country code) *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                className="h-11 pl-9 bg-gray-50 border-gray-200"
                placeholder="+44 20 1234 5678"
                {...register("phone", {
                  required: "Phone number is required",
                })}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Image
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="business-image"
            />

            <label htmlFor="business-image" className="cursor-pointer block">
              <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
              <p className="text-gray-600">Click to upload business image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden border"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg border border-[#BEDBFF] bg-[#EFF6FF] p-4 text-sm">
          <div className="flex gap-2">
            <Info className="size-6 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium">What happens next?</p>
              <p className="text-gray-600">
                A default property will be automatically created with these
                details.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg"
        >
          {isLoading ? "Saving..." : "Complete Setup →"}
        </Button>
      </form>
    </div>
  );
}
