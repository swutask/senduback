// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ChevronLeft, ChevronRight, MoreVertical, Edit, Mail, Image, Eye } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";
// import { useGetLostItemsQuery, useSendLostItemEmailMutation, useUpdateLostItemMutation } from "@/redux/features/lostItem/lostitemApi";
// import { toast } from "sonner";
// import EditLostItemModal from "./EditLostItemModal";
// import AddLostItemLink from "./AddLostItemLink";
// import ControlledQRScannerModal from "./ControlledQRScannerModal";

// const BusinessLostItemList = () => {
//     const router = useRouter();
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedItemForQR, setSelectedItemForQR] = useState<any>(null);
//     const [showQRModal, setShowQRModal] = useState(false);
//     const itemsPerPage = 10;

//     // Fetch real data from API
//     const {
//         data: apiData,
//         isLoading,
//         refetch,
//     } = useGetLostItemsQuery({
//         page: currentPage,
//         limit: itemsPerPage,
//     });

//     // Email mutation
//     const [sendEmail, { isLoading: isSendingEmail }] = useSendLostItemEmailMutation();
//     // Mutations
//     const [updateLostItem] = useUpdateLostItemMutation();

//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState<any>(null);
//     // Handle edit item
//     const handleEditClick = (item: any) => {
//         setSelectedItem(item);
//         setIsEditModalOpen(true);
//     };

//     // Handle save edited item
//     const handleSaveItem = async (id: string, data: any) => {
//         try {
//             await updateLostItem({ id, data }).unwrap();
//             refetch(); // Refresh the list
//         } catch (error) {
//             throw error;
//         }
//     };

//     // Extract and format data
//     const lostItems = apiData?.data?.lostItems || [];
//     const meta = apiData?.data?.meta || { total: 0, limit: 10, page: 1, totalPage: 1 };

//     const totalItems = meta.total;
//     const totalPages = meta.totalPage;

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

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

//     const getStatusColor = (status: string) => {
//         switch (status?.toLowerCase()) {
//             case "claimed":
//                 return "bg-green-100 text-green-800";
//             case "email sent":
//             case "email_sent":
//                 return "bg-blue-100 text-blue-800";
//             case "not claimed":
//             case "not_claimed":
//             case "pending":
//             default:
//                 return "bg-yellow-100 text-yellow-800";
//         }
//     };

//     // Format status display
//     const formatStatus = (status: string) => {
//         if (!status) return "Not claimed";
//         if (status === "email_sent") return "Email sent";
//         if (status === "not_claimed") return "Not claimed";
//         return status.charAt(0).toUpperCase() + status.slice(1);
//     };

//     // Format date to DD/MM/YYYY
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, "0");
//         const month = (date.getMonth() + 1).toString().padStart(2, "0");
//         const year = date.getFullYear();
//         return `${day}/${month}/${year}`;
//     };

//     const getFirstNWords = (text: string, n: number) => {
//         if (!text) return "-";
//         const words = text.split(" ");
//         if (words.length <= n) return text;
//         return words.slice(0, n).join(" ") + "...";
//     };

//     const handleShowQRCode = (item: any) => {
//         setSelectedItemForQR(item);
//         setShowQRModal(true);
//     };

//     // Handle send email
//     const handleSendEmail = async (itemId: string, guestEmail: string) => {
//         try {
//             console.log("Sending email to item:", itemId, "email:", guestEmail);

//             const result = await sendEmail({
//                 id: itemId,
//                 emailData: {
//                     to: guestEmail,
//                     subject: "Regarding Your Lost Item",
//                     // Add any other required email data
//                 },
//             }).unwrap();

//             console.log("Email sent result:", result);
//             toast.success("Email sent successfully!");
//             refetch(); // Refresh data to update status
//         } catch (error: any) {
//             console.error("Error sending email:", error);

