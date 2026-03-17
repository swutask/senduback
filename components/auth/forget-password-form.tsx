"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Key, Loader } from "lucide-react";
import { useForgetPasswordMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ForgetPasswordFormData = {
  email: string;
};

export default function ForgetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordFormData>();

  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      const res = await forgetPassword(data).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Verification code sent to your email");
        router.push(`/verify-otp?email=${data.email}&authType=forget-password`);
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Mail className="text-blue-600" size={26} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-sm">
          Enter your email address and we'll send you a verification code to
          reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address<span className="text-red-500">*</span>
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="h-12 bg-gray-100 rounded-lg"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Primary Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-white font-medium rounded-xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] disabled:opacity-70"
        >
          {isLoading ? (
            <Loader className="animate-spin mr-2" size={20} />
          ) : (
            "Send Verification Code →"
          )}
        </Button>

        {/* Back Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/signin")}
          className="w-full h-12 rounded-xl flex items-center gap-2"
        >
          ← Back to Sign In
        </Button>
      </form>

      {/* Account Recovery Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700 space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <Key size={16} className="text-blue-600" />
          Account Recovery:
        </div>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Enter the email associated with your account</li>
          <li>You'll receive a 6-digit verification code</li>
          <li>Use the code to set a new password</li>
        </ul>
      </div>
    </div>
  );
}
