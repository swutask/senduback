"use client";
import {
  LayoutDashboard,
  Building,
  Search,
  ListOrdered,
  Truck,
  Webhook,
  Settings,
  FileText,
  RefreshCw,
  Star,
  MapPin,
  DollarSign,
  HelpCircle,
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
      title: "Hotels",
      url: "/dashboard/hotels",
      icon: Building,
    },
    {
      title: "Lost Item List",
      url: "/dashboard/lost-items-list",
      icon: Search,
    },
    {
      title: "Orders List",
      url: "/dashboard/orders-list",
      icon: ListOrdered,
    },
    {
      title: "Shipment",
      url: "/dashboard/shipment",
      icon: Truck,
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
      title: "Reviews",
      url: "/dashboard/reviews",
      icon: Star,
    },
    {
      title: "Zones",
      url: "/dashboard/zones",
      icon: MapPin,
    },
    {
      title: "Shipping Pricing",
      url: "/dashboard/shipping-pricing",
      icon: DollarSign,
    },
    // {
    //     title: "FAQ",
    //     url: "/dashboard/faq",
    //     icon: HelpCircle,
    // },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  business: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
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
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
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
