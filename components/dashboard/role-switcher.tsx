"use client";
import { useUserRole } from "@/config/menuConfig";
import { useState } from "react";

export function RoleSwitcher() {
  const { role, setUserRole } = useUserRole();
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleRole = () => {
    const newRole = role === "admin" ? "business" : "admin";
    setUserRole(newRole);
    // Reload the page after a short delay to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleRole}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-transparent hover:bg-black/10 text-gray-600 hover:text-gray-800 rounded-full p-3 transition-all duration-200 border border-gray-300/50 shadow-sm hover:shadow-md backdrop-blur-sm"
        title={`Switch to ${role === "admin" ? "Business" : "Admin"} role`}
      >
        <div className="flex items-center justify-center w-6 h-6">
          <span className="text-sm font-bold">
            {role === "admin" ? "A" : "B"}
          </span>
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap">
          Switch to {role === "admin" ? "Business" : "Admin"}
        </div>
      )}
    </div>
  );
}
