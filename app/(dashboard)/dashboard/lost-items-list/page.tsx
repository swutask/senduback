"use client";

import AdminLostItemList from "@/components/dashboard/lost-items-list/AdminLostItemList";
import BusinessLostItemList from "@/components/dashboard/lost-items-list/BusinessLostItemList";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import type { UserRole } from "@/config/menuConfig";

const Page = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  const role: UserRole = user.role;

  if (role === "admin") {
    return <AdminLostItemList />;
  }

  if (role === "business") {
    return <BusinessLostItemList />;
  }

  // Optional: fallback
  return null;
};

export default Page;