//             // Check different error types
//             if (error?.status === 400) {
//                 toast.error("Invalid request. Please check the email address.");
//             } else if (error?.status === 404) {
//                 toast.error("Lost item not found.");
//             } else if (error?.status === 500) {
//                 toast.error("Server error. Please try again later.");
//             } else if (error?.data?.message) {
//                 toast.error(error.data.message);
//             } else {
//                 toast.error("Failed to send email. Please try again.");
//             }
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="md:p-6 space-y-6">
//                 <div className="flex justify-between items-center">
//                     <div className="space-y-2">
//                         <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
//                         <p className="text-[#7C8493] text-lg">Loading...</p>
//                     </div>
//                     <AddLostItemLink>
//                         <Button className="bg-[#0096FF] text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors">Add new lost item</Button>
//                     </AddLostItemLink>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="md:p-6 space-y-6">
//             {/* Header Section */}
//             <div className="flex justify-between items-center">
//                 <div className="space-y-2">
//                     <h1 className="text-3xl font-bold text-[#25324B]">Lost Items</h1>
//                     <p className="text-[#7C8493] text-lg">Manage all lost and found items.</p>
//                 </div>
//             </div>

//             {/* Lost Items Table Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <div className="flex items-start justify-between">
//                         <div>
//                             <CardTitle className="text-xl font-semibold text-gray-900">Lost Item List</CardTitle>
//                             <p className="text-sm text-gray-600 mt-1">All reported lost items from hotels.</p>
//                         </div>
//                         <AddLostItemLink>
//                             <Button className="bg-[#0096FF] text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors">Add new lost item</Button>
//                         </AddLostItemLink>
//                     </div>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Item no</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Item</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3 w-10!">Description</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Found Location</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Found Date</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Guest</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Contact</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Room / reservation</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Checkout date</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Status</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Action</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {lostItems.map((item: any, index: number) => (
//                                     <TableRow key={item._id} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
//                                         <TableCell className="text-sm text-gray-900 py-3">{(startIndex + index + 1).toString().padStart(2, "0")}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.itemName}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">
//                                             <div className="truncate group relative" title={item.itemDescription}>
//                                                 {getFirstNWords(item.itemDescription, 3)}
//                                                 <div className="absolute invisible group-hover:visible z-50 bg-white border border-gray-200 shadow-lg p-3 rounded-md max-w-xs wrap-break-word whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200">{item.itemDescription}</div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.locationFound}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{formatDate(item.dateFound)}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.guestName || "-"}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">
//                                             <div>
//                                                 <div>{item.guestEmail || "-"}</div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.guestRoomNumber ? (item.guestReservationName ? `${item.guestReservationName} ${item.guestRoomNumber}` : `Room ${item.guestRoomNumber}`) : "-"}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">{item.checkoutDate ? formatDate(item.checkoutDate) : "-"}</TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">
//                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{formatStatus(item.status)}</span>
//                                         </TableCell>
//                                         <TableCell className="text-sm text-gray-900 py-3">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" className="h-8 w-8 p-0">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end">
//                                                     <DropdownMenuItem className="flex items-center gap-2" onClick={() => router.push(`/dashboard/lost-items-list/${item._id}`)}>
//                                                         <Eye className="h-4 w-4" />
//                                                         View details
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleEditClick(item)}>
//                                                         <Edit className="h-4 w-4" />
//                                                         Edit
//                                                     </DropdownMenuItem>
//                                                     {item.guestEmail && (
//                                                         <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleSendEmail(item._id, item.guestEmail)} disabled={!item.guestEmail || isSendingEmail}>
//                                                             <Mail className="h-4 w-4" />
//                                                             {isSendingEmail ? "Sending..." : "Send email to guest"}
//                                                         </DropdownMenuItem>
//                                                     )}
//                                                     <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleShowQRCode(item)}>
//                                                         <Image className="h-4 w-4" />
//                                                         Change Photos
//                                                     </DropdownMenuItem>

