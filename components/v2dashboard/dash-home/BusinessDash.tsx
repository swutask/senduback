// "use client";
// import { Button } from "@/components/ui/button";
// import { useGetCurrentUserQuery } from "@/redux/features/user/userApi";
// import Link from "next/link";

// const BusinessDash = () => {
//     const { data } = useGetCurrentUserQuery(undefined);
//     console.log(data);

//     return (
//         <div className="h-full flex items-center justify-center">
//             <div className="flex items-center flex-col justify-center gap-6">
//                 <h1 className="text-5xl text-center font-bold">Welcome abroad!</h1>
//                 <p className="text-center">
//                     Looks like you are new here... <br /> To start Senduback you have to create a business!
//                 </p>
//                 <Link href="/dashboard/settings?tab=business">
//                     <Button className="bg-[#0096FF] hover:bg-[#0096FF]/90 text-white h-auto p-3 font-bold cursor-pointer" style={{ width: "320px" }}>
//                         Create Business
//                     </Button>
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default BusinessDash;

"use client";
import AddLostItemLink from "@/components/dashboard/lost-items-list/AddLostItemLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBusinessStatisticsQuery } from "@/redux/features/dashboard/dashboardApi";
import Image from "next/image";

// Lost item status enum
enum LOST_ITEM_STATUS {
  PENDING = "pending",
  SHIPMENT_BOOKED = "Shipment Booked",
}

// Define the lost item data interface
interface LostItem {
  _id: string;
  itemName: string;
  guestName: string;
  guestRoomNumber: string;
  locationFound: string;
  dateFound: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalLostItem: number;
  resentLostItems: LostItem[];
  totalShipping: number;
  totalDeliveriesThisMonth: number;
}

const BusinessDash = () => {
  // Use the business dashboard API
  const {
    data: dashboardData,
    isLoading,
    isError,
  } = useGetBusinessStatisticsQuery(undefined);

  // Extract data from API response
  const statsData: DashboardStats = dashboardData?.data || {
    totalLostItem: 0,
    resentLostItems: [],
    totalShipping: 0,
    totalDeliveriesThisMonth: 0,
  };
  console.log(statsData);

  // Define the stats cards based on API data
  const statsCards = [
    {
      title: "Items in storage",
      value: statsData.totalLostItem.toString(),
      image: "/dashboard/overview/icon4.svg",
    },
    {
      title: "Shipments in Progress",
      value: statsData.totalShipping.toString(),
      image: "/dashboard/overview/icon5.svg",
    },
    {
      title: "Delivered this month",
      value: statsData.totalDeliveriesThisMonth.toString(),
      image: "/dashboard/overview/icon3.svg",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case LOST_ITEM_STATUS.PENDING:
        return { backgroundColor: "#F6FF00", color: "black" };
      case LOST_ITEM_STATUS.SHIPMENT_BOOKED.toLowerCase():
        return { backgroundColor: "#0096FF", color: "white" };
      default:
        return { backgroundColor: "#00FF44", color: "black" };
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case LOST_ITEM_STATUS.PENDING:
        return "Pending";
      case LOST_ITEM_STATUS.SHIPMENT_BOOKED.toLowerCase():
        return "Shipment Booked";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Get recent lost items (limit to 4)
  const recentLostItems = statsData.resentLostItems;

  if (isLoading) {
    return (
      <div className="md:p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Business dashboard
          </h1>
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
      <div className="md:p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Business dashboard
          </h1>
          <p className="text-[#7C8493] text-lg">
            Error loading dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex md:items-center justify-between flex-col md:flex-row gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">
            Business dashboard
          </h1>
          <p className="text-[#7C8493] text-lg">
            Keep track of your lost items, guest requests and shipments.
          </p>
        </div>
        <AddLostItemLink>
          <Button className="bg-[#0096FF] text-white px-6 py-2">
            Add new lost item
          </Button>
        </AddLostItemLink>
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

      {/* Recent Lost Items Section */}
      {/* <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">Recent lost items</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Items your team has recently added to lost & found.</p>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                                    <TableHead className="text-sm font-bold text-gray-600 py-3">Item</TableHead>
                                    <TableHead className="text-sm font-bold text-gray-600 py-3">Found at</TableHead>
                                    <TableHead className="text-sm font-bold text-gray-600 py-3">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentLostItems.length > 0 ? (
                                    recentLostItems.map((item) => (
                                        <TableRow key={item._id} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
                                            <TableCell className="text-sm text-gray-900 py-3 font-medium">{item.itemName}</TableCell>
                                            <TableCell className="text-sm text-gray-900 py-3">{item.locationFound}</TableCell>
                                            <TableCell className="py-3">
                                                <Badge variant="default" className="py-2 px-5" style={getStatusStyle(item.status)}>
                                                    {formatStatus(item.status)}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                            No lost items found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card> */}
      {/* Recent Lost Items Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Recent lost items
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Items your team has recently added to lost & found.
          </p>
        </CardHeader>
        <CardContent>
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {recentLostItems.length > 0 ? (
              recentLostItems.map((item) => (
                <div
                  key={item._id}
                  className="border border-[#454B6066] rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-600">
                        Item
                      </div>
                      <div className="text-base font-medium text-gray-900 mt-1">
                        {item.itemName}
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="py-1 px-3 text-xs"
                      style={getStatusStyle(item.status)}
                    >
                      {formatStatus(item.status)}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">
                      Found at
                    </div>
                    <div className="text-sm text-gray-900 mt-1">
                      {item.locationFound}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 border border-[#454B6066] rounded-lg">
                No lost items found.
              </div>
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Item
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Found at
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLostItems.length > 0 ? (
                  recentLostItems.map((item) => (
                    <TableRow
                      key={item._id}
                      className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                    >
                      <TableCell className="text-sm text-gray-900 py-3 font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell className="text-sm text-gray-900 py-3">
                        {item.locationFound}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant="default"
                          className="py-2 px-5"
                          style={getStatusStyle(item.status)}
                        >
                          {formatStatus(item.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-gray-500"
                    >
                      No lost items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessDash;
