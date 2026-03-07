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
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGetShippingsQuery } from "@/redux/features/shipping/shippingApi";
import { useRouter } from "next/navigation";

const ShipmentsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the API to fetch shipped shipments
  const {
    data: shippingData,
    isLoading,
    isError,
  } = useGetShippingsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: "shipped", // Filter by shipped status
  });

  // Extract data from API response
  const shipments = shippingData?.data?.shippings || [];
  const meta = shippingData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  const handleDownloadLabelFetch = async (shippingLabel: string) => {
    if (shippingLabel) {
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

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading label:", error);
        // Fallback to direct download
        const baseUrl =
          process.env.NEXT_PUBLIC_BASEURL || "http://10.10.7.26:5001";
        window.open(`${baseUrl}${shippingLabel}`, "_blank");
      }
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
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Shipments</h1>
          <p className="text-[#7C8493] text-lg">Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Shipments</h1>
          <p className="text-[#7C8493] text-lg">Error loading shipments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section - EXACT SAME as your demo */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Shipments</h1>
        <p className="text-[#7C8493] text-lg">
          Manage all shipment tracking and status.
        </p>
      </div>

      {/* Shipments Table Section - EXACT SAME design */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Shipment Tracking
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            All shipment details and tracking information.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Order ID
                  </TableHead>
                  {/* <TableHead className="text-sm font-bold text-gray-600 py-3">Shipment ID</TableHead> */}
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Guest
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Hotel/Business
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Courier
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Tracking number
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Label Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Shipment status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Actions
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment: any, index: number) => (
                  <TableRow
                    key={index}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment._id
                        ? shipment._id.slice(-8)
                        : `SHIP${index + 1}`}
                    </TableCell>
                    {/* <TableCell className="text-sm text-gray-900 py-3">{shipment._id || "N/A"}</TableCell> */}
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.address_from?.name || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.address_from?.hotelName || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.carrier || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.tracking_id || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.shippingLabel ? "Label generated" : "Pending"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {shipment.status
                        ? shipment.status.charAt(0).toUpperCase() +
                          shipment.status.slice(1)
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      <button
                        className="text-[#0096FF] underline"
                        onClick={() =>
                          shipment.shippingLabel &&
                          handleDownloadLabelFetch(shipment.shippingLabel)
                        }
                        disabled={!shipment.shippingLabel}
                      >
                        {shipment.shippingLabel ? "Download label" : "No label"}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/shipment/${shipment._id}`)
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

          {/* Pagination - EXACT SAME as your demo */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <ChevronLeft className="h-6 w-6 text-[#3A3A3A]" />
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
                className={
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              >
                <ChevronRight className="h-6 w-6 text-[#3A3A3A]" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentsPage;
