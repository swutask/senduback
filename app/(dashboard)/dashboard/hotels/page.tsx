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
import { useGetUsersByRoleQuery } from "@/redux/features/user/userApi";
import { useRouter } from "next/navigation";

const HotelsPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed limit

  // Use the API to fetch business users WITH page and limit
  const {
    data: usersData,
    isLoading,
    isError,
  } = useGetUsersByRoleQuery({
    role: "business",
    page: currentPage,
    limit: itemsPerPage,
  });

  console.log(usersData);

  // Extract data from API response
  const businesses = usersData?.data?.users || [];
  const meta = usersData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  // Generate page numbers with ellipsis
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

  // Format name
  const getFullName = (user: any) => {
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Hotels</h1>
          <p className="text-[#7C8493] text-lg">Loading hotel partners...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Hotels</h1>
          <p className="text-[#7C8493] text-lg">Error loading hotel data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Hotels</h1>
        <p className="text-[#7C8493] text-lg">
          Manage all hotel partners and their information.
        </p>
      </div>

      {/* Hotels Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Hotel / Business List
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            All registered hotel partners and businesses.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Hotel / Business
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Location
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Main contact
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Contact email
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    View
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business: any) => (
                  <TableRow
                    key={business._id}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="text-sm text-gray-900 py-3">
                      {getFullName(business)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {business.businessDetails?.address?.street1
                        ? `${business.businessDetails.address.street1}, ${business.businessDetails.address.city || ""}`.trim()
                        : business.businessDetails?.address?.city || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {getFullName(business)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {business.email}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/hotels/${business._id}`)
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

export default HotelsPage;
