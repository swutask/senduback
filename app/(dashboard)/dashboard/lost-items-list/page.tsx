"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ItemDetailsModal from "@/lib/modal/item-details-modal";
import {
  useGetLostItemsQuery,
  LOST_ITEM_STATUS,
  useGetAllBusinessUsersQuery,
  useMarkAsCollectedMutation,
  useSendLostItemEmailMutation,
} from "@/redux/features/lostItem/lostitemApi";
import { Calendar, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "registered":
      return "bg-yellow-100 text-yellow-700";
    case "linkSended":
      return "bg-blue-100 text-blue-700";
    case "paymentCompleted":
      return "bg-purple-100 text-purple-700";
    case "withCourier":
      return "bg-orange-100 text-orange-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "collected":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Helper function to format status text
const formatStatusText = (status: LOST_ITEM_STATUS | "All") => {
  switch (status) {
    case LOST_ITEM_STATUS.REGISTERED:
      return "Registered";
    case LOST_ITEM_STATUS.LINKSENDED:
      return "Link Sent";
    case LOST_ITEM_STATUS.PAYMENTCOMPLETED:
      return "Payment Completed";
    case LOST_ITEM_STATUS.WITHCOURIER:
      return "With Courier";
    case LOST_ITEM_STATUS.DELIVERED:
      return "Delivered";
    case LOST_ITEM_STATUS.COLLECTED:
      return "Collected";
    case "All":
      return "All Status";
    default:
      return status;
  }
};

// Helper function to get category icon
const getCategoryIcon = (itemName: string) => {
  const lowerName = itemName.toLowerCase();
  if (
    lowerName.includes("phone") ||
    lowerName.includes("watch") ||
    lowerName.includes("macbook") ||
    lowerName.includes("laptop") ||
    lowerName.includes("airpod")
  )
    return "📱";
  if (lowerName.includes("key")) return "🔑";
  if (lowerName.includes("passport") || lowerName.includes("document"))
    return "📄";
  if (
    lowerName.includes("necklace") ||
    lowerName.includes("ring") ||
    lowerName.includes("jewelry")
  )
    return "💍";
  if (
    lowerName.includes("bag") ||
    lowerName.includes("wallet") ||
    lowerName.includes("purse")
  )
    return "👜";
  if (
    lowerName.includes("scarf") ||
    lowerName.includes("clothing") ||
    lowerName.includes("jacket")
  )
    return "👕";
  return "📦";
};

export default function LostItemsList() {
  const router = useRouter();
  const pathName = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LOST_ITEM_STATUS | "All">(
    "All",
  );
  const [businessFilter, setBusinessFilter] = useState<string>("All");
  const [showDateRange, setShowDateRange] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [businessSearch, setBusinessSearch] = useState("");
  const businessSearchInputRef = useRef<HTMLInputElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all business users with search - fixed debounce
  const { data: businessUsersData, isLoading: isLoadingBusinesses } =
    useGetAllBusinessUsersQuery({
      searchTerm: businessSearch.trim() || undefined,
    });
  const businessUsers = businessUsersData?.data || [];

  // Fetch lost items with ALL filters
  const { data, isLoading, isError, refetch } = useGetLostItemsQuery({
    page: currentPage,
    limit: rowsPerPage,
    status: statusFilter !== "All" ? statusFilter : undefined,
    user: businessFilter !== "All" ? businessFilter : undefined,
    from: customDateRange.from || undefined,
    to: customDateRange.to || undefined,
    searchTerm: searchTerm.trim() || undefined,
  });

  console.log(data);

  const lostItems = data?.data?.lostItems || [];
  const [markAsCollected, { isLoading: isMarkingCollected }] =
    useMarkAsCollectedMutation();
  const [sendLostItemEmail, { isLoading: isSendingEmail }] =
    useSendLostItemEmailMutation();
  const meta = data?.data?.meta || {
    total: 0,
    limit: rowsPerPage,
    page: currentPage,
    totalPage: 1,
  };

  // Handle view item details
  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  // Handle mark as collected
  const handleMarkAsCollected = async (itemId: string) => {
    try {
      const result = await markAsCollected(itemId).unwrap();
      console.log(result);
      // Refetch the lost items to update the list
      refetch();
    } catch (error) {
      console.error("Failed to mark as collected:", error);
      // You might want to show an error toast here
    }
  };

  // Handle resend link
  const handleResendLink = async (itemId: string) => {
    try {
      await sendLostItemEmail({ id: itemId }).unwrap();
      // You might want to show a success toast here
      console.log(`Link resent successfully for item ${itemId}`);
    } catch (error) {
      console.error("Failed to resend link:", error);
      // You might want to show an error toast here
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("All");
    setBusinessFilter("All");
    setCustomDateRange({ from: "", to: "" });
    setSearchTerm("");
    setBusinessSearch("");
    setShowDateRange(false);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get all status options
  const allStatuses: LOST_ITEM_STATUS[] = [
    LOST_ITEM_STATUS.REGISTERED,
    LOST_ITEM_STATUS.LINKSENDED,
    LOST_ITEM_STATUS.PAYMENTCOMPLETED,
    LOST_ITEM_STATUS.WITHCOURIER,
    LOST_ITEM_STATUS.DELIVERED,
    LOST_ITEM_STATUS.COLLECTED,
  ];

  // Handle date range apply
  const handleDateRangeApply = () => {
    if (customDateRange.from && customDateRange.to) {
      setCurrentPage(1);
    }
  };

  // Handle business search - focus on input when dropdown opens
  const handleBusinessDropdownOpen = (open: boolean) => {
    if (open && businessSearchInputRef.current) {
      setTimeout(() => {
        businessSearchInputRef.current?.focus();
      }, 100);
    }
  };

  // If loading
  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading lost items...</div>
      </div>
    );
  }

  // If error
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading lost items. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="w-[92vw] md:w-[770px] lg:w-full mx-auto lg:mx-0">
      {pathName === "/dashboard/lost-items-list" && (
        <div className="">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  Lost Items
                </h1>
                <p className="text-sm text-gray-600">
                  Total {meta.total} items • Page {currentPage} of{" "}
                  {meta.totalPage}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by item name, item ID, guest name, or business..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                      📊 {formatStatusText(statusFilter)}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter("All");
                        setCurrentPage(1);
                      }}
                    >
                      All Status
                    </DropdownMenuItem>
                    {allStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setCurrentPage(1);
                        }}
                      >
                        {formatStatusText(status)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Business Filter with Search */}
                <DropdownMenu onOpenChange={handleBusinessDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                      🏢{" "}
                      {businessFilter === "All"
                        ? "All Businesses"
                        : businessUsers.find(
                            (b: any) => b._id === businessFilter,
                          )?.businessName || "Select Business"}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="start">
                    {/* Search input for businesses */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={businessSearchInputRef}
                          type="text"
                          placeholder="Search businesses..."
                          value={businessSearch}
                          onChange={(e) => setBusinessSearch(e.target.value)}
                          className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onKeyDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                      <DropdownMenuItem
                        onClick={() => {
                          setBusinessFilter("All");
                          setBusinessSearch("");
                          setCurrentPage(1);
                        }}
                      >
                        All Businesses
                      </DropdownMenuItem>
                      {businessUsers.map((business: any) => (
                        <DropdownMenuItem
                          key={business._id}
                          onClick={() => {
                            setBusinessFilter(business._id);
                            setBusinessSearch("");
                            setCurrentPage(1);
                          }}
                        >
                          {business.businessName}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date Range Filter - Simple dropdown with date inputs */}
                <DropdownMenu
                  open={showDateRange}
                  onOpenChange={setShowDateRange}
                >
                  <DropdownMenuTrigger asChild>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                      📅{" "}
                      {customDateRange.from && customDateRange.to
                        ? `${customDateRange.from} to ${customDateRange.to}`
                        : "Date range"}
                      <Calendar className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-4" align="start">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From
                        </label>
                        <input
                          type="date"
                          value={customDateRange.from}
                          onChange={(e) =>
                            setCustomDateRange({
                              ...customDateRange,
                              from: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To
                        </label>
                        <input
                          type="date"
                          value={customDateRange.to}
                          onChange={(e) =>
                            setCustomDateRange({
                              ...customDateRange,
                              to: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            handleDateRangeApply();
                            setShowDateRange(false);
                          }}
                          disabled={
                            !customDateRange.from || !customDateRange.to
                          }
                        >
                          Apply
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setCustomDateRange({ from: "", to: "" });
                            setCurrentPage(1);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {pathName !== "/dashboard/lost-items-list" && (
          <div className="p-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Lost Items</h2>
            <Link
              href="/dashboard/lost-items-list"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </Link>
          </div>
        )}

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
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {lostItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-3 py-8 text-center text-gray-500"
                  >
                    No lost items found.{" "}
                    {searchTerm ||
                    statusFilter !== "All" ||
                    businessFilter !== "All" ||
                    customDateRange.from
                      ? "Try different filters."
                      : ""}
                  </TableCell>
                </TableRow>
              ) : (
                lostItems.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-gray-50">
                    <TableCell className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                          {getCategoryIcon(item.itemName)}
                        </div>

                        <div>
                          <div className="font-medium text-gray-900 group/item-name relative">
                            <span className="truncate max-w-[120px] inline-block">
                              {item.itemName}
                            </span>
                            <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/item-name:opacity-100 group-hover/item-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                              {item.itemName}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 group/item-id relative mt-1">
                            <span className="truncate max-w-[60px] inline-block">
                              🆔 {item._id.substring(0, 8)}...
                            </span>
                            <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/item-id:opacity-100 group-hover/item-id:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                              🆔 {item._id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <div className="text-sm text-gray-900">
                        {item.property?.propertyName || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 group/location relative">
                        <span className="truncate max-w-[100px] inline-block">
                          📍 {item.property?.city}, {item.property?.country}
                        </span>
                        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/location:opacity-100 group-hover/location:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                          📍 {item.property?.city}, {item.property?.country}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <div className="text-sm text-gray-900">
                        {item.locationFound}
                      </div>
                      {/* <div className="text-xs text-gray-500">📍 {item.property?.addressLine1 || "Unknown address"}</div> */}
                      <div className="text-xs text-gray-500 group/address relative mt-1">
                        <span className="truncate max-w-[120px] inline-block">
                          📍 {item.property?.addressLine1 || "Unknown address"}
                        </span>
                        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/address:opacity-100 group-hover/address:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                          📍 {item.property?.addressLine1 || "Unknown address"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-3 py-4 text-sm text-gray-900">
                      {formatDate(item.dateFound)}
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getCategoryIcon(item.itemName)}
                        </span>
                        <span className="text-sm text-gray-900">
                          {getCategoryIcon(item.itemName) === "📱"
                            ? "Electronics"
                            : getCategoryIcon(item.itemName) === "🔑"
                              ? "Keys"
                              : getCategoryIcon(item.itemName) === "📄"
                                ? "Documents"
                                : getCategoryIcon(item.itemName) === "💍"
                                  ? "Jewelry"
                                  : getCategoryIcon(item.itemName) === "👜"
                                    ? "Bags"
                                    : getCategoryIcon(item.itemName) === "👕"
                                      ? "Clothing"
                                      : "Other"}
                        </span>
                      </div>
                    </TableCell>

                    {/* <TableCell className="px-3 py-4">
                                            <div className="text-sm text-gray-900">{item.guestName || "Guest"}</div>
                                            <div className="text-xs text-gray-500">📧 {item.guestEmail}</div>
                                            {item.guestPhone && <div className="text-xs text-gray-500">📞 {item.guestPhone}</div>}
                                        </TableCell> */}
                    <TableCell className="px-3 py-4">
                      <div className="text-sm text-gray-900 group/guest-name relative">
                        <span className="truncate max-w-[100px] inline-block">
                          {item.guestName || "Guest"}
                        </span>
                        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/guest-name:opacity-100 group-hover/guest-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                          {item.guestName || "Guest"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 group/guest-email relative mt-1">
                        <span className="truncate max-w-[120px] inline-block">
                          📧 {item.guestEmail}
                        </span>
                        <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/guest-email:opacity-100 group-hover/guest-email:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                          📧 {item.guestEmail}
                        </div>
                      </div>
                      {item.guestPhone && (
                        <div className="text-xs text-gray-500 group/guest-phone relative mt-1">
                          <span className="truncate max-w-[120px] inline-block">
                            📞 {item.guestPhone}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/guest-phone:opacity-100 group-hover/guest-phone:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            📞 {item.guestPhone}
                          </div>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {formatStatusText(item.status as LOST_ITEM_STATUS)}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleViewItem(item._id)}
                        >
                          View
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => handleViewItem(item._id)}
                            >
                              👁️ View item details
                            </DropdownMenuItem>
                            {item.status === LOST_ITEM_STATUS.LINKSENDED && (
                              <DropdownMenuItem
                                onClick={() => handleMarkAsCollected(item._id)}
                              >
                                ✅ Mark as Collected
                              </DropdownMenuItem>
                            )}
                            {item.status === LOST_ITEM_STATUS.REGISTERED && (
                              <DropdownMenuItem
                                onClick={() => handleResendLink(item._id)}
                              >
                                📧 Resend guest link
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <ItemDetailsModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItemId(null);
          }}
          itemId={selectedItemId}
        />

        {/* Pagination */}
        {pathName === "/dashboard/lost-items-list" && (
          <div className="px-3 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page</span>
              <Select
                value={String(rowsPerPage)}
                onValueChange={(v) => {
                  setRowsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600 ml-4">
                Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
                {Math.min(currentPage * rowsPerPage, meta.total)} of{" "}
                {meta.total} items
              </span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &lt; Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {meta.totalPage || 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= (meta.totalPage || 1)}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next &gt;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
