"use client";

import { useState } from "react";
import { Search, ChevronDown, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useCreateReviewMutation,
} from "@/redux/features/review/reviewApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New review form state
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  });

  // Fetch reviews from API
  const { data, isLoading, isError, refetch } = useGetReviewsQuery({
    page,
    limit,
    searchTerm: searchTerm || undefined,
  });

  const [deleteReview] = useDeleteReviewMutation();
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

  // Handle delete review
  const handleDeleteReview = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#fff",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-lg font-semibold",
        confirmButton: "px-4 py-2 rounded-md",
        cancelButton: "px-4 py-2 rounded-md",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteReview(id).unwrap();

        await Swal.fire({
          title: "Deleted!",
          text: "Review has been deleted.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          background: "#fff",
          customClass: {
            popup: "rounded-lg shadow-xl",
          },
        });
      } catch (error) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete review.",
          icon: "error",
          confirmButtonColor: "#d33",
          background: "#fff",
          customClass: {
            popup: "rounded-lg shadow-xl",
          },
        });
      }
    }
  };

  // Handle create new review
  const handleCreateReview = async () => {
    // Validate form
    if (
      !newReview.name.trim() ||
      !newReview.email.trim() ||
      !newReview.comment.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      await createReview(newReview).unwrap();
      toast.success("Review created successfully!");
      setNewReview({
        name: "",
        email: "",
        rating: 5,
        comment: "",
      });
      setIsAddModalOpen(false);
      refetch(); // Refresh the reviews list
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create review");
    }
  };

  // Determine status based on rating
  const getReviewStatus = (rating: number) => {
    if (rating >= 4) return "Published";
    if (rating >= 3) return "Pending";
    return "Flagged";
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Open modal with review details
  const openReviewModal = (review: Review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  // Reset new review form
  const resetNewReviewForm = () => {
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      comment: "",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">⭐</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          </div>
          <p className="text-sm text-gray-600">Guest feedback and ratings</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !data?.data?.reviews) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">⭐</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          </div>
          <p className="text-sm text-gray-600">Guest feedback and ratings</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-red-600">Failed to load reviews</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const reviews = data.data.reviews;
  const totalReviews = data.data.meta?.total || 0;

  return (
    <>
      <div className="w-[92vw] md:w-[770px] lg:w-full mx-auto lg:mx-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600">⭐</span>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Reviews
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                {totalReviews} guest feedback and ratings
              </p>
            </div>

            {/* Add Review Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[linear-gradient(180deg,rgba(0,148,252,0.80)_19.32%,rgba(1,106,207,0.80)_100%)] hover:bg-[linear-gradient(180deg,rgba(0,148,252,1)_19.32%,rgba(1,106,207,1)_100%)] text-white px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Review
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by guest, email, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2.5"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <Table className="">
              <TableHeader className="h-12 bg-gray-50 border-b border-gray-100">
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Created On</TableHead>
                  {/* <TableHead>Status</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No reviews found
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review: any) => {
                    const status = getReviewStatus(review.rating);

                    return (
                      <TableRow key={review._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {review.name}
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          {review.email}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-yellow-500">
                                {i < review.rating ? "★" : "☆"}
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="max-w-[300px]">
                          <div
                            className="text-sm text-gray-700 truncate"
                            title={review.comment}
                          >
                            {review.comment}
                          </div>
                        </TableCell>

                        <TableCell className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </TableCell>

                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => openReviewModal(review)}
                              >
                                👁 View full review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteReview(review._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data.data.meta && data.data.meta.totalPage > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, totalReviews)} of {totalReviews}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {page} of {data.data.meta.totalPage}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) =>
                      Math.min(data.data.meta.totalPage, prev + 1),
                    )
                  }
                  disabled={page === data.data.meta.totalPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Review Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Review Details
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Guest</p>
                  <p className="font-medium">{selectedReview.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-blue-600">
                    {selectedReview.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < selectedReview.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {selectedReview.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Comment</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-700 text-sm">
                    {selectedReview.comment}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedReview.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${getReviewStatus(selectedReview.rating) === "Published" ? "bg-green-100 text-green-700" : getReviewStatus(selectedReview.rating) === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                  >
                    {getReviewStatus(selectedReview.rating)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={() => {
                    handleDeleteReview(selectedReview._id);
                    setIsViewModalOpen(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Review Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) resetNewReviewForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Add New Review
            </DialogTitle>
            <DialogDescription>
              Add a review from a guest. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Guest Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newReview.name}
                onChange={(e) =>
                  setNewReview({ ...newReview, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={newReview.email}
                onChange={(e) =>
                  setNewReview({ ...newReview, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${rating <= newReview.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({newReview.rating}/5)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                rows={4}
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
              <p className="font-medium mb-1">Example Review:</p>
              <p>
                "Lost my iPhone 13 while traveling by rickshaw. The phone has a
                cracked screen protector."
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetNewReviewForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReview}
              disabled={isCreating}
              className="bg-[linear-gradient(180deg,rgba(0,148,252,0.90)_19.32%,rgba(1,106,207,0.90)_100%)] hover:bg-[linear-gradient(180deg,rgba(0,148,252,1)_19.32%,rgba(1,106,207,1)_100%)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? "Adding..." : "Add Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
