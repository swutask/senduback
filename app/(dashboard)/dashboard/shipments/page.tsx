"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ShippingDetailsModal from "@/lib/modal/shipping-details-modal";
import { getImageUrl } from "@/lib/utils";
import { LOST_ITEM_STATUS } from "@/redux/features/lostItem/lostitemApi";
import {
  useDeleteShippingItemMutation,
  useGetShippingsQuery,
} from "@/redux/features/shipping/shippingApi";

import {
  Copy,
  Download,
  Eye,
  ImageOff,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const { data: shippingResponse, isLoading } = useGetShippingsQuery({
    status: [LOST_ITEM_STATUS.INTRANSIT],
    page,
    limit: 10,
  });

  console.log("shippingResponse", shippingResponse);

  const [deleteShippingItem] = useDeleteShippingItemMutation();

  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const handleDownloadLabel = async (url: string, id: string) => {
    if (!url) {
      toast.error("No label URL found");
      return;
    }

    // Resolve relative paths if necessary
    const fullUrl = getImageUrl(url);

    try {
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;

      // Determine file extension (default to png if not found)
      const extension = fullUrl.split(".").pop()?.split("?")[0] || "png";
      link.download = `shipping-label-${id}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadedIds((prev) => new Set(prev).add(id));
      toast.success("Label downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: try opening in new tab if CORS prevents fetch
      window.open(fullUrl, "_blank");
      setDownloadedIds((prev) => new Set(prev).add(id));
      toast.info("Opening label in new tab...");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteShippingItem(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "The item has been deleted.",
          icon: "success",
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err?.data?.message || "Failed to delete item",
          icon: "error",
        });
      }
    }
  };

  const shippings = shippingResponse?.data?.shippings || [];
  const meta = shippingResponse?.data?.meta;

  const filteredItems = useMemo(() => {
    return shippings.filter(
      (item: any) =>
        item.parcel?.[0]?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.address_to?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );
  }, [shippings, searchQuery]);

  const totalCount = meta?.total || 0;
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 ">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary"
              size={20}
            />
            <Input
              placeholder="Search lost items or guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 rounded-full text-primary placeholder:text-primary border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0   focus-visible:border-primary focus-visible:outline-none"
            />
          </div>
        </div>

        <Link href={"/dashboard/register-lost-ltem"}>
          <Button className="gap-2 rounded-full shadow-sm bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)]!">
            <Plus size={18} />
            <span>Register Lost Item</span>
          </Button>
        </Link>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Active Shipments ({totalCount})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="space-y-4 grid grid-cols-1 gap-1">
          {filteredItems.map((itemValue: any) => (
            <Card key={itemValue._id} className="py-0 p-2">
              <div className="flex lg:items-center gap-4 flex-col lg:flex-row">
                {/* Image */}
                {/* <div className="shrink-0">
                  <Image
                    src={getImageUrl(itemValue.parcel?.[0]?.image) || "/placeholder.svg"}
                    alt={itemValue.parcel?.[0]?.name || "Item"}
                    width={200}
                    height={200}
                    className="w-full lg:w-36 h-full rounded-lg object-cover"
                  />
                </div> */}
                <div className="shrink-0">
                  {itemValue.parcel?.[0]?.image &&
                  itemValue.parcel?.[0]?.image.length > 0 ? (
                    <Image
                      src={
                        getImageUrl(itemValue.parcel?.[0]?.image) ||
                        "/placeholder.svg"
                      }
                      alt={itemValue.parcel?.[0]?.name || "Item"}
                      width={200}
                      height={200}
                      className="w-full lg:w-28 h-28 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full lg:w-28 h-28 aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                      <ImageOff size={40} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {itemValue.parcel?.[0]?.name} #
                  </h3>
                  <div className="space-y-1 text-sm text-black mt-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <p className="font-semibold">
                          From:{" "}
                          <span className="font-normal text-black">
                            {itemValue.address_from?.city},{" "}
                            {itemValue.address_from?.countryName}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <p className="font-semibold">
                          To:{" "}
                          <span className="font-normal text-black">
                            {itemValue.address_to?.city},{" "}
                            {itemValue.address_to?.countryName}
                          </span>
                        </p>
                      </div>
                    </div>

                    {(itemValue.carrier || itemValue.tracking_id) && (
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
                        {itemValue.carrier && (
                          <div className="flex items-center gap-2">
                            <Truck size={16} />
                            <p className="font-semibold flex items-center gap-2">
                              Carrier:{" "}
                              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border border-blue-500 text-blue-600 bg-blue-50">
                                {itemValue.carrier}
                              </span>
                            </p>
                          </div>
                        )}
                        {itemValue.tracking_id && (
                          <div className="flex items-center gap-2">
                            <Copy size={14} className="text-gray-400" />
                            <p className="font-semibold flex items-center gap-2">
                              Tracking:{" "}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    itemValue.tracking_id,
                                  );
                                  toast.success("Tracking ID copied!");
                                }}
                                className="font-normal text-blue-600 hover:text-blue-800 flex items-center gap-1 group transition-colors"
                              >
                                {itemValue.tracking_id}
                                <Copy
                                  size={12}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                              </button>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 md:items-center md:justify-end flex-col md:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    className=" py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                    onClick={() => {
                      setSelectedItemId(itemValue._id);
                      setDetailsModal(true);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </Button>

                  {itemValue.status === "inTransit" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleDownloadLabel(
                          itemValue.shippingLabel,
                          itemValue._id,
                        )
                      }
                      className="py-4 lg:py-6 lg:px-4! rounded-xl transition-all bg-[linear-gradient(180deg,#1E2C47_0%,#0171D6_100%)] hover:bg-[linear-gradient(180deg,#0171D6_0%,#1E2C47_100%)]"
                    >
                      <Download className="hidden lg:inline" size={16} />
                      {downloadedIds.has(itemValue._id)
                        ? "Label Downloaded"
                        : "Download Label"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className=" py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                  >
                    {itemValue.status === "inTransit"
                      ? "In Transit"
                      : itemValue.status === "paymentCompleted"
                        ? "Payment Completed"
                        : itemValue.status === "paymentPending"
                          ? "Payment Pending"
                          : itemValue.status === "paymentFailed"
                            ? "Payment Failed"
                            : itemValue.status === "paymentFailed"
                              ? "Payment Failed"
                              : itemValue.status}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-500 hover:text-red-500!"
                        onClick={() => handleDelete(itemValue._id)}
                      >
                        <Trash2 className="text-red-500" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No shipments found</p>
        </div>
      )}

      <ShippingDetailsModal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        itemId={selectedItemId}
      />
    </div>
  );
}
