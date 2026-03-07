"use client";
import React, { useEffect, useState } from "react";
import AccountTab from "./AccountTab";
import BusinessSettingsContent from "./BusinessItems";
import { useSearchParams } from "next/navigation";

const BusinessSettings = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "business") {
      setActiveTab("business");
    }
  }, [searchParams]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-6">
        <h1 className="text-3xl font-bold text-[#25324B]">Settings</h1>
        <div className="flex gap-2 bg-[#F8F9FA] rounded-lg p-1">
          <button
            onClick={() => setActiveTab("account")}
            style={{
              backgroundColor:
                activeTab === "account" ? "#B0DEFF" : "transparent",
              color: activeTab === "account" ? "#0096FF" : "#000000",
            }}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all hover:text-[#B0DEFF]"
          >
            Account setting
          </button>
          <button
            onClick={() => setActiveTab("business")}
            style={{
              backgroundColor:
                activeTab === "business" ? "#B0DEFF" : "transparent",
              color: activeTab === "business" ? "#0096FF" : "#000000",
            }}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all hover:text-[#B0DEFF]"
          >
            Business settings
          </button>
        </div>
      </div>

      <div>
        {activeTab === "account" && <AccountTab />}
        {activeTab === "business" && <BusinessSettingsContent />}
      </div>
    </div>
  );
};

export default BusinessSettings;
