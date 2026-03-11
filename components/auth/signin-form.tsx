// "use client";

// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// type SigninFormValues = {
//   email: string;
//   password: string;
// };

// export default function SigninForm() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<SigninFormValues>();

//   const onSubmit = (data: SigninFormValues) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
//           placeholder="Your password"
//           className="h-11 bg-gray-50 border-gray-200"
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

//       <Link
//         href={"/"}
//         className="flex items-center justify-end text-primary hover:underline"
//       >
//         Forgot Password?
//       </Link>

//       <Button
//         type="submit"
//         className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg"
//       >
//         Sign In
//       </Button>

//       <p className="text-center text-sm text-gray-600">
//         Don’t have an account?{" "}
//         <Link
//           href="/signup"
//           className="text-blue-600 hover:text-blue-700 font-semibold"
//         >
//           Sign Up
//         </Link>
//       </p>
//     </form>
//   );
// }

"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type SigninFormValues = {
  email: string;
  password: string;
};

export default function SigninForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>();

  const onSubmit = async (data: SigninFormValues) => {
    const toastId = toast.loading("Logging in...");

    try {
      const response = await login(data).unwrap();
      console.log(response);

      if (response.success && response.data) {
        const userData = {
          id: response.data.userInfo.id,
          name: response.data.userInfo.name,
          email: response.data.userInfo.email,
          role: response.data.userInfo.role,
          image: response.data.userInfo.image || "",
        };

        const accessToken = response.data.accessToken.replace(/^"|"$/g, "");

        dispatch(
          setUser({
            user: userData,
            accessToken,
          }),
        );

        toast.success("Login successful!", { id: toastId });
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Login failed", { id: toastId });
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.error || "Login failed. Please try again.";

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="Your password"
          className="h-11 bg-gray-50 border-gray-200"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <Link
        href={"/forgot-password"}
        className="flex items-center justify-end text-primary hover:underline"
      >
        Forgot Password?
      </Link>

      <Button
        type="submit"
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link
          href="/signup"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}
