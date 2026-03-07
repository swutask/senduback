"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  useGetShippingsQuery,
  useCreateShippingInfoMutation,
} from "@/redux/features/shipping/shippingApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(
    null,
  );
  const [trackingId, setTrackingId] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [carrier, setCarrier] = useState("");
  const [shippingLabelFile, setShippingLabelFile] = useState<File | null>(null);

  // Use the API to fetch shippings with status filter
  const {
    data: shippingData,
    isLoading,
    isError,
    refetch,
  } = useGetShippingsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Create shipping info mutation
  const [createShippingInfo, { isLoading: isUploading }] =
    useCreateShippingInfoMutation();

  // Extract data from API response
  const shippings = shippingData?.data?.shippings || [];
  const meta = shippingData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency?: string) => {
    const currencyCode = currency || "USD";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
      }).format(amount);
    } catch (error) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    }
  };

  // Get price breakdown
  const getPriceBreakdown = (shipping: any) => {
    const shippingCost = shipping.shipping_cost || 0;
    const insuranceCost = shipping.insurance?.insuranceCost || 0;
    const totalCost = shipping.total_cost || 0;
    const serviceCost = totalCost - shippingCost - insuranceCost;

    return `Service: ${formatCurrency(serviceCost)}\nShipping: ${formatCurrency(shippingCost)}\n${insuranceCost > 0 ? `Insurance: ${formatCurrency(insuranceCost)}` : ""}`;
  };

  // Get payment status
  const getPaymentStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "paymentcompleted":
        return "Paid";
      case "shipped":
        return "Shipped";
      case "rateselected":
        return "Awaiting payment";
      case "created":
        return "Pending";
      default:
        return status;
    }
  };

  // Get shipping label status
  const getShippingLabelStatus = (shipping: any) => {
    if (shipping.shippingLabel) return "Label generated";
    if (shipping.status === "created" || shipping.status === "rateSelected")
      return "Pending";
    return "Waiting For Label";
  };

  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setShippingLabelFile(e.target.files[0]);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setShippingLabelFile(null);
  };

  // Submit shipping info
  const handleSubmitShippingInfo = async () => {
    if (
      !selectedShippingId ||
      !trackingId ||
      !trackingUrl ||
      !carrier ||
      !shippingLabelFile
    ) {
      toast.error("Please fill all fields and upload a shipping label");
      return;
    }

    const toastId = toast.loading("Uploading shipping info...");

    try {
      const trackingData = {
        tracking_id: trackingId,
        tracking_url: trackingUrl,
        carrier: carrier,
      };

      await createShippingInfo({
        id: selectedShippingId,
        trackingData,
        shippingLabel: shippingLabelFile,
      }).unwrap();

      // Reset form
      setTrackingId("");
      setTrackingUrl("");
      setCarrier("");
      setShippingLabelFile(null);
      setSelectedShippingId(null);
      setDialogOpen(false);

      // Refetch shipping data
      refetch();

      toast.success("Shipping info uploaded successfully!", {
        id: toastId,
      });
    } catch (error: any) {
      console.error("Error uploading shipping info:", error);
      let errorMessage = "Failed to upload shipping info";

      if (error.response?.data?.errorMessages?.length > 0) {
        errorMessage =
          error.response.data.errorMessages[0].message || errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message?.includes("Valid tracking URL is required")) {
        errorMessage = "Valid tracking URL is required";
      }

      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  // Open modal for specific shipping
  const openModalForShipping = (shippingId: string) => {
    setSelectedShippingId(shippingId);
    setTrackingId("");
    setTrackingUrl("");
    setCarrier("");
    setShippingLabelFile(null);
    setDialogOpen(true);
  };

  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Orders</h1>
          <p className="text-[#7C8493] text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Orders</h1>
          <p className="text-[#7C8493] text-lg">Error loading orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Orders</h1>
        <p className="text-[#7C8493] text-lg">
          Manage all customer orders and shipments.
        </p>
      </div>

      {/* Orders Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Orders List
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {statusFilter !== "all"
                  ? `Filtered by status: ${getPaymentStatus(statusFilter)} - `
                  : ""}
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </p>
            </div>

            {/* Filter Section moved to the right side */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="created">Pending</SelectItem>
                    <SelectItem value="paymentCompleted">Paid</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="rateSelected">
                      Awaiting Payment
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {statusFilter !== "all" && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Filter className="h-3 w-3 mr-1" />
                Status: {getPaymentStatus(statusFilter)}
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Order ID
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Guest
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Created On
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Payment Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Shipping Label
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Courier
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Price breakdown
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Total Amount
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      {statusFilter !== "all"
                        ? `No orders found with status: ${getPaymentStatus(statusFilter)}`
                        : "No orders found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  shippings.map((shipping: any) => (
                    <TableRow
                      key={shipping._id}
                      className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <TableCell className="text-sm text-gray-900 py-3 font-medium">
                        {shipping._id.slice(-8)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {shipping.address_from.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {formatDate(shipping.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${shipping.status === "paymentCompleted" ? "bg-green-100 text-green-800" : shipping.status === "shipped" ? "bg-blue-100 text-blue-800" : shipping.status === "rateSelected" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                        >
                          {getPaymentStatus(shipping.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getShippingLabelStatus(shipping) === "Label generated" ? "bg-green-100 text-green-800" : getShippingLabelStatus(shipping) === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {getShippingLabelStatus(shipping)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {shipping.carrier || "N/A"}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3 whitespace-pre-line">
                        {getPriceBreakdown(shipping)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3 font-semibold">
                        {formatCurrency(shipping.total_cost)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/dashboard/orders-list/${shipping._id}`,
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModalForShipping(shipping._id)}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-[#3A3A3A] hover:bg-gray-100"}`}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Page Numbers with Ellipsis */}
                {pageNumbers.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-[#3A3A3A]"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={`h-11 w-11 rounded-full ${currentPage === page ? "bg-[#0096FF] text-white" : "text-[#3A3A3A] border-0"}`}
                      onClick={() => handlePageClick(page as number)}
                    >
                      {page}
                    </Button>
                  ),
                )}

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-[#3A3A3A] hover:bg-gray-100"}`}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SINGLE Dialog outside the table - moved here */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Shipping Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId">Tracking ID *</Label>
              <Input
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingUrl">Tracking URL *</Label>
              <Input
                id="trackingUrl"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="Enter tracking URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier *</Label>
              <Input
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Enter carrier name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingLabel">Shipping Label *</Label>
              {shippingLabelFile ? (
                <div className="flex items-center justify-between border p-2 rounded">
                  <span className="text-sm truncate">
                    {shippingLabelFile.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Input
                  id="shippingLabel"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              )}
              <p className="text-xs text-gray-500">
                Upload shipping label (image or PDF)
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedShippingId(null);
                setTrackingId("");
                setTrackingUrl("");
                setCarrier("");
                setShippingLabelFile(null);
                setDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitShippingInfo}
              disabled={
                isUploading ||
                !trackingId ||
                !trackingUrl ||
                !carrier ||
                !shippingLabelFile
              }
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
