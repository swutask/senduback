"use client";

import {
  useResendOtpMutation,
  useVerifyAccountMutation,
} from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function OtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const authType = searchParams.get("authType") || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyAccount, { isLoading: isVerifying }] =
    useVerifyAccountMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      router.push("/signin");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;

    const newOtp = [...otp];
    pasted
      .slice(0, 6 - index)
      .split("")
      .forEach((v, i) => (newOtp[index + i] = v));

    setOtp(newOtp);

    const nextIndex = Math.min(index + pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    if (value.length > 1) {
      value
        .slice(0, 6 - index)
        .split("")
        .forEach((v, i) => (newOtp[index + i] = v));
      setOtp(newOtp);
      inputRefs.current[Math.min(index + value.length, 5)]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const toastId = toast.loading("Verifying OTP...");

    try {
      // Use the mutation without .unwrap()
      const response = await verifyAccount({
        email: email,
        oneTimeCode: otpCode,
      });

      console.log(response);

      if (response.data?.success) {
        // Save user and token to Redux store
        const userData = response.data.data;

        console.log(userData);

        if (userData?.accessToken) {
          dispatch(
            setUser({
              user: userData.user,
              accessToken: userData.accessToken,
            }),
          );
        }

        toast.success("Account verified successfully!", {
          id: toastId,
          description: "Your account is now active.",
        });

        if (authType === "forget-password") {
          setTimeout(() => {
            router.push(`/reset-password?token=${userData.token}`);
          }, 1000);
        } else {
          setTimeout(() => {
            // router.push("/signin");
            router.push("/business-details");
          }, 1000);
        }
      } else {
        // Type assertion for the error
        const errorData = (response.error as any)?.data;

        const errorMessage =
          errorData?.message ||
          response.data?.message ||
          "Verification failed. Please try again.";

        toast.error(errorMessage, { id: toastId });
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Verification failed. Please try again.", { id: toastId });
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await resendOtp({
        email: email,
        authType: "createAccount",
      }).unwrap();

      if (response.success) {
        toast.success("OTP resent successfully!", {
          id: toastId,
          description: "Please check your email.",
        });

        // Reset OTP inputs and start countdown
        setOtp(Array(6).fill(""));
        setCountdown(60);
        inputRefs.current[0]?.focus();
      } else {
        toast.error(response.message || "Failed to resend OTP", {
          id: toastId,
        });
      }
    } catch (err: any) {
      console.error("Resend failed:", err);

      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to resend OTP. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  const isComplete = otp.every(Boolean);

  return (
    <div className="flex flex-col justify-center bg-[#F4F7FF] rounded-2xl p-4 md:p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Verification Code
      </h1>
      <p className="text-gray-600 mb-2">We've sent a 6-digit code to</p>
      <p className="text-gray-800 font-semibold mb-6">{email}</p>

      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
            disabled={isVerifying || isResending}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        disabled={!isComplete || isVerifying || isResending}
        className="text-white px-9 py-6 rounded-2xl bg-linear-to-b from-[#0096FF] to-[#006CD8] hover:from-[#006CD8] hover:to-[#0096FF] hover:text-white hover:scale-105 ease-in"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>

      {countdown > 0 ? (
        <p className="text-gray-500">Resend in {countdown}s</p>
      ) : (
        <>
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>

          <Button
            onClick={handleResend}
            disabled={isResending || isVerifying}
            className="p-0 bg-transparent text-primary hover:bg-transparent"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </Button>
        </>
      )}

      <div className="text-start bg-[#EFF6FF] rounded-2xl border border-[#BEDBFF] p-8 text-[#364153] mt-3">
        <p>Security Tips:</p>
        <ul className="text-[#4A5565] text-sm">
          <li>• Code expires in 10 minutes</li>
          <li>• Maximum 5 attempts allowed</li>
          <li>• Check your spam folder if not received</li>
        </ul>
      </div>
    </div>
  );
}
