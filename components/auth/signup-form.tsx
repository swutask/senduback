// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";

// type SignupFormValues = {
//   businessName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// };

// export function SignupForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SignupFormValues>();

//   const onSubmit = (data: SignupFormValues) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
//       {/* Business Name */}
//       <div>
//         <label className="text-sm font-semibold">Business Name *</label>
//         <Input
//           placeholder="Your Business Name"
//           className="h-11 bg-gray-50 border-gray-200"
//           {...register("businessName", {
//             required: "Business name is required",
//           })}
//         />
//         {errors.businessName && (
//           <p className="text-sm text-red-500 mt-1">
//             {errors.businessName.message}
//           </p>
//         )}
//       </div>

//       {/* Email */}
//       <div>
//         <label className="text-sm font-semibold">Email Address *</label>
//         <Input
//           type="email"
//           placeholder="you@example.com"
//           className="h-11 bg-gray-50 border-gray-200"
//           {...register("email", {
//             required: "Email is required",
//           })}
//         />
//         {errors.email && (
//           <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
//         )}
//       </div>

//       {/* Password */}
//       <div>
//         <label className="text-sm font-semibold">Password *</label>
//         <Input
//           type="password"
//           placeholder="Minimum 8 characters"
//           className="h-11 bg-gray-50 border-gray-200 "
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 8,
//               message: "Password must be at least 8 characters",
//             },
//           })}
//         />
//         {errors.password && (
//           <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
//         )}
//       </div>

//       {/* Confirm Password */}
//       <div>
//         <label className="text-sm font-semibold">Confirm Password *</label>
//         <Input
//           type="password"
//           placeholder="Re-enter your password"
//           className="h-11 bg-gray-50 border-gray-200 "
//           {...register("confirmPassword", {
//             required: "Please confirm your password",
//           })}
//         />
//         {errors.confirmPassword && (
//           <p className="text-sm text-red-500 mt-1">
//             {errors.confirmPassword.message}
//           </p>
//         )}
//       </div>

//       <Button
//         type="submit"
//         className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg mt-4"
//       >
//         Sign Up
//       </Button>

//       <p className="text-center text-sm text-gray-600">
//         Already have an account?{" "}
//         <Link
//           href="/signin"
//           className="text-blue-600 hover:text-blue-700 font-semibold"
//         >
//           Sign In
//         </Link>
//       </p>
//     </form>
//   );
// }

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSignupMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";

type SignupFormValues = {
  businessName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm() {
  const router = useRouter();
  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const onSubmit = async (data: SignupFormValues) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    const toastId = toast.loading("Creating your account...");

    try {
      const payload = {
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        firstName: "", // You may want to collect this from the user
        lastName: "", // You may want to collect this from the user
        role: "business", // Or another appropriate default/role
      };

      const response = await signup(payload).unwrap();

      if (response.success) {
        toast.success("Account created successfully!", {
          id: toastId,
          description: "Please verify your email with OTP.",
        });

        // Redirect to OTP verification page
        setTimeout(() => {
          const encodedEmail = encodeURIComponent(data.email);
          router.push(`/verify-otp?email=${encodedEmail}`);
        }, 1000);
      } else {
        toast.error(response.message || "Signup failed", { id: toastId });
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.error ||
        err?.error ||
        "Signup failed. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Business Name */}
      <div>
        <label className="text-sm font-semibold">Business Name *</label>
        <Input
          placeholder="Your Business Name"
          className="h-11 bg-gray-50 border-gray-200"
          disabled={isLoading}
          {...register("businessName", {
            required: "Business name is required",
          })}
        />
        {errors.businessName && (
          <p className="text-sm text-red-500 mt-1">
            {errors.businessName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-semibold">Email Address *</label>
        <Input
          type="email"
          placeholder="you@example.com"
          className="h-11 bg-gray-50 border-gray-200"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-semibold">Password *</label>
        <Input
          type="password"
          placeholder="Minimum 8 characters"
          className="h-11 bg-gray-50 border-gray-200 "
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-semibold">Confirm Password *</label>
        <Input
          type="password"
          placeholder="Re-enter your password"
          className="h-11 bg-gray-50 border-gray-200 "
          disabled={isLoading}
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
