// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { recentOrders } from "@/demo/recentOrders";
// import { useState } from "react";
// import Image from "next/image";

// const AdminDash = () => {
//     const statsData = [
//         {
//             title: "Total Hotels",
//             value: "247",
//             image: "/dashboard/overview/icon.svg",
//         },
//         {
//             title: "Orders Today",
//             value: "62",
//             image: "/dashboard/overview/icon2.svg",
//         },
//         {
//             title: "Delivered this month",
//             value: "122",
//             image: "/dashboard/overview/icon3.svg",
//         },
//     ];

//     const getStatusStyle = (status: string) => {
//         switch (status.toLowerCase()) {
//             case "confirmed":
//                 return { backgroundColor: "#00FF44", color: "black" };
//             case "pending":
//                 return { backgroundColor: "#F6FF00", color: "black" };
//             case "in transit":
//                 return { backgroundColor: "#0096FF", color: "white" };
//             default:
//                 return { backgroundColor: "#00FF44", color: "black" };
//         }
//     };

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 4; // Show 4 items per page
//     const totalItems = recentOrders.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     // Calculate the orders to display for current page
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentOrders = recentOrders.slice(startIndex, endIndex);

//     // Generate page numbers with ellipsis
//     const getPageNumbers = () => {
//         const pages = [];

//         // Always show first page
//         pages.push(1);

//         // Show ellipsis after first page if needed
//         if (currentPage > 3) {
//             pages.push("...");
//         }

//         // Show pages around current page
//         for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//             if (i !== 1 && i !== totalPages) {
//                 pages.push(i);
//             }
//         }

//         // Show ellipsis before last page if needed
//         if (currentPage < totalPages - 2) {
//             pages.push("...");
//         }

//         // Always show last page
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
//                 <h1 className="text-3xl font-bold text-[#25324B]">Admin dashboard</h1>
//                 <p className="text-[#7C8493] text-lg">See what's happening across hotels, orders and shipments.</p>
//             </div>

//             {/* Stats Cards Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {statsData.map((stat, index) => (
//                     <Card key={index} className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-5">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <CardTitle className="text-sm font-medium text-[#202224] mb-4">{stat.title}</CardTitle>
//                                 <div className="text-3xl font-bold text-[#202224]">{stat.value}</div>
//                             </div>
//                             <Image src={stat.image} alt={`Stat ${index + 1}`} width={40} height={40} className="shrink-0" />
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             {/* Recent Orders Section */}
//             <Card className=" shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-gray-900">Recent orders</CardTitle>
//                     <p className="text-sm text-gray-600 mt-1">Latest requests from guests.</p>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Order ID</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Guest</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Hotel</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Status</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {currentOrders.map((order, index) => (
//                                     <TableRow key={index} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
//                                         <TableCell className="text-sm text-gray-900 py-3">{order.orderId}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{order.guest}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{order.hotel}</TableCell>
//                                         <TableCell className="py-3">
//                                             <Badge variant="default" className="py-2 px-5" style={getStatusStyle(order.status)}>
//                                                 {order.status}
//                                             </Badge>
//                                         </TableCell>
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

// export default AdminDash;

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { useGetAdminStatisticsQuery } from "@/redux/features/dashboard/dashboardApi";

// Define the shipping data interface
interface ShippingItem {
  _id: string;
  shipping_type: string;
  status: string;
  address_from: {
    hotelName: string;
    name: string;
    city: string;
    country: string;
  };
  address_to: {
    name: string;
    city: string;
    country: string;
  };
  total_cost: number;
  currency: string;
  createdAt: string;
  tracking_id?: string;
  carrier?: string;
}

interface DashboardStats {
  totalShipping: number;
  totalBusiness: number;
  totalDeliveriesThisMonth: number;
  resentShipping: ShippingItem[];
}

const AdminDash = () => {
  // Use the dashboard API
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetAdminStatisticsQuery(undefined);

  // Extract data from API response
  const statsData = dashboardData?.data || {
    totalShipping: 0,
    totalBusiness: 0,
    totalDeliveriesThisMonth: 0,
    resentShipping: [],
  };

  // Define the stats cards based on API data
  const statsCards = [
    {
      title: "Total Shipping",
      value: statsData.totalShipping.toString(),
      image: "/dashboard/overview/icon.svg",
    },
    {
      title: "Total Business",
      value: statsData.totalBusiness.toString(),
      image: "/dashboard/overview/icon2.svg",
    },
    {
      title: "Delivered this month",
      value: statsData.totalDeliveriesThisMonth.toString(),
      image: "/dashboard/overview/icon3.svg",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return { backgroundColor: "#F6FF00", color: "black" }; // yellow

      case "paymentcompleted":
        return { backgroundColor: "#00FF44", color: "black" }; // green

      case "shipped":
        return { backgroundColor: "#0096FF", color: "white" }; // blue

      case "delivered":
        return { backgroundColor: "#00C853", color: "white" }; // dark green

      default:
        return { backgroundColor: "#E0E0E0", color: "black" };
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "created":
        return "Created";

      case "paymentcompleted":
        return "Payment Completed";

      case "shipped":
        return "Shipped";

      case "delivered":
        return "Delivered";

      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get recent orders from API data (limit to 5)
  const recentOrders = statsData.resentShipping.slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Admin dashboard</h1>
          <p className="text-[#7C8493] text-lg">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <Card
              key={index}
              className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Admin dashboard</h1>
          <p className="text-[#7C8493] text-lg">
            Error loading dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Admin dashboard</h1>
        <p className="text-[#7C8493] text-lg">
          See what's happening across shipping, business and deliveries.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)] p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium text-[#202224] mb-4">
                  {stat.title}
                </CardTitle>
                <div className="text-3xl font-bold text-[#202224]">
                  {stat.value}
                </div>
              </div>
              <Image
                src={stat.image}
                alt={`Stat ${index + 1}`}
                width={40}
                height={40}
                className="shrink-0"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Recent Shipments
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Latest shipping requests from customers.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Tracking ID
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Customer
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Hotel
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Date
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: any) => (
                    <TableRow
                      key={order._id}
                      className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <TableCell className="text-sm text-gray-900 py-3 font-medium">
                        {order.tracking_id || order._id.slice(-8)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {order.address_from.name}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {order.address_from.hotelName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="default"
                          className="py-2 px-5"
                          style={getStatusStyle(order.status)}
                        >
                          {formatStatus(order.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      No recent shipments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Removed pagination as requested */}
          <div className="text-sm text-gray-600 mt-4">
            Showing {recentOrders.length} recent shipments
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDash;
