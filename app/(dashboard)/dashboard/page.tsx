"use client";

import AdminDash from "@/components/dashboard/dash-home/AdminDash";
import BusinessDash from "@/components/dashboard/dash-home/BusinessDash";
import { UserRole } from "@/config/menuConfig";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

const Page = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null; // or loader

  const role: UserRole = user.role;

  if (role === "admin") {
    return <AdminDash />;
  }

  if (role === "business") {
    return <BusinessDash />;
  }

  return null;
};

export default Page;
