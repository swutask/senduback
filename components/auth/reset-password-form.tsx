"use client";

import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type LoginFormData = {
  email: string;
};

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = (data: LoginFormData) => {
    console.log("Login form data:", data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Login to your account.
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-lg">
            Enter your email to reset password
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="text"
              className="p-5 rounded-lg !text-xl text-black bg-gray-100"
              placeholder="example@gmail.com"
              {...register("email", {
                required: "email is required",
                minLength: {
                  value: 6,
                  message: "email must be at least 6 characters",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <p className="text-md">We will send an email to reset your password</p>

        {/* Submit */}
        <div className="text-center">
          <Button
            type="submit"
            className="w-1/2 mx-auto text-white px-9 py-6 rounded-2xl bg-linear-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
          >
            Reset email
          </Button>
        </div>
      </form>
    </div>
  );
}
