"use client";

import { Badge } from "@/components/ui/badge";
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
import { SendCustomerLinkModal } from "@/lib/modal/send-customer-link-modal";
import { cn, getImageUrl } from "@/lib/utils";
import {
  LOST_ITEM_STATUS,
  useDeleteLostItemMutation,
  useGetLostItemsQuery,
  useMarkAsCollectedMutation,
  useSendLostItemEmailMutation,
} from "@/redux/features/lostItem/lostitemApi";
import {
  Calendar,
  Eye,
  ImageOff,
  LayoutGrid,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  SquarePen,
  Table2,
  Trash2,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

export function LostItemsPage() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendLinkModal, setSendLinkModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [detailsModal, setDetailsModal] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  // api
  const { data, isLoading: isLoadingRegistered } = useGetLostItemsQuery({
    status: [LOST_ITEM_STATUS.REGISTERED, LOST_ITEM_STATUS.LINKSENDED],
    page,
    limit,
  });

  console.log("data", data);

  const [deleteLostItem] = useDeleteLostItemMutation();
  const [sendLostItemEmail, { isLoading: isSendingEmail }] =
    useSendLostItemEmailMutation();
  const [markAsCollected] = useMarkAsCollectedMutation();

  const lostItems = data?.data?.lostItems || [];
  const meta = data?.data?.meta;
  const totalPages = meta?.totalPage || 1;

  const filteredItems = useMemo(() => {
    return lostItems.filter(
      (item: any) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.guestName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [lostItems, searchQuery]);

  const activeCount = filteredItems.length;

  const handleSendLink = (itemId: string) => {
    // console.log("itemId", itemId);
    setSelectedItemId(itemId);
    setSendLinkModal(true);
  };

  const handleSendLinkSubmit = async (email: string) => {
    if (!selectedItemId) return;

    try {
      await sendLostItemEmail({
        id: selectedItemId,
        emailData: { email },
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "The link has been sent to the guest.",
        icon: "success",
      });

      setSendLinkModal(false);
      setSelectedItemId(null);
    } catch (err: any) {
      Swal.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to send link",
        icon: "error",
      });
    }
  };

  const selectedItem = lostItems.find(
    (item: any) => item._id === selectedItemId,
  );

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
        await deleteLostItem(id).unwrap();
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

  const handleMarkAsCollected = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as collected!",
    });

    if (result.isConfirmed) {
      try {
        await markAsCollected(id).unwrap();
        Swal.fire({
          title: "Collected!",
          text: "The item has been marked as collected.",
          icon: "success",
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err?.data?.message || "Failed to mark as collected",
          icon: "error",
        });
      }
    }
  };

  const activeBtnClass =
    "bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] text-white hover:opacity-90";

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
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

        <div className="flex gap-2 items-center justify-between ">
          <div className="flex items-center justify-center shadow-sm rounded-full border">
            {/* Cards */}
            <Button
              size="sm"
              onClick={() => setViewMode("cards")}
              className={cn(
                "gap-2 rounded-l-full px-5! md:px-4! py-6 hover:text-white!",
                viewMode === "cards"
                  ? activeBtnClass
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid size={18} />
              <span className="hidden sm:inline">Cards</span>
            </Button>

            {/* Table */}
            <Button
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn(
                "gap-2 rounded-r-full px-5! md:px-4! py-6 hover:text-white!",
                viewMode === "table"
                  ? activeBtnClass
                  : "bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Table2 size={18} />
              <span className="hidden sm:inline">Table</span>
            </Button>
          </div>
          <Link href={"/dashboard/register-lost-ltem"}>
            <Button className="gap-2 rounded-full shadow-sm bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)]!">
              <Plus size={18} />
              <span>Register Lost Item</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Active Lost Items ({activeCount})
        </h2>
      </div>

      {/* Items Display */}
      {viewMode === "cards" ? (
        <div className="space-y-2 grid grid-cols-2 lg:grid-cols-1 gap-2">
          {filteredItems.map((item: any) => (
            <Card key={item._id} className="py-0 p-2">
              <div className="flex lg:items-center gap-4 flex-col lg:flex-row">
                {/* Image */}
                <div className="shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={getImageUrl(item?.images[0])}
                      alt={item.itemName}
                      width={200}
                      height={200}
                      className="w-full md:h-44 lg:w-28 h-28 rounded-lg object-cover "
                    />
                  ) : (
                    <div className="w-full md:h-44 lg:w-28 h-28 aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                      <ImageOff size={40} strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">
                    {item.itemName.length > 20
                      ? `${item.itemName.slice(0, 20)}...`
                      : item.itemName}
                  </h3>
                  <div className="space-y-1 text-sm text-black mt-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <p className="font-semibold">
                        Found at:{" "}
                        <span className="font-normal">
                          {item.locationFound}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <p className="font-semibold">
                        Found on:{" "}
                        <span className="font-normal">
                          {new Date(item.dateFound).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRound size={16} />
                      <p className="font-semibold">
                        Guest:{" "}
                        <span className="font-normal">{item.guestName}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 md:items-center md:justify-end flex-col md:flex-row">
                  {item.status === "collected" ? (
                    <Button
                      size="sm"
                      disabled
                      className="py-4 lg:py-6 lg:px-4! bg-green-600/20 text-green-700 rounded-xl cursor-default disabled:opacity-100"
                    >
                      <span>Collected</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsCollected(item._id)}
                      className="py-3 lg:py-6 lg:px-4! bg-[linear-gradient(180deg,#1E2C47_0%,#0171D6_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#0171D6_0%,#1E2C47_100%)]"
                    >
                      <span className="hidden lg:inline">
                        Mark as Collected
                      </span>
                      <span className="lg:hidden">Collected</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className=" py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                    onClick={() => {
                      setSelectedItemId(item._id);
                      setDetailsModal(true);
                    }}
                  >
                    <Eye size={16} />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className=" py-4 lg:py-6 lg:px-4! text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                    onClick={() => handleSendLink(item._id)}
                  >
                    <span className="hidden lg:inline">
                      {item.status === "registered"
                        ? "Send Customer Link"
                        : "Resend Link"}
                    </span>
                    <span className="lg:hidden">
                      {item.status === "registered" ? "Link" : "Resend"}
                    </span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/register-lost-ltem?id=${item._id}`}
                        >
                          <SquarePen className="text-primary" /> Edit item
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 hover:text-red-500!"
                        onClick={() => handleDelete(item._id)}
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
      ) : (
        /* Table View */
        <div className="w-full max-w-[91vw] md:max-w-[91vw] lg:max-w-[93vw]">
          <div className="rounded-lg border overflow-x-auto">
            <table className="min-w-max w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="px-4 py-3 text-left font-semibold">Photo</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold table-cell">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left font-semibold table-cell">
                    Found Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {filteredItems.map((item: any) => (
                  <tr key={item._id} className="border-b hover:bg-muted/50 ">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.images && item.images.length > 0 ? (
                          <Image
                            src={getImageUrl(item.images[0])}
                            alt={item.itemName}
                            width={200}
                            height={200}
                            className="w-28 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-28 h-24 aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-dashed">
                            <ImageOff size={24} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 table-cell">
                      <span className="font-bold">
                        {item.itemName.length > 14
                          ? `${item.itemName.slice(0, 14)}...`
                          : item.itemName}
                      </span>
                    </td>
                    <td className="px-4 py-3 table-cell">
                      {item.locationFound}
                    </td>
                    <td className="px-4 py-3 table-cell">{item.guestName}</td>
                    <td className="px-4 py-3 table-cell text-muted-foreground">
                      {new Date(item.dateFound).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 ">
                        {item.status === "linkSended" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsCollected(item._id)}
                            className=" py-4 lg:py-6 lg:px-4! bg-[linear-gradient(180deg,#1E2C47_0%,#0171D6_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#0171D6_0%,#1E2C47_100%)]"
                          >
                            <span className="hidden lg:inline">
                              Mark as Collected
                            </span>
                            <span className="lg:hidden">Collected</span>
                          </Button>
                        )}

                        {item.status === "collected" && (
                          <Button
                            size="sm"
                            disabled
                            className=" py-4 lg:py-6 lg:px-4! bg-green-600/20 text-green-700 rounded-xl cursor-default disabled:opacity-100"
                          >
                            <span>Collected</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className=" py-4 lg:py-6 lg:px-4! gap-1 text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                          onClick={() => {
                            setSelectedItemId(item._id);
                            setDetailsModal(true);
                          }}
                        >
                          <Eye size={16} />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className=" py-4 lg:py-6 lg:px-4! text-white bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] rounded-xl hover:bg-[linear-gradient(180deg,#016ACF_0%,#0094FC_100%)] hover:text-white!"
                          onClick={() => handleSendLink(item._id)}
                        >
                          <span className="hidden lg:inline">
                            {item.status === "registered"
                              ? "Send Customer Link"
                              : "Resend Link"}
                          </span>
                          <span className="lg:hidden">
                            {item.status === "registered" ? "Link" : "Resend"}
                          </span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/register-lost-ltem?id=${item._id}`}
                              >
                                <SquarePen className="text-primary" /> Edit item
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500 hover:text-red-500!"
                              onClick={() => handleDelete(item._id)}
                            >
                              <Trash2 className="text-red-500" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No lost items found</p>
        </div>
      )}

      <ItemDetailsModal
        open={detailsModal}
        onClose={() => setDetailsModal(false)}
        itemId={selectedItemId}
      />

      <SendCustomerLinkModal
        open={sendLinkModal}
        onOpenChange={setSendLinkModal}
        onSubmit={handleSendLinkSubmit}
        isLoading={isSendingEmail}
        defaultEmail={selectedItem?.guestEmail || ""}
      />

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
                // Simple version: show all page numbers if totalPages is small
                // For larger totalPages, you might want to add ellipses logic
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
    </div>
  );
}
