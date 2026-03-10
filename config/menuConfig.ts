"use client";
import {
  Building,
  Building2,
  CreditCard,
  FileText,
  Headset,
  LayoutDashboard,
  ListOrdered,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  Webhook,
} from "lucide-react";
import { useEffect, useState } from "react";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}

export const menuItems: Record<string, MenuItem[]> = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Businesses",
      url: "/dashboard/businesses",
      icon: Building,
    },
    {
      title: "Lost Item List",
      url: "/dashboard/lost-items-list",
      icon: Search,
    },
    {
      title: "Orders List",
      url: "/dashboard/orders",
      icon: ListOrdered,
    },
    {
      title: "Pending Orders",
      url: "/dashboard/pending-orders",
      icon: ShoppingCart,
    },
    {
      title: "Shipment",
      url: "/dashboard/shipment",
      icon: Truck,
    },
    {
      title: "Zones",
      url: "/dashboard/zones",
      icon: Webhook,
    },
    {
      title: "Shipping Pricing",
      url: "/dashboard/shipping-pricing",
      icon: Webhook,
    },
    {
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: Star,
    },

    {
      title: "Terms & conditions",
      url: "/dashboard/terms-conditions",
      icon: FileText,
    },
    {
      title: "Refund policy",
      url: "/dashboard/refund-policy",
      icon: RefreshCw,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],

  business: [
    {
      title: "Lost Items",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Send,
    },
    {
      title: "Collected",
      url: "/dashboard/collected",
      icon: ListOrdered,
    },
    {
      title: "Payment Completed",
      url: "/dashboard/payment-completed",
      icon: CreditCard,
    },
    {
      title: "Delivered",
      url: "/dashboard/delivered",
      icon: Truck,
    },
    {
      title: "Properties",
      url: "/dashboard/properties",
      icon: Building2,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: Headset,
    },
  ],
  user: [],
};

export type UserRole = "admin" | "business" | "user";

export const useUserRole = () => {
  const [role, setRole] = useState<string>("admin");

  useEffect(() => {
    // Load role from localStorage on client side
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const setUserRole = (newRole: string) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  return { role, setUserRole };
};

// Default role fallback
export const getDefaultRole = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userRole") || "admin";
  }
  return "admin";
};
