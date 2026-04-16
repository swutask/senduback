"use client";

import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import AdminSettings from "@/components/dashboard/settings/AdminSettings";
import BusinessSettings from "@/components/dashboard/settings/BusinessSettings";

export default function SettingsPage() {
  const user = useAppSelector(selectCurrentUser);

  // Show loading or nothing while user data loads
  if (!user) {
    return (
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {user.role === "admin" ? (
        <AdminSettings />
      ) : user.role === "business" ? (
        <BusinessSettings />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No settings available for your role.</p>
        </div>
      )}
    </>
  );
}
