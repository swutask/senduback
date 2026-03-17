"use client";

import AdminDash from "@/components/v2dashboard/dash-home/AdminDash";
import { LostItemsPage } from "@/components/v2dashboard/lost-items/lost-items";
import { UserRole } from "@/config/menuConfig";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";

const Page = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  const role: UserRole = user.role;

  if (role === "admin") {
    return <AdminDash />;
  }

  if (role === "business") {
    return <LostItemsPage />;
  }

  return null;
};

export default Page;
