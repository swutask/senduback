"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AddPropertyFormModal } from "@/lib/modal/add-property-modal";
import { PropertyDetailView } from "@/lib/modal/property-detail-view";
import { getImageUrl } from "@/lib/utils";
import {
  useDeletePropertyMutation,
  useGetUserPropertiesQuery,
} from "@/redux/features/property/propertyApi";
import { ChevronRight, MoreVertical, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function BusinessPropertiesPage() {
  const params = useParams();
  console.log(params);
  const userId = params["manage-properties"];

  const {
    data: response,
    isLoading,
    error,
  } = useGetUserPropertiesQuery(userId as string);

  const [deleteProperty] = useDeletePropertyMutation();

  // Extract properties from API response
  const properties = response?.data || [];
  const meta = response?.meta || { total: 0, page: 1, totalPage: 1, limit: 10 };

  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null,
  );
  const [viewPropertyOpen, setViewPropertyOpen] = useState(false);
  const [selectedViewPropertyId, setSelectedViewPropertyId] = useState<
    string | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property: any) =>
      property.propertyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.addressLine1?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSetDefault = (propertyId: string) => {
    // TODO: Implement set default API call
    console.log("Set default property:", propertyId);
  };

  const handleDelete = async (propertyId: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteProperty(propertyId).unwrap();
        Swal.fire("Deleted!", "Property has been deleted.", "success");
      }
    } catch (error) {
      console.error("Delete property error:", error);
      toast.error("Failed to delete property");
    }
  };

  // Get first property for display (if available)
  const firstProperty = properties[0];
  const businessName = firstProperty?.propertyName || "Business";

  return (
    <div className="min-h-full">
      {/* Breadcrumb */}
      <div className="mb-3 md:mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <button className="hover:text-gray-700">Businesses</button>
          <ChevronRight className="size-4" />
          <span className="text-gray-900">{businessName}</span>
          <ChevronRight className="size-4" />
          <span className="text-gray-900">Properties</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Properties — {businessName}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage all properties linked to this business
        </p>
      </div>

      {/* Search + Add */}
      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex-1 w-full md:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search properties by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            className=" bg-primary hover:bg-blue-700 gap-2"
            onClick={() => {
              setEditingPropertyId(null);
              setAddPropertyOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add Property
          </Button>
        </div>
      </div>

      {/* properties card and table */}
      <div className="overflow-x-scroll lg:overflow-x-hidden">
        {/* Business Card */}
        {firstProperty && (
          <div className="bg-white rounded-lg p-3 md:p-6 mb-6 border border-red-200 ">
            <div className="flex items-start gap-4">
              <div className="size-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {firstProperty.propertyImage &&
                firstProperty.propertyImage.length > 0 ? (
                  <Image
                    src={getImageUrl(firstProperty.propertyImage[0])}
                    className="size-16 rounded-lg object-cover"
                    alt={firstProperty.propertyName}
                    width={200}
                    height={200}
                  />
                ) : (
                  <span className="text-2xl">🏢</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold">
                    {firstProperty.propertyName}
                  </h2>
                  <Badge className="bg-gray-100 text-gray-700">
                    {firstProperty.propertyType}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-700">
                    {firstProperty.city}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Properties</span>
                    <Badge variant="outline">{meta.total}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Country</span>
                    <Badge variant="outline">{firstProperty.country}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Postcode</span>
                    <Badge variant="outline">{firstProperty.postcode}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-3 md:px-6 py-3 border-b bg-gray-50 text-xs text-gray-500">
            Rows per page: {meta.limit} | Total: {meta.total}
          </div>

          {isLoading ? (
            <div className="px-3 md:px-6 py-12 text-center text-gray-500">
              Loading properties...
            </div>
          ) : (
            <div className="divide-y">
              {filteredProperties.map((property: any) => (
                <div
                  key={property._id}
                  className="px-3 md:px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                      {property.propertyImage &&
                      property.propertyImage.length > 0 ? (
                        <Image
                          src={getImageUrl(property.propertyImage[0])}
                          className="size-16 rounded object-cover"
                          alt={property.propertyName}
                          width={200}
                          height={200}
                        />
                      ) : (
                        <span className="text-2xl">🏢</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium">{property.propertyName}</h3>
                        <Badge className="bg-gray-100 text-gray-700 text-xs">
                          {property.propertyType}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{property.city}</span>
                        <span>{property.country}</span>
                        <span className="text-xs text-gray-500">
                          {property.contactEmail}
                        </span>
                        <span className="text-xs text-gray-500">
                          {property.contactPhone}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        {property.postcode}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {property._id?.slice(-8)}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedViewPropertyId(property._id);
                            setViewPropertyOpen(true);
                          }}
                        >
                          View Property
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(property._id)}
                        >
                          Delete Property
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AddPropertyFormModal
            open={addPropertyOpen}
            onOpenChange={setAddPropertyOpen}
            propertyId={editingPropertyId}
            userId={userId as string}
          />

          {selectedViewPropertyId && (
            <PropertyDetailView
              propertyId={selectedViewPropertyId}
              onClose={() => {
                setViewPropertyOpen(false);
                setSelectedViewPropertyId(null);
              }}
            />
          )}

          {!isLoading && filteredProperties.length === 0 && (
            <div className="px-3 md:px-6 py-12 text-center text-gray-500">
              {searchQuery
                ? "No properties found matching your search"
                : "No properties found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
