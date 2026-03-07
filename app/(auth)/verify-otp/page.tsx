import { AuthLayout } from "@/components/auth/auth-layout";
import OtpVerify from "@/components/auth/otp-verify-form";
import React from "react";

const page = () => {
  return (
    <AuthLayout>
      <OtpVerify />
    </AuthLayout>
  );
};

export default page;
