"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import ShippingDetailsModal from "@/lib/modal/shipping-details-modal";
import { useGetAllBusinessUsersQuery } from "@/redux/features/lostItem/lostitemApi";
import {
  useCreateShippingInfoMutation,
  useGetShippingsQuery,
} from "@/redux/features/shipping/shippingApi";
import { Search, Upload, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Helper function to get item image based on item type
const getItemImage = (itemType: string) => {
  switch (itemType?.toLowerCase()) {
    case "laptop":
      return "💻";
    case "smartphone":
      return "📱";
    case "keys":
      return "🔑";
    case "watch":
      return "⌚";
    case "passport":
      return "📕";
    case "wallet":
      return "👛";
    case "jewelry":
      return "📿";
    case "scarf":
      return "🧣";
    case "jacket":
      return "🧥";
    case "headphone":
      return "🎧";
    case "sunglasses":
      return "🕶️";
    case "tablet":
      return "📱";
    default:
      return "📦";
  }
};

// Helper to get label status
const getLabelStatus = (shipment: any) => {
  if (shipment.shippingLabel) return "Uploaded";
  return "Waiting for label";
};

export default function PendingOrdersPage() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [businessSearch, setBusinessSearch] = useState("");

  // Add these states at the top with other states
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [selectedShipmentForLabel, setSelectedShipmentForLabel] =
    useState<any>(null);
  const [shippingLabelFile, setShippingLabelFile] = useState<File | null>(null);
  const [isUploadingLabel, setIsUploadingLabel] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");

  const [createShippingInfo] = useCreateShippingInfoMutation();

  // Fetch business users data
  const { data: businessUsersData } = useGetAllBusinessUsersQuery({
    searchTerm: businessSearch.trim() || undefined,
  });
  const businessUsers = businessUsersData?.data || [];

  // Build query params - ONLY show paymentPending status
  const buildQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: rowsPerPage,
      status: ["paymentPending"],
    };

    // Add search term
    if (searchTerm) {
      params.searchTerm = searchTerm;
    }

    // Add business filter - send business email
    if (businessFilter !== "all") {
      const selectedBusiness = businessUsers.find(
        (business: any) => business._id === businessFilter,
      );
      if (selectedBusiness?.email) {
        params.fromEmail = selectedBusiness.email;
      }
    }

    // Add date range filter
    if (dateRange.from && dateRange.to) {
      params.from = dateRange.from;
      params.to = dateRange.to;
    }

    return params;
  };

  const { data: shipmentsData, isLoading } =
    useGetShippingsQuery(buildQueryParams());

  const shipments = shipmentsData?.data?.shippings || [];

  console.log("pending order", shipments);

  const meta = shipmentsData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const handleDateRangeApply = () => {
    if (dateRange.from && dateRange.to) {
      setCurrentPage(1);
    }
  };

  const clearFilters = () => {
    setBusinessFilter("all");
    setDateRange({ from: "", to: "" });
    setSearchTerm("");
    setCurrentPage(1);
    setBusinessSearch("");
  };

  // Get selected business name
  // const getSelectedBusinessName = () => {
  //   if (businessFilter === "all") return "Business";
  //   const selectedBusiness = businessUsers.find(
  //     (business: any) => business._id === businessFilter,
  //   );
  //   return selectedBusiness?.businessName || "Business";
  // };

  // const handleOpenLabelModal = (shipment: any) => {
  //   setSelectedShipmentForLabel(shipment);
  //   setShippingLabelFile(null);
  //   setTrackingId(shipment.tracking_id || "");
  //   setTrackingUrl(shipment.tracking_url || "");
  //   setCarrier(shipment.carrier || "");
  //   setShowLabelModal(true);
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShippingLabelFile(e.target.files[0]);
    }
  };

  const handleUploadLabel = async () => {
    if (!selectedShipmentForLabel || !shippingLabelFile) return;

    try {
      setIsUploadingLabel(true);

      // Create tracking data with user inputs
      const trackingData = {
        tracking_id: trackingId || "",
        tracking_url: trackingUrl || "",
        carrier: carrier || "",
      };

      await createShippingInfo({
        id: selectedShipmentForLabel._id,
        trackingData,
        shippingLabel: shippingLabelFile,
      }).unwrap();

      setShowLabelModal(false);
      setSelectedShipmentForLabel(null);
      setShippingLabelFile(null);
      setTrackingId("");
      setTrackingUrl("");
      setCarrier("");

      toast.success(
        "Shipping label and tracking details uploaded successfully!",
      );
    } catch (error) {
      console.error("Failed to upload label:", error);
      toast.error("Failed to upload shipping label");
    } finally {
      setIsUploadingLabel(false);
    }
  };

  return (
    <div className="w-[92vw] md:w-[770px] lg:w-full mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600">⏳</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Pending Orders
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              All orders awaiting payment completion
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by order ID, item name, business, or guest..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Filters  */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu open={showDateRange} onOpenChange={setShowDateRange}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                📅{" "}
                {dateRange.from && dateRange.to
                  ? `${dateRange.from} to ${dateRange.to}`
                  : "Date Range"}
                <Calendar className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-4" align="start">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
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
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
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
                    disabled={!dateRange.from || !dateRange.to}
                  >
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDateRange({ from: "", to: "" });
                      setCurrentPage(1);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={showBusinessDropdown}
            onOpenChange={setShowBusinessDropdown}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                🏢 {getSelectedBusinessName()}{" "}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <div className="p-2">
                <Input
                  placeholder="Search business..."
                  value={businessSearch}
                  onChange={(e) => setBusinessSearch(e.target.value)}
                  className="mb-2"
                  onFocus={(e) => e.stopPropagation()}
                />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuItem
                    onClick={() => {
                      setBusinessFilter("all");
                      setBusinessSearch("");
                      setCurrentPage(1);
                      setShowBusinessDropdown(false);
                    }}
                    className={businessFilter === "all" ? "bg-blue-50" : ""}
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
                        setShowBusinessDropdown(false);
                      }}
                      className={
                        businessFilter === business._id ? "bg-blue-50" : ""
                      }
                    >
                      {business.businessName}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-auto"
          >
            Clear Filters
          </button>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Amount Paid (Breakdown)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment: any) => {
                  const item = shipment.parcel?.[0];
                  const lostItem = shipment.lostItemId;

                  // Calculate amounts
                  const shippingCost = shipment.shipping_cost || 0;
                  const insuranceCost = shipment.insurance?.insuranceCost || 0;
                  const totalCost =
                    shipment.total_cost || shippingCost + insuranceCost;

                  return (
                    <TableRow key={shipment._id} className="hover:bg-gray-50">
                      {/* Order ID */}
                      <TableCell>
                        <div className="font-medium text-gray-900 group/order-id relative">
                          <span className="truncate max-w-[120px] inline-block">
                            #{shipment._id.slice(-6)}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/order-id:opacity-100 group-hover/order-id:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            #{shipment._id}
                          </div>
                        </div>
                        <div className="text-xs text-blue-600">
                          #{shipment._id.slice(-6)}
                        </div>
                      </TableCell>

                      {/* Item */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {getItemImage(
                              item?.itemType || item?.name || "default",
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group/item-name relative">
                              <span className="truncate max-w-[120px] inline-block">
                                {item?.name || lostItem?.itemName}
                              </span>
                              <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/item-name:opacity-100 group-hover/item-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                                {item?.name || lostItem?.itemName}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              🆔 {shipment._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Business */}
                      <TableCell>
                        {/* <div className="font-medium text-gray-900 group/business-name relative">
                          <span className="truncate max-w-[120px] inline-block">
                            {business?.businessDetails?.businessName ||
                              business?.firstName + " " + business?.lastName ||
                              shipment.address_from?.email}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/business-name:opacity-100 group-hover/business-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            {business?.businessDetails?.businessName ||
                              business?.firstName + " " + business?.lastName ||
                              shipment.address_from?.email}
                          </div>
                        </div> */}
                        <div className="font-medium text-gray-900 group/business-name relative">
                          <span className="truncate max-w-[120px] inline-block">
                            {shipment.address_from?.hotelName ||
                              shipment.address_from?.name ||
                              shipment.address_from?.email}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/business-name:opacity-100 group-hover/business-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            {shipment.address_from?.hotelName ||
                              shipment.address_from?.name ||
                              shipment.address_from?.email}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          📍 {shipment.address_from?.city},{" "}
                          {shipment.address_from?.countryName}
                        </div>
                      </TableCell>

                      {/* Guest */}
                      <TableCell>
                        <div className="font-medium text-gray-900 group/guest-name relative">
                          <span className="truncate max-w-[120px] inline-block">
                            {lostItem?.guestName || shipment.address_to?.name}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/guest-name:opacity-100 group-hover/guest-name:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            {lostItem?.guestName || shipment.address_to?.name}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 group/guest-email relative mt-1">
                          <span className="truncate max-w-[120px] inline-block">
                            📧{" "}
                            {lostItem?.guestEmail || shipment.address_to?.email}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/guest-email:opacity-100 group-hover/guest-email:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            📧{" "}
                            {lostItem?.guestEmail || shipment.address_to?.email}
                          </div>
                        </div>
                      </TableCell>

                      {/* Amount Paid */}
                      <TableCell>
                        <div className="text-sm space-y-0.5">
                          <div className="text-gray-600">
                            <span className="text-xs">Shipping:</span>{" "}
                            <span className="font-medium">
                              ${shippingCost.toFixed(2)}
                            </span>
                          </div>
                          {insuranceCost > 0 && (
                            <div className="text-gray-600">
                              <span className="text-xs">Insurance:</span>{" "}
                              <span className="font-medium">
                                ${insuranceCost.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="text-gray-900 font-semibold">
                            <span className="text-xs">Total:</span> $
                            {totalCost.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>

                      {/* Shipping Label Status
                                            <TableCell>{getLabelStatus(shipment) === "Uploaded" ? <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">✓ Uploaded</span> : <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">⚠️ Waiting for label</span>}</TableCell> */}
                      <TableCell>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                          {shipment.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedItem(shipment)}
                          >
                            View
                          </Button>

                          {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                              <DropdownMenuItem
                                onClick={() => handleOpenLabelModal(shipment)}
                                className="gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Upload / Replace shipping label
                              </DropdownMenuItem>

                              {shipment.shippingLabel && (
                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(
                                        `${process.env.NEXT_PUBLIC_BASEURL}${shipment.shippingLabel}`,
                                      );
                                      const blob = await response.blob();
                                      const url =
                                        window.URL.createObjectURL(blob);
                                      const a = document.createElement("a");
                                      a.href = url;
                                      a.download = "shipping-label.png";
                                      a.click();
                                      window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                      console.error("Download failed:", error);
                                    }
                                  }}
                                  className="gap-2"
                                >
                                  <Download className="w-4 h-4" />
                                  Download label
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem className="gap-2">
                                <Mail className="w-4 h-4" />
                                Resend order confirmation / tracking email
                              </DropdownMenuItem>

                              <DropdownMenuItem className="gap-2">
                                <ArrowRight className="w-4 h-4" />
                                Move to Shipments
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {meta.total > 0 && pathname !== "/dashboard" && (
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-3">
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

            <div className="flex items-center gap-4">
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

      {showLabelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Shipping Details</h3>
              <button
                onClick={() => setShowLabelModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={isUploadingLabel}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Carrier */}
              <div className="space-y-2">
                <Label htmlFor="carrier">Courier / Carrier *</Label>
                <Input
                  id="carrier"
                  placeholder="DHL, UPS, FedEx"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  disabled={isUploadingLabel}
                />
              </div>

              {/* Tracking ID */}
              <div className="space-y-2">
                <Label htmlFor="trackingId">Tracking ID</Label>
                <Input
                  id="trackingId"
                  placeholder="TRK123456789"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  disabled={isUploadingLabel}
                />
              </div>

              {/* Tracking URL */}
              <div className="space-y-2">
                <Label htmlFor="trackingUrl">Tracking URL</Label>
                <Input
                  id="trackingUrl"
                  placeholder="https://tracking.dhl.com/TRK123456789"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  disabled={isUploadingLabel}
                />
              </div>

              {/* Shipping Label Upload */}
              <div className="space-y-2">
                <Label htmlFor="shippingLabel">Shipping Label *</Label>
                <Input
                  id="shippingLabel"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf"
                  disabled={isUploadingLabel}
                />
                {shippingLabelFile && (
                  <p className="text-sm text-green-600">
                    ✓ Selected: {shippingLabelFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLabelModal(false);
                  setShippingLabelFile(null);
                }}
                disabled={isUploadingLabel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadLabel}
                disabled={isUploadingLabel || !shippingLabelFile}
                className="gap-2"
              >
                {isUploadingLabel ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Update
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping Detail Modal */}
      {selectedItem && (
        <ShippingDetailsModal
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          itemId={selectedItem?._id}
        />
      )}
    </div>
  );
}
