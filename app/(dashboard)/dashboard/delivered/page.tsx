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
import ItemDetailsModal from "@/lib/modal/item-details-modal";
import { cn, getImageUrl } from "@/lib/utils";
import {
  LOST_ITEM_STATUS,
  useGetLostItemsQuery,
} from "@/redux/features/lostItem/lostitemApi";
import {
  Check,
  Download,
  Eye,
  ImageOff,
  MoreVertical,
  Search,
  Send,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function DeliveredCollectedPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useGetLostItemsQuery({
    status: LOST_ITEM_STATUS.DELIVERED,
    page,
    limit,
  });

  // console.log(" delivered",data);

  const lostItems = data?.data?.lostItems || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPage || 1;

  const filteredItems = useMemo(() => {
    return lostItems.filter((item: any) => {
      return (
        item?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.guestName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [lostItems, searchQuery]);

  const activeCount = filteredItems.length;

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary"
              size={20}
            />
            <Input
              placeholder="Search lost items or guest name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 rounded-lg text-primary"
            />
          </div>
        </div>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Active Delivered Items ({activeCount})
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div className="space-y-4 grid grid-cols-2 lg:grid-cols-1 gap-1">
            {filteredItems.map((item: any) => (
              <Card key={item._id} className="py-0 p-2">
                <div className="flex lg:items-center gap-4 flex-col lg:flex-row">
                  <div className="shrink-0">
                    {item?.images && item.images.length > 0 ? (
                      <Image
                        src={getImageUrl(item.images[0])}
                        alt={item.itemName}
                        width={400}
                        height={400}
                        className="w-full lg:w-28 h-28 rounded-lg object-cover object-center"
                      />
                    ) : (
                      <div className="w-full lg:w-28 h-28 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                        <ImageOff size={40} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item?.itemName}</h3>
                    <div className="space-y-1 text-sm text-black mt-2">
                      <p>
                        Status:{" "}
                        <span className="text-primary font-medium capitalize">
                          {item.status}
                        </span>
                      </p>
                      <p>
                        Guest:{" "}
                        <span className="font-medium">
                          {item?.guestName || "N/A"}
                        </span>
                      </p>
                      <p>
                        Location Found:{" "}
                        <span className="font-medium">
                          {item?.locationFound || "N/A"}
                        </span>
                      </p>
                      <p>
                        Date Found:{" "}
                        <span className="font-medium">
                          {item?.dateFound
                            ? new Date(item.dateFound).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:flex-col-reverse md:flex-row md:items-center justify-end">
                    {item.status === "delivered" && (
                      <Button
                        size="sm"
                        disabled
                        className="py-4 lg:py-6 lg:px-4! bg-[#00C950] text-white rounded-xl cursor-default disabled:opacity-100"
                      >
                        <span>Delivered</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                      onClick={() => {
                        setSelectedItemId(item?._id);
                        setDetailsModal(true);
                      }}
                    >
                      <Eye size={16} />
                      View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="py-4 lg:py-6 lg:px-4! bg-[linear-gradient(180deg,#1E2C47_0%,#0171D6_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#0171D6_0%,#1E2C47_100%)] text-white hover:text-white"
                    >
                      <Check className="hidden lg:block" size={16} />
                      Label Created
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="text-primary" /> Download Label
                          PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="text-primary" />
                          Resend Tracking Info
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:text-red-500!">
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No lost items found</p>
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
                      className={cn(
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer",
                      )}
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
                      className={cn(
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      <ItemDetailsModal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        itemId={selectedItemId}
      />
    </div>
  );
}
