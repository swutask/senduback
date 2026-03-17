"use client";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetLostItemsByUserQuery } from "@/redux/features/lostItem/lostitemApi";
import { ItemDetailBusinessModal } from "./ItemDetailBusinessModal";

interface BusinessItemsViewProps {
  businessId: string;
  onClose: () => void;
}

export function BusinessItemsView({
  businessId,
  onClose,
}: BusinessItemsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const limit = 10;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: response, isLoading } = useGetLostItemsByUserQuery({
    user: businessId,
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
  });

  console.log("Lost Items Response", response);

  // Extract data from API response
  const lostItems = response?.data?.lostItems || [];
  const meta = response?.data?.meta || { total: 0, page: 1, totalPage: 1 };

  // Get first item's property for header display
  const firstItem = lostItems[0];
  const propertyName =
    firstItem?.property?.propertyName ||
    firstItem?.user?.businessDetails?.businessName ||
    "Business";
  const propertyLocation =
    firstItem?.property?.city && firstItem?.property?.country
      ? `${firstItem.property.city}, ${firstItem.property.country}`
      : firstItem?.user?.businessDetails?.city &&
          firstItem?.user?.businessDetails?.country
        ? `${firstItem.user.businessDetails.city}, ${firstItem.user.businessDetails.country}`
        : "Location";

  // Calculate stats
  const totalItems = meta.total;
  const linkSendedCount = lostItems.filter(
    (item: any) => item.status === "linkSended",
  ).length;
  const paymentCompletedCount = lostItems.filter(
    (item: any) => item.currentState?.paymentCompleted,
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-gray-100 text-gray-700";
      case "linkSended":
        return "bg-yellow-100 text-yellow-700";
      case "paymentCompleted":
        return "bg-blue-100 text-blue-700";
      case "withCourier":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "collected":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryIcon = (itemName: string) => {
    const name = itemName?.toLowerCase() || "";
    if (name.includes("key")) return "🔑";
    if (
      name.includes("watch") ||
      name.includes("phone") ||
      name.includes("laptop")
    )
      return "📱";
    if (name.includes("passport") || name.includes("document")) return "📄";
    if (name.includes("jacket") || name.includes("cloth")) return "👕";
    if (name.includes("bag") || name.includes("luggage")) return "🎒";
    if (name.includes("wallet") || name.includes("purse")) return "👛";
    return "📦";
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        className="min-w-8/12 p-0 bg-white rounded-xl overflow-hidden"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col max-h-[90vh] overflow-x-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Items from {propertyName}
                </h2>
                <p className="text-sm text-gray-600">
                  Location: {propertyLocation}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 mt-3">
              <Stat label="Total Items" value={totalItems} />
              <Stat
                label="Link Sent"
                value={linkSendedCount}
                color="text-orange-600"
              />
              <Stat
                label="Payment Completed"
                value={paymentCompletedCount}
                color="text-green-600"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            {/* 👇 ADDED THIS WRAPPER ONLY */}
            <div className="w-full overflow-x-auto md:overflow-x-auto lg:overflow-x-hidden">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                  <tr>
                    <Th>Item</Th>
                    <Th>Found Location</Th>
                    <Th>Found Date</Th>
                    <Th>Category</Th>
                    <Th>Guest</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Loading items...
                      </td>
                    </tr>
                  ) : lostItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No items found matching your search"
                          : "No items available"}
                      </td>
                    </tr>
                  ) : (
                    lostItems.map((item: any, index: number) => (
                      <tr key={item._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl overflow-hidden">
                              {item.images && item.images.length > 0 ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.itemName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>{getCategoryIcon(item.itemName)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {item.itemName}
                              </div>
                              <div className="text-xs text-gray-500">
                                🆔 {item._id?.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <Td>{item.locationFound || "N/A"}</Td>
                        <Td>
                          {item.dateFound ? formatDate(item.dateFound) : "N/A"}
                        </Td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getCategoryIcon(item.itemName)}
                            </span>
                            <span className="text-sm text-gray-900">
                              {item.property?.propertyType || "General"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {item.guestName || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.guestEmail || "N/A"}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer with Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing{" "}
                {lostItems.length > 0 ? (currentPage - 1) * limit + 1 : 0} to{" "}
                {Math.min(currentPage * limit, meta.total)} of {meta.total}{" "}
                items
              </div>

              {meta.totalPage > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, meta.totalPage) },
                      (_, i) => {
                        let pageNum;
                        if (meta.totalPage <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= meta.totalPage - 2) {
                          pageNum = meta.totalPage - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="h-8 w-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.totalPage}
                    className="h-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {selectedItem && (
        <ItemDetailBusinessModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </Dialog>
  );
}

/* ---------- helpers ---------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 text-sm text-gray-900">{children}</td>;
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="text-sm">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-semibold ml-1 ${color ?? "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}
