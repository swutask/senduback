// "use client";
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, Star, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { reviewsData } from "@/demo/reviewData";

// const ReviewsPage = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 6;
//     const totalItems = reviewsData.length;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentItems = reviewsData.slice(startIndex, endIndex);

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
//         switch (status.toLowerCase()) {
//             case "published":
//                 return "bg-green-100 text-green-800";
//             case "pending":
//                 return "bg-yellow-100 text-yellow-800";
//             case "rejected":
//                 return "bg-red-100 text-red-800";
//             default:
//                 return "bg-gray-100 text-gray-800";
//         }
//     };

//     const renderStars = (rating: number) => {
//         return Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />);
//     };

//     return (
//         <div className="p-6 space-y-6">
//             {/* Header Section */}
//             <div className="space-y-2">
//                 <h1 className="text-3xl font-bold text-[#25324B]">Reviews</h1>
//                 <p className="text-[#7C8493] text-lg">Manage and monitor customer reviews and feedback.</p>
//             </div>

//             {/* Reviews Table Section */}
//             <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                 <CardHeader>
//                     <CardTitle className="text-xl font-semibold text-gray-900">Customer Reviews</CardTitle>
//                     <p className="text-sm text-gray-600 mt-1">All customer reviews and ratings from hotels.</p>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">User</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Rating</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Comment</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Hotel</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Room</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Date</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Status</TableHead>
//                                     <TableHead className="text-sm font-bold text-gray-600 py-3">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {currentItems.map((review) => (
//                                     <TableRow key={review.id} className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0">
//                                         <TableCell className="py-3">
//                                             <div className="space-y-1">
//                                                 <div className="font-medium text-gray-900">{review.userName}</div>
//                                                 <div className="text-sm text-gray-500">{review.userEmail}</div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="py-3">
//                                             <div className="flex items-center gap-1">
//                                                 {renderStars(review.rating)}
//                                                 <span className="text-sm text-gray-600 ml-1">({review.rating})</span>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="py-3 max-w-xs">
//                                             <div className="text-sm text-gray-900 line-clamp-2">{review.comment}</div>
//                                         </TableCell>
//                                         <TableCell className="py-3 text-sm text-gray-900">{review.hotel}</TableCell>
//                                         <TableCell className="py-3 text-sm text-gray-900">{review.roomNumber}</TableCell>
//                                         <TableCell className="py-3 text-sm text-gray-900">{review.date}</TableCell>
//                                         <TableCell className="py-3">
//                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>{review.status}</span>
//                                         </TableCell>
//                                         <TableCell className="py-3">
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" className="h-8 w-8 p-0">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end">
//                                                     <DropdownMenuItem className="flex items-center gap-2">
//                                                         <Eye className="h-4 w-4" />
//                                                         View Details
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuItem className="flex items-center gap-2">
//                                                         <Edit className="h-4 w-4" />
//                                                         Edit Status
//                                                     </DropdownMenuItem>
//                                                     <DropdownMenuItem className="flex items-center gap-2 text-red-600">
//                                                         <Trash2 className="h-4 w-4" />
//                                                         Delete
//                                                     </DropdownMenuItem>
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
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

// export default ReviewsPage;

"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MoreVertical,
  Eye,
  Trash2,
  X,
  Calendar,
  User,
  Mail,
  StarIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
} from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ReviewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: apiData,
    isLoading,
    isError,
    refetch,
  } = useGetAllReviewsQuery(undefined);
  const [deleteReview] = useDeleteReviewMutation();

  const reviewsData = apiData?.data?.reviews || [];
  const metaData = apiData?.data?.meta || {
    total: 0,
    limit: 6,
    page: 1,
    totalPage: 1,
  };

  const itemsPerPage = metaData.limit || 6;
  const totalItems = metaData.total || 0;
  const totalPages = metaData.totalPage || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = reviewsData.slice(startIndex, endIndex);

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

  const handlePageClick = (page: any) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status: any) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: any) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#25324B]">Reviews</h1>
        <p className="text-[#7C8493] text-lg mt-2">Loading reviews...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#25324B]">Reviews</h1>
        <p className="text-red-500 text-lg mt-2">
          Error loading reviews. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* View Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#25324B]">
              Review Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this customer review
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Customer Name</p>
                      <p className="font-medium">{selectedReview.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedReview.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Submitted Date</p>
                      <p className="font-medium">
                        {selectedReview.createdAt
                          ? new Date(
                              selectedReview.createdAt,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center gap-1">
                        {renderStars(selectedReview.rating)}
                        <span className="ml-2 font-medium">
                          ({selectedReview.rating}/5)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Review Comment
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700">
                    {selectedReview.comment || "No comment provided"}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor("published")}`}
                  >
                    Published
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Review ID</p>
                  <p className="text-sm text-gray-500 font-mono">
                    {selectedReview._id}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCloseModal}>
              Close
            </Button>
            {selectedReview && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteReview(selectedReview._id);
                  handleCloseModal();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Review
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#25324B]">Reviews</h1>
        <p className="text-[#7C8493] text-lg">
          Manage and monitor customer reviews and feedback.
        </p>
      </div>

      {/* Reviews Table Section */}
      <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Customer Reviews
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            All customer reviews and ratings.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-[#454B6066] rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#454B6066] bg-[#EAEAEA] hover:bg-[#EAEAEA]">
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    User
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Rating
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Comment
                  </TableHead>
                  <TableHead className="text-sm font-bold text-gray-600 py-3">
                    Date
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
                {currentItems.map((review: any) => (
                  <TableRow
                    key={review._id}
                    className="border-b border-[#454B6066] hover:bg-gray-50 transition-colors last:border-b-0"
                  >
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {review.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({review.rating})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 max-w-xs">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {review.comment || "No comment"}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-900">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor("published")}`}
                      >
                        Published
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleViewDetails(review)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
                    onClick={() => handlePageClick(page)}
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
  );
};

export default ReviewsPage;
