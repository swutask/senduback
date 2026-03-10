"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetShippingsQuery } from "@/redux/features/shipping/shippingApi";
import Link from "next/link";

interface RecentOrdersProps {
  limit?: number;
}

export default function RecentOrders({ limit = 6 }: RecentOrdersProps) {
  const { data, isLoading, isError } = useGetShippingsQuery({
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

  if (isError || !data?.data?.shippings) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="p-6 text-center text-gray-500">
          Failed to load recent orders
        </div>
      </div>
    );
  }

  const shippings = data.data.shippings;

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paymentPending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            ⚠️ Waiting for label
          </span>
        );
      case "paymentCompleted":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            ✓ Uploaded
          </span>
        );
      case "inTransit":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            🚚 In Transit
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            ✓ Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Pending
          </span>
        );
    }
  };

  // Get item icon
  const getItemIcon = (parcels: any[]) => {
    if (!parcels || parcels.length === 0) return "📦";
    const firstItem = parcels[0];
    const name =
      firstItem.name?.toLowerCase() || firstItem.itemType?.toLowerCase() || "";
    if (name.includes("phone")) return "📱";
    if (name.includes("laptop") || name.includes("macbook")) return "💻";
    if (name.includes("watch")) return "⌚";
    if (name.includes("key")) return "🔑";
    if (name.includes("passport")) return "📕";
    if (name.includes("necklace") || name.includes("jewelry")) return "💍";
    if (name.includes("headphone")) return "🎧";
    if (name.includes("glasses")) return "🕶️";
    if (name.includes("tablet")) return "📱";
    if (name.includes("jacket")) return "🧥";
    return "📦";
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount === 0 || !amount) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  // Get business name from lostItemId
  const getBusinessName = (shipping: any) => {
    if (shipping.lostItemId?.property?.propertyName) {
      return shipping.lostItemId.property.propertyName;
    }
    if (shipping.lostItemId?.user?.businessDetails?.businessName) {
      return shipping.lostItemId.user.businessDetails.businessName;
    }
    return "Business";
  };

  // Get business location
  const getBusinessLocation = (shipping: any) => {
    if (
      shipping.lostItemId?.property?.city &&
      shipping.lostItemId?.property?.country
    ) {
      return `${shipping.lostItemId.property.city}, ${shipping.lostItemId.property.country}`;
    }
    return "Location";
  };

  // Get guest name
  const getGuestName = (shipping: any) => {
    if (shipping.lostItemId?.guestName) return shipping.lostItemId.guestName;
    if (shipping.address_to?.email)
      return shipping.address_to.email.split("@")[0];
    return "Guest";
  };

  // Get guest email
  const getGuestEmail = (shipping: any) => {
    if (shipping.lostItemId?.guestEmail) return shipping.lostItemId.guestEmail;
    if (shipping.address_to?.email) return shipping.address_to.email;
    return "No email";
  };

  return (
    <div className="w-[92vw] md:w-[780px] lg:w-full overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <Link
          href="/dashboard/orders"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto ">
        <Table className="w-full">
          <TableHeader className="h-12 bg-gray-50 border-b border-gray-100">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Item
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Business
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Guest
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount Paid (Breakdown)
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Shipping Label Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {shippings.map((shipping: any) => {
              const shippingId = shipping._id
                .substring(shipping._id.length - 6)
                .toUpperCase();
              const itemIcon = getItemIcon(shipping.parcel);
              const mainItem =
                shipping.parcel?.[0]?.name ||
                shipping.parcel?.[0]?.itemType ||
                "Item";
              const itemCode =
                shipping.lostItemId?._id
                  ?.substring(shipping.lostItemId._id.length - 6)
                  .toUpperCase() || "SH-" + shippingId;

              return (
                <TableRow key={shipping._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      SH-{shippingId}
                    </div>
                    <div className="text-xs text-blue-600">{itemCode}</div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-xl">
                        {itemIcon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {mainItem}
                        </div>
                        <div className="text-xs text-gray-500">
                          {shipping.lostItemId?.itemName || "Shipping Item"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {getBusinessName(shipping)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getBusinessLocation(shipping)}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {getGuestName(shipping)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getGuestEmail(shipping)}
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="text-sm space-y-0.5">
                      <div className="text-gray-600">
                        <span className="text-xs">Shipping:</span>{" "}
                        <span className="font-medium">
                          {formatCurrency(shipping.shipping_cost || 0)}
                        </span>
                      </div>
                      {shipping.insurance?.insuranceCost && (
                        <div className="text-gray-600">
                          <span className="text-xs">Insurance:</span>{" "}
                          <span className="font-medium">
                            {formatCurrency(shipping.insurance.insuranceCost)}
                          </span>
                        </div>
                      )}
                      <div className="text-gray-900 font-semibold">
                        <span className="text-xs">Total:</span>{" "}
                        {formatCurrency(shipping.total_cost || 0)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    {getStatusBadge(shipping.status)}
                    {shipping.carrier && (
                      <div className="text-xs text-gray-500 mt-1">
                        via {shipping.carrier}
                      </div>
                    )}
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
