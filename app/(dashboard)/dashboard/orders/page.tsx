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
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGetShippingsQuery } from "@/redux/features/shipping/shippingApi";
import { useRouter } from "next/navigation";

const BusinessOrdersPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the API to fetch shippings
  const {
    data: shippingData,
    isLoading,
    isError,
  } = useGetShippingsQuery({
    page: currentPage,
    limit: itemsPerPage,
    // status: "shipped",
  });

  console.log(shippingData);

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    if (!amount && amount !== 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get payment status
  const getPaymentStatus = (status: string) => {
    if (!status) return "Pending";
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
    return "Waiting for label";
  };

  // Get price breakdown
  // const getPriceBreakdown = (shipping: any) => {
  //     const shippingCost = shipping.shipping_cost || 0;
  //     const insuranceCost = shipping.insurance?.insuranceCost || 0;
  //     const totalCost = shipping.total_cost || 0;
  //     const serviceCost = totalCost - shippingCost - insuranceCost;

  //     let breakdown = `Service: ${formatCurrency(serviceCost)}\nShipping: ${formatCurrency(shippingCost)}`;
  //     if (insuranceCost > 0) {
  //         breakdown += `\nInsurance: ${formatCurrency(insuranceCost)}`;
  //     }
  //     return breakdown;
  // };

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadLabelFetch = async (
    shippingLabel: string,
    shipmentId: string,
  ) => {
    setDownloadingId(shipmentId);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
      const labelUrl = `${baseUrl}${shippingLabel}`;

      const response = await fetch(labelUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      const filename =
        shippingLabel.split("/").pop() || `shipping-label-${Date.now()}.png`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading label:", error);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
      window.open(`${baseUrl}${shippingLabel}`, "_blank");
    } finally {
      setDownloadingId(null);
    }
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
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Orders List
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  See all guest orders linked to your lost items.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Loading orders...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Orders List
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  See all guest orders linked to your lost items.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Error loading orders. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Orders Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Orders List
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                See all guest orders linked to your lost items.
              </p>
            </div>
          </div>
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
                  {/* <TableHead className="text-sm font-bold text-gray-600 py-3">Price breakdown</TableHead> */}
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Actions
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippings.map((shipping: any, index: number) => (
                  <TableRow
                    key={shipping._id}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="text-sm text-gray-900 py-3">
                      {(startIndex + index + 1).toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipping.address_from?.name || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {formatDate(shipping.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {getPaymentStatus(shipping.status)}
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
                    {/* <TableCell className="text-sm text-gray-900 py-3 whitespace-pre-line">{getPriceBreakdown(shipping)}</TableCell> */}
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipping.shippingLabel && (
                        <button
                          className="text-[#0096FF] underline"
                          onClick={() =>
                            shipping.shippingLabel &&
                            handleDownloadLabelFetch(
                              shipping.shippingLabel,
                              shipping._id,
                            )
                          }
                          disabled={
                            !shipping.shippingLabel ||
                            downloadingId === shipping._id
                          }
                        >
                          {downloadingId === shipping._id
                            ? "Downloading..."
                            : shipping.shippingLabel
                              ? "Download label"
                              : "No label"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/orders/${shipping._id}`)
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalItems > 0 ? (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              No orders found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessOrdersPage;
