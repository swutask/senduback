"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ResetPasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      router.push("/signin");
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    const toastId = toast.loading("Resetting your password...");

    try {
      const response = await resetPassword({
        token,
        ...data,
      }).unwrap();

      if (response.success) {
        toast.success("Password reset successfully!", {
          id: toastId,
          description: "You can now log in with your new password.",
        });
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to reset password", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage, { id: toastId });
    }
  };

  const newPassword = watch("newPassword");

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Lock className="text-blue-600" size={26} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Set New Password
        </h1>
        <p className="text-gray-500 text-sm">
          Choose a strong password to secure your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            psychology-title="New Password"
            className="text-sm font-medium"
          >
            New Password<span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 bg-gray-100 rounded-lg pr-10"
              {...register("newPassword", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>

          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            psychology-title="Confirm Password"
            className="text-sm font-medium"
          >
            Confirm Password<span className="text-red-500">*</span>
          </Label>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-12 bg-gray-100 rounded-lg pr-10"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-white font-medium rounded-xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}
