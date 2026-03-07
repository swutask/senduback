"use client";

import AdminSettings from "@/components/dashboard/settings/AdminSettings";
import BusinessSettings from "@/components/dashboard/settings/BusinessSettings";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import type { UserRole } from "@/config/menuConfig";

const Page = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null; // or loader

  const role: UserRole = user.role;

  if (role === "admin") {
    return <AdminSettings />;
  }

  if (role === "business") {
    return <BusinessSettings />;
  }

  return null;
};

export default Page;
