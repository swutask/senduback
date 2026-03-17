import { useGetAdminStatisticsQuery } from "@/redux/features/admin/adminApi";
import { Building2, Package, ShoppingCart, Truck } from "lucide-react";
import React from "react";

export default function Summerycard() {
  const {
    data: adminStatistics,
    isLoading,
    isError,
  } = useGetAdminStatisticsQuery({});

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-4 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Failed to load statistics</p>
        </div>
      </div>
    );
  }

  // Access the data from the response
  const statistics = adminStatistics?.data || {};

  const summaryCards = [
    {
      id: "businesses",
      title: "Total Businesses",
      value: statistics?.totalBusiness || 0,
      icon: Building2,
      color: "bg-blue-500",
      page: "businesses",
    },
    {
      id: "items",
      title: "Total Lost Items",
      value: statistics?.totalLostItems || 0,
      icon: Package,
      color: "bg-purple-500",
      page: "lost-items",
    },
    {
      id: "orders",
      title: "Orders Today",
      value: statistics?.todayOrders || 0,
      icon: ShoppingCart,
      color: "bg-orange-500",
      page: "orders",
    },
    {
      id: "shipments",
      title: "Shipments in Progress",
      value: statistics?.shipmentInProgress || 0,
      icon: Truck,
      color: "bg-green-500",
      page: "shipments",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            // onClick={() => onNavigate(card.page)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {card.value}
            </div>
            <div className="text-sm text-gray-600">{card.title}</div>
          </button>
        );
      })}
    </div>
  );
}