//                                                     {/* <DropdownMenuItem className="flex items-center gap-2">Mark as manually send</DropdownMenuItem> */}
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     {selectedItemForQR && (
//                         <ControlledQRScannerModal
//                             lostItemId={selectedItemForQR._id}
//                             isOpen={showQRModal}
//                             onClose={() => {
//                                 setShowQRModal(false);
//                                 setSelectedItemForQR(null);
//                             }}
//                             onMobileUploadComplete={() => {
//                                 // Optional: refresh data when upload completes
//                                 refetch();
//                             }}
//                         />
//                     )}
//                     {selectedItem && (
//                         <EditLostItemModal
//                             isOpen={isEditModalOpen}
//                             onClose={() => {
//                                 setIsEditModalOpen(false);
//                                 setSelectedItem(null);
//                             }}
//                             itemData={selectedItem}
//                             onSave={handleSaveItem}
//                         />
//                     )}

//                     {/* Pagination */}
//                     <div className="flex items-center justify-between mt-6">
//                         <div className="text-sm text-gray-600">
//                             Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button onClick={handlePrevious} disabled={currentPage === 1} className={`p-2 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-[#3A3A3A] hover:bg-gray-100"}`}>
//                                 <ChevronLeft className="h-6 w-6" />
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

//                             <button onClick={handleNext} disabled={currentPage === totalPages} className={`p-2 rounded-full ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-[#3A3A3A] hover:bg-gray-100"}`}>
//                                 <ChevronRight className="h-6 w-6" />
//                             </button>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default BusinessLostItemList;

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit,
  Mail,
  Image as ImageIcon,
  Eye,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  useGetLostItemsQuery,
  useSendLostItemEmailMutation,
  useUpdateLostItemMutation,
} from "@/redux/features/lostItem/lostitemApi";
import { toast } from "sonner";
import EditLostItemModal from "./EditLostItemModal";
import AddLostItemLink from "./AddLostItemLink";
import ControlledQRScannerModal from "./ControlledQRScannerModal";
import Image from "next/image";

const BusinessLostItemList = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemForQR, setSelectedItemForQR] = useState<any>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const itemsPerPage = 10;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASEURL || "https://api.senduback.com";

  // Fetch real data from API
  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetLostItemsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Email mutation
  const [sendEmail, { isLoading: isSendingEmail }] =
    useSendLostItemEmailMutation();
  // Mutations
  const [updateLostItem] = useUpdateLostItemMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  // Handle edit item
  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Handle save edited item
  const handleSaveItem = async (id: string, data: any) => {
    try {
      await updateLostItem({ id, data }).unwrap();
      refetch(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  // Extract and format data
  const lostItems = apiData?.data?.lostItems || [];
  const meta = apiData?.data?.meta || {
    total: 0,
    limit: 10,
    page: 1,
    totalPage: 1,
  };

  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "claimed":
        return "bg-green-100 text-green-800";
      case "email sent":
      case "email_sent":
        return "bg-blue-100 text-blue-800";
      case "not claimed":
      case "not_claimed":
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Format status display
  const formatStatus = (status: string) => {
    if (!status) return "Not claimed";
    if (status === "email_sent") return "Email sent";
    if (status === "not_claimed") return "Not claimed";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFirstNWords = (text: string, n: number) => {
    if (!text) return "-";
    const words = text.split(" ");
    if (words.length <= n) return text;
    return words.slice(0, n).join(" ") + "...";
  };

  const handleShowQRCode = (item: any) => {
    setSelectedItemForQR(item);
    setShowQRModal(true);
  };

  // Handle send email
  const handleSendEmail = async (itemId: string, guestEmail: string) => {
    try {
      console.log("Sending email to item:", itemId, "email:", guestEmail);

      const result = await sendEmail({
        id: itemId,
        emailData: {
          to: guestEmail,
          subject: "Regarding Your Lost Item",
          // Add any other required email data
        },
      }).unwrap();

      console.log("Email sent result:", result);
      toast.success("Email sent successfully!");
      refetch(); // Refresh data to update status
    } catch (error: any) {
      console.error("Error sending email:", error);

      // Check different error types
      if (error?.status === 400) {
        toast.error("Invalid request. Please check the email address.");
      } else if (error?.status === 404) {
        toast.error("Lost item not found.");
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    }
  };

  // Function to get full image URL
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return null;

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    // Check if it's already a full URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Construct full URL
    return `${baseUrl}/${cleanPath}`;
  };

  if (isLoading) {
    return (
      <div className="md:p-6 space-y-6 p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#25324B]">
              Lost Items
            </h1>
            <p className="text-[#7C8493] text-base md:text-lg">Loading...</p>
          </div>
          <AddLostItemLink>
            <Button className="bg-[#0096FF] text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors">
              Add new lost item
            </Button>
          </AddLostItemLink>
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 space-y-6 p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#25324B]">
            Lost Items
          </h1>
          <p className="text-[#7C8493] text-base md:text-lg">
            Manage all lost and found items.
          </p>
        </div>
      </div>

      {/* Lost Items Table Section */}
      <div className="overflow-hidden">
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Lost Item List
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  All reported lost items from hotels.
                </p>
              </div>
              <AddLostItemLink>
                <Button className="bg-[#0096FF] text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto">
                  Add new lost item
                </Button>
              </AddLostItemLink>
            </div>
          </CardHeader>
          <CardContent>
            {/* RESPONSIVE TABLE WITHOUT FIXED WIDTHS */}
            <div className="border border-[#454B6066] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#EAEAEA]">
                    <tr className="border-b border-[#454B6066]">
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        No.
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Image
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Item / Description
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Found Location
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Found Date
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Guest
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Room / reservation
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Checkout date
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Status
                      </th>
                      <th className="text-sm font-bold text-gray-600 py-3 px-4 whitespace-nowrap text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lostItems.map((item: any, index: number) => {
                      const firstImage =
                        item.images && item.images.length > 0
                          ? item.images[0]
                          : null;
                      const fullImageUrl = firstImage
                        ? getFullImageUrl(firstImage)
                        : null;

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                        >
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            {(startIndex + index + 1)
                              .toString()
                              .padStart(2, "0")}
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 border border-gray-300">
                              {fullImageUrl ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={fullImageUrl}
                                    alt={item.itemName}
                                    fill
                                    sizes="40px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {item.itemName}
                              </span>
                              <span
                                className="truncate text-gray-500"
                                title={item.itemDescription}
                              >
                                {getFirstNWords(item.itemDescription, 3)}
                              </span>
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            {item.locationFound}
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            {formatDate(item.dateFound)}
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4">
                            <div className="flex flex-col">
                              <span>{item.guestName || "-"}</span>
                              <span
                                className="truncate text-gray-500"
                                title={item.guestEmail}
                              >
                                {item.guestEmail || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            <div className="truncate">
                              {item.guestRoomNumber
                                ? item.guestReservationName
                                  ? `${item.guestReservationName} ${item.guestRoomNumber}`
                                  : `Room ${item.guestRoomNumber}`
                                : "-"}
                            </div>
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            {item.checkoutDate
                              ? formatDate(item.checkoutDate)
                              : "-"}
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                            >
                              {formatStatus(item.status)}
                            </span>
                          </td>
                          <td className="text-sm text-gray-900 py-3 px-4 whitespace-nowrap flex items-center gap-2">
                            {/* View details button outside dropdown */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/dashboard/lost-items-list/${item._id}`,
                                )
                              }
                            >
                              <Eye className="h-4 w-4 " />
                            </Button>

                            {/* Dropdown for other actions */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handleEditClick(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {item.guestEmail && (
                                  <DropdownMenuItem
                                    className="flex items-center gap-2"
                                    onClick={() =>
                                      handleSendEmail(item._id, item.guestEmail)
                                    }
                                    disabled={
                                      !item.guestEmail || isSendingEmail
                                    }
                                  >
                                    <Mail className="h-4 w-4" />
                                    {isSendingEmail
                                      ? "Sending..."
                                      : "Send email to guest"}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="flex items-center gap-2"
                                  onClick={() => handleShowQRCode(item)}
                                >
                                  <ImageIcon className="h-4 w-4" />
                                  Change Photos
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedItemForQR && (
              <ControlledQRScannerModal
                lostItemId={selectedItemForQR._id}
                isOpen={showQRModal}
                onClose={() => {
                  setShowQRModal(false);
                  setSelectedItemForQR(null);
                }}
                onMobileUploadComplete={() => {
                  refetch();
                }}
              />
            )}
            {selectedItem && (
              <EditLostItemModal
                isOpen={isEditModalOpen}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                itemData={selectedItem}
                onSave={handleSaveItem}
              />
            )}

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessLostItemList;
