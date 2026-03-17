"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { useGetAllBusinessUsersQuery } from "@/redux/features/lostItem/lostitemApi";
import {
  useCreateShippingInfoMutation,
  useGetShippingsQuery,
  useMarkAsDeliveredMutation,
} from "@/redux/features/shipping/shippingApi";
import { Calendar, ChevronDown, Download, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Helper function to get item image based on item type
const getItemImage = (itemType: string) => {
  switch (itemType.toLowerCase()) {
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
    default:
      return "📦";
  }
};

// Helper function to get shipment status display text
const getShipmentStatus = (status: string, currentState: any) => {
  if (status === "delivered" || currentState?.delivered) return "Delivered";
  if (status === "inTransit" || currentState?.courierBooked)
    return "In Transit";
  return status;
};

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [shipmentStatusFilter, setShipmentStatusFilter] =
    useState<string>("All");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [businessSearch, setBusinessSearch] = useState("");
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showDateRange, setShowDateRange] = useState(false);
  const [markAsDelivered, { isLoading: isMarkingDelivered }] =
    useMarkAsDeliveredMutation();

  // Replace the single modal states with TWO sets:
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);

  // For Label modal only:
  const [shippingLabelFile, setShippingLabelFile] = useState<File | null>(null);
  const [isUploadingLabel, setIsUploadingLabel] = useState(false);

  // For Tracking modal only:
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  const [createShippingInfo] = useCreateShippingInfoMutation();

  // Shipment status options - Only "In Transit" and "Delivered"
  const shipmentStatusOptions = ["All", "In Transit", "Delivered"];

  // Fetch business users data
  const { data: businessUsersData } = useGetAllBusinessUsersQuery({
    searchTerm: businessSearch.trim() || undefined,
  });
  const businessUsers = businessUsersData?.data || [];

  // Build query params - ALWAYS send "inTransit,delivered" as default
  const buildQueryParams = () => {
    const params: any = {
      page: currentPage,
      limit: rowsPerPage,
    };

    // Add search term - Check what parameter name your API expects
    if (searchTerm) {
      // Try different parameter names based on your API
      // Common ones are: search, searchTerm, q
      params.searchTerm = searchTerm; // or params.search = searchTerm;
    }

    // ALWAYS filter by "inTransit,delivered" - this page only shows these statuses
    let statusFilter = ["inTransit", "delivered"];

    // If user selects specific filter from dropdown
    if (shipmentStatusFilter === "In Transit") {
      statusFilter = ["inTransit"];
    } else if (shipmentStatusFilter === "Delivered") {
      statusFilter = ["delivered"];
    }
    // If "All", keep both ["inTransit", "delivered"]

    params.status = statusFilter;

    // Add business filter - send business email
    if (businessFilter !== "all") {
      // Find the selected business user
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

    // console.log("API Params:", params);

    return params;
  };

  const { data: shipmentsData, isLoading } =
    useGetShippingsQuery(buildQueryParams());

  const shipments = shipmentsData?.data?.shippings || [];
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
    setShipmentStatusFilter("All");
    setBusinessFilter("all");
    setDateRange({ from: "", to: "" });
    setSearchTerm("");
    setCurrentPage(1);
    setBusinessSearch("");
  };

  // Get selected business name
  const getSelectedBusinessName = () => {
    if (businessFilter === "all") return "Business";
    const selectedBusiness = businessUsers.find(
      (business: any) => business._id === businessFilter,
    );
    return selectedBusiness?.businessName || "Business";
  };

  const handleMarkAsDelivered = async (shipmentId: string) => {
    try {
      await markAsDelivered(shipmentId).unwrap();
      // Optional: Show success toast/notification
      // toast.success("Shipment marked as delivered successfully!");
    } catch (error) {
      console.error("Failed to mark as delivered:", error);
      // Optional: Show error toast/notification
      // toast.error("Failed to mark shipment as delivered");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShippingLabelFile(e.target.files[0]);
    }
  };

  // Label modal handlers
  const handleOpenLabelModal = (shipment: any) => {
    setSelectedShipment(shipment);
    setShippingLabelFile(null);
    setShowLabelModal(true);
  };

  const handleUpdateLabelOnly = async () => {
    if (!selectedShipment || !shippingLabelFile) return;

    try {
      setIsUploadingLabel(true);

      // Send only label file with existing tracking data
      const trackingData = {
        tracking_id: selectedShipment.tracking_id || "",
        tracking_url: selectedShipment.tracking_url || "",
        carrier: selectedShipment.carrier || "",
      };

      await createShippingInfo({
        id: selectedShipment._id,
        trackingData,
        shippingLabel: shippingLabelFile,
      }).unwrap();

      setShowLabelModal(false);
      toast.success("Shipping label updated successfully!");
    } catch (error) {
      console.error("Failed to update label:", error);
      toast.error("Failed to update shipping label");
    } finally {
      setIsUploadingLabel(false);
    }
  };

  // Tracking modal handlers
  const handleOpenTrackingModal = (shipment: any) => {
    setSelectedShipment(shipment);
    setTrackingId(shipment.tracking_id || "");
    setTrackingUrl(shipment.tracking_url || "");
    setCarrier(shipment.carrier || "");
    setShowTrackingModal(true);
  };

  // const handleUpdateTrackingOnly = async () => {
  //     if (!selectedShipment) return;

  //     try {
  //         setIsUpdatingTracking(true);

  //         const trackingData = {
  //             tracking_id: trackingId,
  //             tracking_url: trackingUrl,
  //             carrier: carrier,
  //         };

  //         const dummyFile = new File([""], "dummy.txt", { type: "text/plain" });

  //         await createShippingInfo({
  //             id: selectedShipment._id,
  //             trackingData,
  //             shippingLabel: dummyFile,
  //         }).unwrap();

  //         setShowTrackingModal(false);
  //         alert("Tracking details updated successfully!");
  //     } catch (error) {
  //         console.error("Failed to update tracking:", error);
  //         alert("Failed to update tracking details");
  //     } finally {
  //         setIsUpdatingTracking(false);
  //     }
  // };

  const handleUpdateTrackingOnly = async () => {
    if (!selectedShipment) return;

    try {
      setIsUpdatingTracking(true);

      const trackingData = {
        tracking_id: trackingId,
        tracking_url: trackingUrl,
        carrier: carrier,
      };

      let shippingLabelFile: File;

      // Check if there's an existing shipping label
      if (selectedShipment.shippingLabel) {
        try {
          // Download the existing label
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASEURL}${selectedShipment.shippingLabel}`,
          );
          if (!response.ok)
            throw new Error("Failed to download existing label");

          const blob = await response.blob();
          const filename =
            selectedShipment.shippingLabel.split("/").pop() ||
            "shipping-label.png";
          shippingLabelFile = new File([blob], filename, { type: blob.type });
        } catch (error) {
          console.error("Failed to download existing label:", error);
          // Fallback to minimal PNG
          const minimalPNG =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
          const response = await fetch(minimalPNG);
          const blob = await response.blob();
          shippingLabelFile = new File([blob], "shipping-label.png", {
            type: "image/png",
          });
        }
      } else {
        // Create a minimal 1x1 pixel PNG
        const minimalPNG =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
        const response = await fetch(minimalPNG);
        const blob = await response.blob();
        shippingLabelFile = new File([blob], "shipping-label.png", {
          type: "image/png",
        });
      }

      await createShippingInfo({
        id: selectedShipment._id,
        trackingData,
        shippingLabel: shippingLabelFile,
      }).unwrap();

      setShowTrackingModal(false);
      toast.success("Tracking details updated successfully!");
    } catch (error) {
      console.error("Failed to update tracking:", error);
      toast.error("Failed to update tracking details");
    } finally {
      setIsUpdatingTracking(false);
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
                <span className="text-blue-600">🚚</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Shipments
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              All active shipments in progress
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by order ID, item name, business, guest, or tracking ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Shipment Status Filter - Only In Transit and Delivered */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                📊 {shipmentStatusFilter} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {shipmentStatusOptions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => {
                    setShipmentStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={
                    shipmentStatusFilter === status ? "bg-blue-50" : ""
                  }
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Range Filter */}
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

          {/* Business Filter */}
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
      </div>

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
                <TableHead>Courier</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Shipment Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading shipments...
                  </TableCell>
                </TableRow>
              ) : shipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                shipments.map((shipment: any) => {
                  const item = shipment.parcel?.[0];
                  const lostItem = shipment.lostItemId;
                  const business = lostItem?.user;

                  return (
                    <TableRow key={shipment._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900 group/order-id relative">
                          <span className="truncate max-w-[120px] inline-block">
                            #{shipment._id.slice(-6)}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/order-id:opacity-100 group-hover/order-id:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            #{shipment._id}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {getItemImage(item?.itemType || "default")}
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
                            <div className="text-xs text-gray-500 group/item-id relative mt-1">
                              <span className="truncate max-w-[120px] inline-block">
                                🆔 {shipment._id.slice(-8)}
                              </span>
                              <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/item-id:opacity-100 group-hover/item-id:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                                🆔 {shipment._id}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {/* <div>{business?.businessDetails?.businessName || business?.firstName + " " + business?.lastName}</div> */}
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
                        <div className="text-xs text-gray-500 group/location relative mt-1">
                          <span className="truncate max-w-[120px] inline-block">
                            📍 {shipment.address_from?.city},{" "}
                            {shipment.address_from?.countryName}
                          </span>
                          <div className="absolute bottom-full left-0 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover/location:opacity-100 group-hover/location:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                            📍 {shipment.address_from?.city},{" "}
                            {shipment.address_from?.countryName}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          {lostItem?.guestName || shipment.address_to?.name}
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

                      <TableCell>
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white ${shipment.carrier === "DHL" ? "bg-yellow-500" : shipment.carrier === "UPS" ? "bg-yellow-700" : shipment.carrier === "FedEx" ? "bg-purple-600" : shipment.carrier === "Redker" ? "bg-red-600" : shipment.carrier === "YODEL" ? "bg-purple-800" : "bg-blue-600"}`}
                        >
                          {shipment.carrier || "Not Assigned"}
                        </span>
                      </TableCell>

                      <TableCell>
                        {shipment.tracking_url ? (
                          <a
                            href={shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {shipment.tracking_id || "No Tracking"}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">
                            No Tracking
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${shipment.status === "delivered" || shipment.currentState?.delivered ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {getShipmentStatus(
                            shipment.status,
                            shipment.currentState,
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          {/* <Button size="sm" onClick={() => setSelectedItem(shipment)}>
                                                        View
                                                    </Button> */}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64">
                              {/* {shipment.shippingLabel && (
                                                                <DropdownMenuItem>
                                                               
                                                                    <Link href={`${process.env.NEXT_PUBLIC_BASEURL}${shipment.shippingLabel}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                                        <Download className="w-4 h-4 mr-2" />
                                                                        Download shipping label
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )} */}
                              {shipment.shippingLabel && (
                                <DropdownMenuItem>
                                  <button
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
                                        a.download = "shipping-label.png"; // or .jpg
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                      } catch (error) {
                                        console.error(
                                          "Download failed:",
                                          error,
                                        );
                                      }
                                    }}
                                    className="flex items-center"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download shipping label
                                  </button>
                                </DropdownMenuItem>
                              )}

                              {/* REPLACE THESE TWO LINES */}
                              <DropdownMenuItem
                                onClick={() => handleOpenLabelModal(shipment)}
                                className="flex items-center gap-2"
                              >
                                🔄 Replace shipping label
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenTrackingModal(shipment)
                                }
                                className="flex items-center gap-2"
                              >
                                📝 Update tracking details
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem>🔄 Replace shipping label</DropdownMenuItem>
                                                            <DropdownMenuItem>📝 Update tracking details</DropdownMenuItem> */}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleMarkAsDelivered(shipment._id)
                                }
                                disabled={
                                  shipment.status === "delivered" ||
                                  shipment.currentState?.delivered ||
                                  isMarkingDelivered
                                }
                                className="flex items-center gap-2"
                              >
                                {isMarkingDelivered ? (
                                  <>
                                    <span className="animate-spin">⏳</span>
                                    Marking...
                                  </>
                                ) : (
                                  <>✅ Mark as Delivered</>
                                )}
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem>📧 Resend tracking email to guest</DropdownMenuItem> */}
                              {/* <DropdownMenuItem>🔔 Notify business</DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              {Math.min(currentPage * rowsPerPage, meta.total)} of {meta.total}{" "}
              items
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
      </div>

      {/* Label Only Modal */}
      {showLabelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Replace Shipping Label
            </h3>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf"
              className="mb-4"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowLabelModal(false)}
                disabled={isUploadingLabel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateLabelOnly}
                disabled={isUploadingLabel || !shippingLabelFile}
              >
                {isUploadingLabel ? "Uploading..." : "Upload Label"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Only Modal */}
      {showTrackingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Update Tracking Details
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracking ID *
                </label>
                <Input
                  placeholder="TRK123456789"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tracking URL
                </label>
                <Input
                  placeholder="https://tracking.dhl.com/TRK123456789"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Carrier *
                </label>
                <Input
                  placeholder="DHL, UPS, FedEx"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTrackingModal(false)}
                disabled={isUpdatingTracking}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateTrackingOnly}
                disabled={isUpdatingTracking || !trackingId || !carrier}
              >
                {isUpdatingTracking ? "Updating..." : "Update Tracking"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* {selectedItem && <ItemDetailBusinessModal item={selectedItem} onClose={() => setSelectedItem(null)} />} */}
    </div>
  );
}
