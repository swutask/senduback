"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AddPropertyFormModal } from "@/lib/modal/add-property-modal";
import PropertyModal from "@/lib/modal/PropertyModal";
import { cn, getImageUrl } from "@/lib/utils";
import {
  useDeletePropertyMutation,
  useGetMyPropertiesQuery,
} from "@/redux/features/property/propertyApi";
import { Edit, Eye, ImageOff, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsModal, setDetailsModal] = useState(false);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetMyPropertiesQuery({ page, limit });

  const [deleteProperty] = useDeletePropertyMutation();

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
        await deleteProperty(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "The property has been deleted.",
          icon: "success",
        });
      } catch (err: any) {
        Swal.fire({
          title: "Error!",
          text: err?.data?.message || "Failed to delete property",
          icon: "error",
        });
      }
    }
  };

  const properties = data?.data || [];
  const meta = data?.meta;
  const totalPages = meta?.totalPage || 1;

  const filteredItems = useMemo(() => {
    return properties.filter(
      (item: any) =>
        item?.propertyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item?.city?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [properties, searchQuery]);

  const activeCount = filteredItems.length;

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary"
              size={20}
            />
            <Input
              placeholder="Search properties by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 py-6 rounded-lg text-primary"
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setEditingPropertyId(null);
            setAddPropertyOpen(true);
          }}
          className="gap-2 rounded-full shadow-sm bg-[linear-gradient(180deg,#0094FC_0%,#016ACF_100%)] hover:bg-[linear-gradient(180deg,#016ACF_100%,#0094FC_0%)]!"
        >
          <Plus size={18} />
          <span>Add Property</span>
        </Button>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Properties ({activeCount})</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          <div className="space-y-4 grid grid-cols-2 lg:grid-cols-1 gap-2">
            {filteredItems?.map((item: any) => (
              <Card key={item?._id} className="py-0 p-2">
                <div className="flex lg:items-center gap-4 flex-col lg:flex-row">
                  <div className="shrink-0 border border-gray-100 rounded-lg">
                    {item?.propertyImage && item.propertyImage.length > 0 ? (
                      <Image
                        src={getImageUrl(item.propertyImage[0])}
                        alt={item.propertyName}
                        width={400}
                        height={400}
                        className="w-full lg:w-28 h-28 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-full lg:w-28 h-28 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <ImageOff size={40} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-[#4A5565]">
                    <div className="flex items-center gap-2">
                      <Badge className="rounded text-base ml-4 bg-gray-200 border border-gray-300 text-black">
                        {item?.propertyName}
                      </Badge>
                      {item.propertyType === "Default" && (
                        <Badge variant="outline">Default</Badge>
                      )}
                    </div>
                    <p className="text-lg font-medium ml-4">
                      {item?.city}, {item?.country}
                    </p>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 ml-4">
                      <Badge className="rounded text-base">
                        {item?.propertyType}
                      </Badge>
                      <span className="text-sm">
                        {item?.addressLine1} {item?.addressLine2}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap sm:flex-col-reverse md:flex-row md:items-center justify-end">
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
                      className="w-full md:w-auto py-4 lg:py-6 lg:px-4! gap-2"
                      onClick={() => {
                        setEditingPropertyId(item?._id);
                        setAddPropertyOpen(true);
                      }}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto py-4 lg:py-6 lg:px-4! gap-2 bg-red-500 text-white hover:bg-red-600 hover:text-white!"
                      onClick={() => handleDelete(item?._id)}
                    >
                      <Trash2 className="text-white" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No properties found</p>
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

      <PropertyModal
        open={detailsModal}
        onOpenChange={setDetailsModal}
        itemId={selectedItemId}
      />

      <AddPropertyFormModal
        open={addPropertyOpen}
        onOpenChange={setAddPropertyOpen}
        propertyId={editingPropertyId}
      />
    </div>
  );
}
