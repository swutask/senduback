"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show loading toast
    const toastId = toast.loading("Logging in...");

    try {
      const response = await login(formData).unwrap();

      if (response.success && response.data) {
        // Format user data
        const userData = {
          id: response.data.userInfo.id,
          name: response.data.userInfo.name,
          email: response.data.userInfo.email,
          role: response.data.userInfo.role,
          image: response.data.userInfo.image || "",
        };

        // Remove quotes from token if they exist
        const accessToken = response.data.accessToken.replace(/^"|"$/g, "");

        dispatch(
          setUser({
            user: userData,
            accessToken: accessToken,
          }),
        );

        toast.success("Login successful!", { id: toastId });
        console.log("Login successful:", userData);

        // Redirect to home
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Login failed", { id: toastId });
      }
    } catch (err: any) {
      console.error("Login failed:", err);

      // Show appropriate error message
      const errorMessage =
        err?.data?.message || err?.error || "Login failed. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6 w-full mx-auto bg-white px-8 text-center z-50">
      <div className="space-y-2">
        <p className="text-gray-500 text-base font-normal leading-6">
          Sign in to continue your journey with us
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="font-semibold">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="border-none bg-gray-100 text-black text-xl! py-6 focus:ring-2 focus:ring-primary/75 focus:outline-none"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-semibold">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="border-none bg-gray-100 text-black text-xl! py-6 focus:ring-2 focus:ring-primary/75 focus:outline-none"
              required
              disabled={isLoading}
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

        <div className="flex items-end justify-end">
          <Link href={"/forgot-password"} className="underline">
            Forgot password ?
          </Link>
        </div>

        <Button
          type="submit"
          className="min-w-1/2 text-white px-9 py-6 rounded-2xl bg-linear-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="text-center flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">Don't have an account? </p>
        <Link href="/register" className="text-primary font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
}
