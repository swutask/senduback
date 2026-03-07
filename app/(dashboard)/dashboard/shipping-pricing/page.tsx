"use client";
import { useState, useEffect } from "react";
import { useGetZonesQuery } from "@/redux/features/zone/zoneApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  X,
  Edit,
} from "lucide-react";
import {
  useGetZoneShipsQuery,
  useCreateZoneShipMutation,
  useDeleteZoneShipMutation,
} from "@/redux/features/zoneship/zoneShipApi";
import Swal from "sweetalert2";

const ZonePricePage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedZoneShip, setSelectedZoneShip] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Filter states
  const [fromZoneFilter, setFromZoneFilter] = useState<number | "">("");
  const [toZoneFilter, setToZoneFilter] = useState<number | "">("");
  const [shippingTypeFilter, setShippingTypeFilter] = useState<
    "express" | "standard" | ""
  >("");

  // Form states for create/edit (single form for both)
  const [title, setTitle] = useState("");
  const [fromZone, setFromZone] = useState<number | "">("");
  const [toZone, setToZone] = useState<number | "">("");
  const [shippingType, setShippingType] = useState<"express" | "standard">(
    "standard",
  );
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  // Track if we're editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // API hooks with pagination and filters
  const { data: zonesData, isLoading: isLoadingZones } = useGetZonesQuery({
    page: 1,
    limit: 200,
  });

  const {
    data: zoneShipsData,
    isLoading: isLoadingZoneShips,
    refetch,
  } = useGetZoneShipsQuery({
    page: currentPage,
    limit,
    ...(fromZoneFilter && { fromZone: fromZoneFilter }),
    ...(toZoneFilter && { toZone: toZoneFilter }),
    ...(shippingTypeFilter && { shippingType: shippingTypeFilter }),
  });

  const [createOrUpdateZoneShip, { isLoading: isCreatingOrUpdating }] =
    useCreateZoneShipMutation();
  const [deleteZoneShip, { isLoading: isDeleting }] =
    useDeleteZoneShipMutation();

  const zones = zonesData?.data?.data || [];
  const zoneShips = zoneShipsData?.data || [];
  const meta = zoneShipsData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };
  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  // Calculate indexes for showing results
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  // Get available zone numbers
  const zoneNumbers: number[] = [];

  zones.forEach((zone: any) => {
    const zoneNum = zone.id || zone.zoneNumber;
    if (zoneNum) {
      const num = Number(zoneNum);
      if (!isNaN(num) && !zoneNumbers.includes(num)) {
        zoneNumbers.push(num);
      }
    }
  });

  // Sort the array
  zoneNumbers.sort((a, b) => a - b);

  // Filter zone ships based on search
  const filteredZoneShips = zoneShips.filter((ship: any) => {
    const title = ship?.title || "";
    const description = ship?.description || "";
    const duration = ship?.duration || "";
    const price = ship?.price?.toString() || "";
    const fromZone = ship?.fromZone?.toString() || "";
    const toZone = ship?.toZone?.toString() || "";

    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.includes(searchQuery) ||
      fromZone.includes(searchQuery) ||
      toZone.includes(searchQuery)
    );
  });

  // Handle create or update zone ship (uses same API)
  const handleCreateOrUpdateZoneShip = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (fromZone === "" || toZone === "") {
      toast.error("Please select both from and to zones");
      return;
    }

    if (price === "" || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!duration.trim()) {
      toast.error("Duration is required");
      return;
    }

    try {
      const payload = {
        title,
        fromZone: Number(fromZone),
        toZone: Number(toZone),
        shippingType,
        price: Number(price),
        duration,
        description,
        // Include ID if editing (for POST API that handles upsert)
        ...(isEditing && editingId && { id: editingId }),
      };

      await createOrUpdateZoneShip(payload).unwrap();

      toast.success(
        isEditing
          ? "Zone price updated successfully"
          : "Zone price created successfully",
      );
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (isEditing
            ? "Failed to update zone price"
            : "Failed to create zone price"),
      );
    }
  };

  // Handle delete zone ship with SweetAlert2
  const handleDeleteZoneShip = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${title}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteZoneShip(id).unwrap();
        toast.success("Zone price deleted successfully");
        refetch();

        Swal.fire({
          title: "Deleted!",
          text: "The zone price has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete zone price");
        Swal.fire({
          title: "Error!",
          text: error?.data?.message || "Failed to delete zone price",
          icon: "error",
        });
      }
    }
  };

  // Open edit dialog
  const openEditDialog = (zoneShip: any) => {
    setIsEditing(true);
    setEditingId(zoneShip._id);
    setTitle(zoneShip.title);
    setFromZone(zoneShip.fromZone);
    setToZone(zoneShip.toZone);
    setShippingType(zoneShip.shippingType);
    setPrice(zoneShip.price);
    setDuration(zoneShip.duration);
    setDescription(zoneShip.description || "");
    setIsDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
    setIsDialogOpen(true);
  };

  // Open view dialog
  const openViewDialog = (zoneShip: any) => {
    setSelectedZoneShip(zoneShip);
    setIsViewDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setFromZone("");
    setToZone("");
    setShippingType("standard");
    setPrice("");
    setDuration("");
    setDescription("");
  };

  // Reset filters
  const resetFilters = () => {
    setFromZoneFilter("");
    setToZoneFilter("");
    setShippingTypeFilter("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Get zone name by number
  const getZoneName = (zoneNumber: number) => {
    const zone = zones.find((z: any) => {
      const zoneId = z.id || z.zoneNumber;
      return Number(zoneId) === zoneNumber;
    });
    return zone ? zone.name : `Zone ${zoneNumber}`;
  };

  // Handle page change
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
    setCurrentPage(page);
  };

  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfVisible + 1) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Check if any filter is active
  const isFilterActive =
    fromZoneFilter || toZoneFilter || shippingTypeFilter || searchQuery;

  const pageNumbers = generatePageNumbers();

  if (isLoadingZones || isLoadingZoneShips) {
    return (
      <div className="min-h-screen p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Zone Pricing</h1>
          <p className="text-[#7C8493] text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#25324B]">Zone Pricing</h1>
            <p className="text-[#7C8493] text-lg">
              Manage shipping prices between zones
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Create Button - uses same dialog */}
            <Button
              className="bg-[#0096FF] hover:bg-blue-600"
              onClick={openCreateDialog}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Price
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From Zone Filter */}
              <div className="space-y-2">
                <Label htmlFor="fromZoneFilter">From Zone</Label>
                <Select
                  value={
                    fromZoneFilter === "" ? "all" : fromZoneFilter.toString()
                  }
                  onValueChange={(value) => {
                    setFromZoneFilter(value === "all" ? "" : Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All from zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All from zones</SelectItem>
                    {zoneNumbers.map((zoneNum: number) => (
                      <SelectItem
                        key={`filter-from-${zoneNum}`}
                        value={zoneNum.toString()}
                      >
                        Zone {zoneNum} - {getZoneName(zoneNum)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Zone Filter */}
              <div className="space-y-2">
                <Label htmlFor="toZoneFilter">To Zone</Label>
                <Select
                  value={toZoneFilter === "" ? "all" : toZoneFilter.toString()}
                  onValueChange={(value) => {
                    setToZoneFilter(value === "all" ? "" : Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All to zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All to zones</SelectItem>
                    {zoneNumbers.map((zoneNum: number) => (
                      <SelectItem
                        key={`filter-to-${zoneNum}`}
                        value={zoneNum.toString()}
                      >
                        Zone {zoneNum} - {getZoneName(zoneNum)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shipping Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="shippingTypeFilter">Shipping Type</Label>
                <Select
                  value={shippingTypeFilter === "" ? "all" : shippingTypeFilter}
                  onValueChange={(value: "express" | "standard" | "all") => {
                    setShippingTypeFilter(value === "all" ? "" : value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search zone prices..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {isFilterActive && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {fromZoneFilter && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      From: Zone {fromZoneFilter}
                      <button
                        type="button"
                        onClick={() => setFromZoneFilter("")}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {toZoneFilter && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      To: Zone {toZoneFilter}
                      <button
                        type="button"
                        onClick={() => setToZoneFilter("")}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {shippingTypeFilter && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Type:{" "}
                      {shippingTypeFilter.charAt(0).toUpperCase() +
                        shippingTypeFilter.slice(1)}
                      <button
                        type="button"
                        onClick={() => setShippingTypeFilter("")}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      Search: {searchQuery}
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Zone Prices Table */}
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              All Zone Prices
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {isFilterActive ? "Filtered results - " : ""}
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} results
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EAEAEA]">
                    <TableHead className="font-bold text-gray-600">
                      Title
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Route
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Type
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Price
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Duration
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Created
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredZoneShips.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        {isFilterActive
                          ? "No matching zone prices found with current filters"
                          : "No zone prices found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredZoneShips.map((ship: any) => (
                      <TableRow key={ship._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium max-w-xs truncate">
                          {ship.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="px-2">
                              Zone {ship.fromZone}
                            </Badge>
                            <span className="text-gray-400">→</span>
                            <Badge variant="outline" className="px-2">
                              Zone {ship.toZone}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ship.shippingType === "express"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            }
                          >
                            {ship.shippingType.charAt(0).toUpperCase() +
                              ship.shippingType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-gray-500" />
                            <span className="font-semibold">
                              {ship.price.toFixed(2)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span>{ship.duration}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(ship.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openViewDialog(ship)}
                              className="h-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(ship)}
                              className="h-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteZoneShip(ship._id, ship.title)
                              }
                              className="h-8"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)}{" "}
                  of {totalItems} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-[#3A3A3A] hover:bg-gray-100"}`}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  {/* Page Numbers with Ellipsis */}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Zone Price Dialog (Single dialog for both) */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setIsEditing(false);
            setEditingId(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Zone Price" : "Create Zone Price"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Update shipping price for Zone ${fromZone} to Zone ${toZone}`
                : "Set shipping prices between zones"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Express shipping from Zone 1 to Zone 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromZone">From Zone *</Label>
                <Select
                  value={fromZone.toString()}
                  onValueChange={(value) =>
                    setFromZone(value ? Number(value) : "")
                  }
                  disabled={isEditing} // Disable zone selection in edit mode
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zoneNumbers.map((zoneNum: number) => (
                      <SelectItem
                        key={`from-${zoneNum}`}
                        value={zoneNum.toString()}
                      >
                        {zoneNum} - {getZoneName(zoneNum)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isEditing && (
                  <p className="text-xs text-gray-500">
                    Zone route cannot be changed after creation
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toZone">To Zone *</Label>
                <Select
                  value={toZone.toString()}
                  onValueChange={(value) =>
                    setToZone(value ? Number(value) : "")
                  }
                  disabled={isEditing} // Disable zone selection in edit mode
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zoneNumbers.map((zoneNum: number) => (
                      <SelectItem
                        key={`to-${zoneNum}`}
                        value={zoneNum.toString()}
                      >
                        {zoneNum} - {getZoneName(zoneNum)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingType">Shipping Type *</Label>
                <Select
                  value={shippingType}
                  onValueChange={(value: "express" | "standard") =>
                    setShippingType(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value ? Number(e.target.value) : "")
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="duration"
                  placeholder="e.g., 1-3 days, 2-5 business days"
                  className="pl-10"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the shipping service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleCreateOrUpdateZoneShip}
              className="w-full bg-[#0096FF] hover:bg-blue-600"
              disabled={isCreatingOrUpdating}
            >
              {isCreatingOrUpdating
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Zone Price"
                  : "Create Zone Price"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Zone Ship Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Zone Price Details</DialogTitle>
            <DialogDescription>
              Shipping from Zone {selectedZoneShip?.fromZone} to Zone{" "}
              {selectedZoneShip?.toZone}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-gray-500">Title</Label>
              <p className="text-lg font-semibold">{selectedZoneShip?.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-500">From Zone</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1 text-base">
                    Zone {selectedZoneShip?.fromZone}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {getZoneName(Number(selectedZoneShip?.fromZone))}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-500">To Zone</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1 text-base">
                    Zone {selectedZoneShip?.toZone}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {getZoneName(Number(selectedZoneShip?.toZone))}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-500">Shipping Type</Label>
                <Badge
                  className={
                    selectedZoneShip?.shippingType === "express"
                      ? "bg-green-100 text-green-800 text-base py-1 px-3"
                      : "bg-blue-100 text-blue-800 text-base py-1 px-3"
                  }
                >
                  {selectedZoneShip?.shippingType?.charAt(0).toUpperCase() +
                    selectedZoneShip?.shippingType?.slice(1)}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-500">Price</Label>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-gray-700" />
                  <span className="text-2xl font-bold">
                    {selectedZoneShip?.price?.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-500">Duration</Label>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-gray-700" />
                  <span className="text-lg font-semibold">
                    {selectedZoneShip?.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-500">Description</Label>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{selectedZoneShip?.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-gray-500">Created</Label>
                <p>{new Date(selectedZoneShip?.createdAt).toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-500">Last Updated</Label>
                <p>{new Date(selectedZoneShip?.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZonePricePage;
