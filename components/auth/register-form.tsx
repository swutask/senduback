"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    agreeToNewsletters: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (
    field: "agreeToTerms" | "agreeToNewsletters",
    checked: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and conditions!");
      return;
    }

    const toastId = toast.loading("Creating your account...");

    try {
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: "business",
      };

      const response = await signup(signupData).unwrap();

      if (response.success) {
        toast.success("Account created successfully!", {
          id: toastId,
          description: "Please verify your email with OTP.",
        });

        console.log("User ID:", response.data);

        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
          agreeToNewsletters: false,
        });

        // Redirect to OTP verification page with email as query parameter
        setTimeout(() => {
          // Encode email for URL
          const encodedEmail = encodeURIComponent(formData.email);
          router.push(`/verify-otp?email=${encodedEmail}`);
        }, 1000);
      } else {
        toast.error(response.message || "Signup failed", { id: toastId });
      }
    } catch (err: any) {
      console.error("Signup failed:", err);

      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.error ||
        "Signup failed. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="space-y-6 w-full px-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
        <p className="">
          By registering, you can create your own Businesses for which you can
          manage your lost and found separately and efficiently.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border-none bg-gray-100 text-black text-xl! py-5 focus:ring-2 focus:ring-primary/75 focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Smith"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border-none bg-gray-100 text-black text-xl! py-5 focus:ring-2 focus:ring-primary/75 focus:outline-none"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            className="border-none bg-gray-100 text-black text-xl! py-5 focus:ring-2 focus:ring-primary/75 focus:outline-none"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="border-none bg-gray-100 text-black text-xl! py-5 focus:ring-2 focus:ring-primary/75 focus:outline-none"
              required
              disabled={isLoading}
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="border-none bg-gray-100 text-black text-xl! py-5 focus:ring-2 focus:ring-primary/75 focus:outline-none"
              required
              disabled={isLoading}
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) =>
              handleCheckboxChange("agreeToTerms", checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="terms" className="text-sm font-normal">
            I have read and agree to roqit's Terms and conditions
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletters"
            checked={formData.agreeToNewsletters}
            onCheckedChange={(checked) =>
              handleCheckboxChange("agreeToNewsletters", checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="newsletters" className="text-sm font-normal">
            I want to receive occasional marketing emails and Newsletters from
            Senduback
          </Label>
        </div>

        <div className="text-center">
          <Button
            type="submit"
            className="min-w-1/2 mt-6 text-white px-9 py-6 rounded-2xl bg-gradient-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
