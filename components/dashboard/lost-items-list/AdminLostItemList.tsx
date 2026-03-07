// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { lostItemsData } from "@/demo/lostItemsData";

// const AdminLostItemList = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
//     const totalItems = lostItemsData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentItems = lostItemsData.slice(startIndex, endIndex);

//     const getPageNumbers = () => {
//         const pages = [];
//         pages.push(1);

//         if (currentPage > 3) {
//             pages.push("...");
//         }

//         for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//             if (i !== 1 && i !== totalPages) {
//                 pages.push(i);
//             }
//         }

//         if (currentPage < totalPages - 2) {
//             pages.push("...");
//         }

//         if (totalPages > 1) {
//             pages.push(totalPages);
//         }

//         return pages;
//     };

//     const pageNumbers = getPageNumbers();

//     const handlePrevious = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const handleNext = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     const handlePageClick = (page: number) => {
//         if (page !== currentPage) {
//             setCurrentPage(page);
//         }
//     };

//     return (
//         <div className="p-6 space-y-6">
//             {/* Header Section */}
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
//                 <p className="text-[#7C8493] text-lg">Manage all lost and found items.</p>
//             </div>

//             {/* Lost Items Table Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-gray-900">Lost Item List</CardTitle>
//                     <p className="text-sm text-gray-600 mt-1">All reported lost items from hotels.</p>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Item ID</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Item Name</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Hotel/Business</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Business Location</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Found location</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Found date</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Category</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Status</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {currentItems.map((item, index) => (
//                                     <TableRow key={index} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.itemId}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.itemName}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.hotel}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.location}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.foundLocation}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.foundDate}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.category}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.status}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     {/* Pagination */}
//                     <div className="flex items-center justify-between mt-6">
//                         <div className="text-sm text-gray-600">
//                             Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button onClick={handlePrevious} disabled={currentPage === 1}>
//                                 <ChevronLeft className="h-6 w-6 text-[#3A3A3A]" />
//                             </button>

//                             {/* Page Numbers with Ellipsis */}
//                             {pageNumbers.map((page, index) =>
//                                 page === "..." ? (
//                                     <span key={`ellipsis-${index}`} className="px-2 text-[#3A3A3A]">
//                                         ...
//                                     </span>
//                                 ) : (
//                                     <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" className={`h-11 w-11 rounded-full ${currentPage === page ? "bg-[#0096FF] text-white" : "text-[#3A3A3A] border-0"}`} onClick={() => handlePageClick(page as number)}>
//                                         {page}
//                                     </Button>
//                                 )
//                             )}

//                             <button onClick={handleNext} disabled={currentPage === totalPages}>
//                                 <ChevronRight className="h-6 w-6 text-[#3A3A3A]" />
//                             </button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default AdminLostItemList;

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
import { useGetLostItemsQuery } from "@/redux/features/lostItem/lostitemApi";
import Link from "next/link";

const AdminLostItemList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use the API to fetch lost items
  const {
    data: lostItemsData,
    isLoading,
    isError,
  } = useGetLostItemsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Extract data from API response
  const lostItems = lostItemsData?.data?.lostItems || [];
  const meta = lostItemsData?.data?.meta || {
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "shipment booked":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
          <p className="text-[#7C8493] text-lg">Loading lost items...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
          <p className="text-[#7C8493] text-lg">Error loading lost items.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
        <p className="text-[#7C8493] text-lg">
          Manage all lost and found items.
        </p>
      </div>

      {/* Lost Items Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Lost Item List
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            All reported lost items from hotels.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Item ID
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Item Name
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Guest
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Found Location
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Found Date
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lostItems.map((item: any) => (
                  <TableRow
                    key={item._id}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="text-sm text-gray-900 py-3 font-medium">
                      {item._id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {item.guestName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {item.locationFound}
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      {formatDate(item.dateFound)}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900 py-3">
                      <Link
                        href={`/dashboard/lost-items-list/${item._id}`}
                        className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        View
                      </Link>
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

export default AdminLostItemList;
