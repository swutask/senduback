import { AuthLayout } from "@/components/auth/auth-layout";
import ResetPasswordForm from "@/components/auth/reset-password-form";
import React from "react";

export default function page() {
  return (
    <div>
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </div>
  );
}
