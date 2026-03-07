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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { webhookLogsData } from "@/demo/webhookLogsData";

const page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = webhookLogsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = webhookLogsData.slice(startIndex, endIndex);

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

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Webhook Logs</h1>
        <p className="text-[#7C8493] text-lg">
          Monitor all webhook events and responses.
        </p>
      </div>

      {/* Webhook Logs Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Webhook Event Logs
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            All webhook events and their processing status.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Event ID
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Shipment ID
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Courier
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Event type
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    HTTP Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Processing Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Received at
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Label Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Message/Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.eventId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.shipmentId}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.courier}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.eventType}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.httpStatus}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.processingStatus}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.receivedAt}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {log.labelStatus}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3 whitespace-pre-line">
                      {log.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} results
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevious} disabled={currentPage === 1}>
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

export default page;
