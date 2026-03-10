"use client";

import { ChevronDown, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetLostItemsQuery } from "@/redux/features/lostItem/lostitemApi";

interface RecentLostItemProps {
  limit?: number;
}

export default function RecentLostItem({ limit = 6 }: RecentLostItemProps) {
  const { data, isLoading, isError } = useGetLostItemsQuery({
    page: 1,
    limit: limit,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="p-6 py-4 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="p-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.lostItems) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Lost Items</h2>
          <Link
            href="/dashboard/lost-items-list"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="p-6 text-center text-gray-500">
          Failed to load recent lost items
        </div>
      </div>
    );
  }

  const lostItems = data.data.lostItems;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Format date to match "Jan 13, 2024" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get status color class - matches LostItemsList's getStatusColor
  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-yellow-100 text-yellow-700";
      case "withCourier":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "collected":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Get status text based on status - matches LostItemsList mock data
  const getStatusText = (status: string) => {
    switch (status) {
      case "registered":
        return "Awaiting Guest Payment";
      case "withCourier":
        return "In Shipment";
      case "delivered":
        return "Delivered";
      case "collected":
        return "Collected";
      default:
        return "Awaiting Guest Payment";
    }
  };

  // Get item icon based on item name
  const getItemIcon = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (
      name.includes("phone") ||
      name.includes("iphone") ||
      name.includes("smartphone")
    )
      return "📱";
    if (name.includes("laptop") || name.includes("macbook")) return "💻";
    if (name.includes("watch") || name.includes("apple watch")) return "⌚";
    if (name.includes("key") || name.includes("keys")) return "🔑";
    if (name.includes("passport") || name.includes("document")) return "📕";
    if (name.includes("necklace") || name.includes("jewelry")) return "💍";
    if (name.includes("headphone")) return "🎧";
    if (name.includes("glasses")) return "🕶️";
    if (name.includes("jacket")) return "🧥";
    if (name.includes("scarf")) return "🧣";
    if (name.includes("bag") || name.includes("purse")) return "👜";
    return "📦";
  };

  // Get category name based on item name
  const getCategoryName = (itemName: string) => {
    const name = itemName.toLowerCase();
    if (
      name.includes("phone") ||
      name.includes("iphone") ||
      name.includes("smartphone")
    )
      return "Electronics";
    if (name.includes("laptop") || name.includes("macbook"))
      return "Electronics";
    if (name.includes("watch") || name.includes("apple watch"))
      return "Electronics";
    if (name.includes("key") || name.includes("keys")) return "Keys";
    if (name.includes("passport") || name.includes("document"))
      return "Documents";
    if (name.includes("necklace") || name.includes("jewelry")) return "Jewelry";
    if (name.includes("headphone")) return "Electronics";
    if (name.includes("glasses")) return "Accessories";
    if (
      name.includes("jacket") ||
      name.includes("scarf") ||
      name.includes("bag") ||
      name.includes("purse")
    )
      return "Accessories";
    return "General";
  };

  return (
    <div className="w-[92vw] md:w-[780px] lg:w-full overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header - matches LostItemsList */}
      <div className="p-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Lost Items</h2>
        <Link
          href="/dashboard/lost-items-list"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="h-12 bg-gray-50 border-b border-gray-100">
            <TableRow>
              {[
                "Item",
                "Business",
                "Found Location",
                "Found Date",
                "Category",
                "Guest",
                "Status",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {lostItems.map((item: any) => {
              const statusText = getStatusText(item.status);
              const statusColor = getStatusColor(item.status);
              const itemIcon = getItemIcon(item.itemName);
              const categoryName = getCategoryName(item.itemName);
              const itemId =
                "IHL_" + item._id.substring(item._id.length - 4).toUpperCase();

              return (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                        {item.images && item.images.length > 0 ? (
                          <Image
                            src={`${baseUrl}${item.images[0]}`}
                            alt={item.itemName}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          itemIcon
                        )}
                      </div>
                      <div>
                        {/* <div className="font-medium text-gray-900">{item.itemName}</div> */}
                        <div className="font-medium text-gray-900 group relative">
                          <span className="truncate max-w-[120px] inline-block">
                            {item.itemName}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            {item.itemName}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 group relative">
                          <span className="truncate text-xs text-gray-500 max-w-[60px] inline-block">
                            {item._id}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            {item._id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.property?.propertyName || "N/A"}
                    </div>
                    {/* <div className="text-xs text-gray-500">📍 {item.property?.city && item.property?.country ? `${item.property.city}, ${item.property.country}` : "Location not specified"}</div> */}
                    <div className="text-xs text-gray-500 group relative">
                      <span className="truncate max-w-[120px] inline-block">
                        📍{" "}
                        {item.property?.city && item.property?.country
                          ? `${item.property.city}, ${item.property.country}`
                          : "Location not specified"}
                      </span>
                      <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                        📍{" "}
                        {item.property?.city && item.property?.country
                          ? `${item.property.city}, ${item.property.country}`
                          : "Location not specified"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.locationFound || "Not specified"}
                    </div>
                    {/* <div className="text-xs text-gray-500">📍 {item.property?.propertyName ? item.property.propertyName.substring(0, 15) + "..." : "N/A"}</div> */}
                    <div className="text-xs text-gray-500 group relative">
                      <span className="truncate max-w-[120px] inline-block">
                        📍{" "}
                        {item.property?.propertyName
                          ? item.property.propertyName.substring(0, 15) + "..."
                          : "N/A"}
                      </span>
                      <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                        📍 {item.property?.propertyName || "N/A"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(item.dateFound)}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getItemIcon(item.itemName)}
                      </span>
                      <span className="text-sm text-gray-900">
                        {categoryName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {item.guestName || "N/A"}
                    </div>
                    {/* <div className="text-xs text-gray-500">📧 {item.guestEmail || "No email"}</div> */}
                    <div className="text-xs text-gray-500 group relative">
                      <span className="truncate max-w-[120px] inline-block">
                        📧 {item.guestEmail || "No email"}
                      </span>
                      <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                        📧 {item.guestEmail || "No email"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
