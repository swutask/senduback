import { AuthLayout } from "@/components/auth/auth-layout";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import React from "react";

export default function page() {
  return (
    <div>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  );
}
