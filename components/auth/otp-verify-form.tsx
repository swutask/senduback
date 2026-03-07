// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";

// export default function OtpVerify() {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(60);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   // ⭐ ADDED PASTE HANDLER (NO CHANGES TO YOUR EXISTING CODE)
//   const handlePaste = (index: number, e: React.ClipboardEvent) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
//     if (!pasted) return;

//     const newOtp = [...otp];
//     pasted
//       .slice(0, 6 - index)
//       .split("")
//       .forEach((v, i) => (newOtp[index + i] = v));

//     setOtp(newOtp);

//     const nextIndex = Math.min(index + pasted.length, 5);
//     inputRefs.current[nextIndex]?.focus();
//   };

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     if (value.length > 1) {
//       value
//         .slice(0, 6 - index)
//         .split("")
//         .forEach((v, i) => (newOtp[index + i] = v));
//       setOtp(newOtp);
//       inputRefs.current[Math.min(index + value.length, 5)]?.focus();
//       return;
//     }

//     newOtp[index] = value;
//     setOtp(newOtp);
//     if (value && index < 5) inputRefs.current[index + 1]?.focus();
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     setIsLoading(true);
//     await new Promise((r) => setTimeout(r, 2000));
//     console.log("Verifying OTP:", otp.join(""));
//     setIsLoading(false);
//   };

//   const handleResend = () => {
//     setOtp(Array(6).fill(""));
//     setCountdown(60);
//     inputRefs.current[0]?.focus();
//     console.log("Resending OTP...");
//   };

//   const isComplete = otp.every(Boolean);

//   return (
//     <div className="w-full text-center">
//       <h1 className="text-2xl font-bold text-gray-900 mb-2">
//         Please check your email
//       </h1>
//       <p className="text-gray-600 mb-6">
//         A 6-digit code has been sent to your email
//       </p>

//       <div className="flex justify-center gap-3 mb-6">
//         {otp.map((digit, i) => (
//           <Input
//             key={i}
//             ref={(el) => {
//               inputRefs.current[i] = el;
//             }}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             value={digit}
//             onChange={(e) => handleChange(i, e.target.value)}
//             onKeyDown={(e) => handleKeyDown(i, e)}
//             onPaste={(e) => handlePaste(i, e)} // ⭐ ADDED (NO CHANGES TO YOUR CODE)
//             className="w-12 h-12 text-center text-xl font-semibold  border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary"
//           />
//         ))}
//       </div>

//       <Button
//         onClick={handleVerify}
//         disabled={!isComplete || isLoading}
//         className="w-full bg-secondary text-xl text-white mt-6 py-5 duration-300 rounded-lg font-medium mb-4"
//       >
//         {isLoading ? "Verifying..." : "Verify OTP"}
//       </Button>

//       {countdown > 0 ? (
//         <p className="text-gray-500">Resend in {countdown}s</p>
//       ) : (
//         <>
//           <p className="text-gray-600 mb-2">Don’t receive any code</p>
//           <Button
//             onClick={handleResend}
//             className="bg-transparent text-green-900 hover:bg-transparent hover:border font-medium"
//           >
//             Resend Code
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  useVerifyAccountMutation,
  useResendOtpMutation,
} from "@/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyAccount, { isLoading: isVerifying }] =
    useVerifyAccountMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (!email) {
      toast.error("No email provided");
      router.push("/register");
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

      if (response.data?.success) {
        toast.success("Account verified successfully!", {
          id: toastId,
          description: "Your account is now active.",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1000);
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
    <div className="w-full text-center p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Please check your email
      </h1>
      <p className="text-gray-600 mb-2">A 6-digit code has been sent to:</p>
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
          <p className="text-gray-600 mb-2">Didn't receive any code?</p>
          <Button
            onClick={handleResend}
            disabled={isResending || isVerifying}
            className="bg-transparent text-primary hover:bg-transparent hover:border font-medium"
          >
            {isResending ? "Resending..." : "Resend Code"}
          </Button>
        </>
      )}
    </div>
  );
}
