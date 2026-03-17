"use client";

import { useState } from "react";
import { useGetZonesQuery } from "@/redux/features/zone/zoneApi";
import {
  useGetZoneShipsQuery,
  useCreateZoneShipMutation,
  useDeleteZoneShipMutation,
} from "@/redux/features/zoneship/zoneShipApi";
import { toast } from "sonner";
import Swal from "sweetalert2";

import {
  Plus,
  Trash2,
  Eye,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Clock,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ZonePricePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedZoneShip, setSelectedZoneShip] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [fromZoneFilter, setFromZoneFilter] = useState<number | "">("");
  const [toZoneFilter, setToZoneFilter] = useState<number | "">("");
  const [shippingTypeFilter, setShippingTypeFilter] = useState<
    "express" | "standard" | ""
  >("");

  const [title, setTitle] = useState("");
  const [fromZone, setFromZone] = useState<number | "">("");
  const [toZone, setToZone] = useState<number | "">("");
  const [shippingType, setShippingType] = useState<"express" | "standard">(
    "standard",
  );
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: zonesData } = useGetZonesQuery({ page: 1, limit: 200 });
  const {
    data: zoneShipsData,
    isLoading,
    refetch,
  } = useGetZoneShipsQuery({
    page: currentPage,
    limit,
    ...(fromZoneFilter && { fromZone: fromZoneFilter }),
    ...(toZoneFilter && { toZone: toZoneFilter }),
    ...(shippingTypeFilter && { shippingType: shippingTypeFilter }),
  });

  const [createOrUpdateZoneShip, { isLoading: isSaving }] =
    useCreateZoneShipMutation();
  const [deleteZoneShip] = useDeleteZoneShipMutation();

  const zones = zonesData?.data?.data || [];
  const zoneShips = zoneShipsData?.data || [];
  const meta = zoneShipsData?.meta || { total: 0, totalPage: 1 };

  const zoneNumbers = Array.from<number>(
    new Set(zones.map((z: any) => Number(z.id || z.zoneNumber))) as Set<number>,
  ).sort((a, b) => a - b);

  const filteredZoneShips = zoneShips.filter((ship: any) =>
    [
      ship.title,
      ship.description,
      ship.duration,
      ship.price,
      ship.fromZone,
      ship.toZone,
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getZoneName = (zoneNumber: number) => {
    const zone = zones.find(
      (z: any) => Number(z.id || z.zoneNumber) === zoneNumber,
    );
    return zone?.name || `Zone ${zoneNumber}`;
  };

  const handleSave = async () => {
    try {
      await createOrUpdateZoneShip({
        title,
        fromZone: Number(fromZone),
        toZone: Number(toZone),
        shippingType,
        price: Number(price),
        duration,
        description,
        ...(isEditing && editingId && { id: editingId }),
      }).unwrap();

      toast.success(
        isEditing ? "Updated successfully" : "Created successfully",
      );
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete price?",
      text: `Delete "${title}" permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      await deleteZoneShip(id).unwrap();
      toast.success("Deleted");
      refetch();
    }
  };

  const resetForm = () => {
    setTitle("");
    setFromZone("");
    setToZone("");
    setShippingType("standard");
    setPrice("");
    setDuration("");
    setDescription("");
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="w-[92vw] md:w-[770px] lg:w-full mx-auto lg:mx-0">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Zone Pricing
        </h1>
        <p className="text-sm text-gray-600">
          Manage shipping prices between zones
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search by title, zone, price, duration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 flex flex-wrap gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                From Zone {fromZoneFilter || "All"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFromZoneFilter("")}>
                All
              </DropdownMenuItem>
              {zoneNumbers.map((z) => (
                <DropdownMenuItem key={z} onClick={() => setFromZoneFilter(z)}>
                  Zone {z}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                To Zone {toZoneFilter || "All"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setToZoneFilter("")}>
                All
              </DropdownMenuItem>
              {zoneNumbers.map((z) => (
                <DropdownMenuItem key={z} onClick={() => setToZoneFilter(z)}>
                  Zone {z}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {shippingTypeFilter || "All Types"}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShippingTypeFilter("")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShippingTypeFilter("standard")}
              >
                Standard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShippingTypeFilter("express")}
              >
                Express
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="ml-auto" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Price
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                {["Title", "Route", "Type", "Price", "Duration", "Actions"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="px-6 py-3 text-xs font-medium text-gray-500 uppercase"
                    >
                      {h}
                    </TableHead>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredZoneShips.map((ship: any) => (
                <TableRow key={ship._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 font-medium">
                    {ship.title}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    Zone {ship.fromZone} → Zone {ship.toZone}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ship.shippingType === "express"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {ship.shippingType}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <DollarSign className="inline w-4 h-4 text-gray-500 mr-1" />
                    {ship.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Clock className="inline w-4 h-4 text-gray-500 mr-1" />
                    {ship.duration}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedZoneShip(ship);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(true);
                          setEditingId(ship._id);
                          setTitle(ship.title);
                          setFromZone(ship.fromZone);
                          setToZone(ship.toZone);
                          setShippingType(ship.shippingType);
                          setPrice(ship.price);
                          setDuration(ship.duration);
                          setDescription(ship.description);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ship._id, ship.title)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex justify-between">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {meta.totalPage}
          </span>
          <Button
            variant="ghost"
            disabled={currentPage >= meta.totalPage}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Zone Price" : "Create Zone Price"}
            </DialogTitle>
            <DialogDescription>
              Set shipping price between zones
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={fromZone.toString()}
                onValueChange={(v) => setFromZone(Number(v))}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="From Zone" />
                </SelectTrigger>
                <SelectContent>
                  {zoneNumbers.map((z) => (
                    <SelectItem key={z} value={z.toString()}>
                      Zone {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={toZone.toString()}
                onValueChange={(v) => setToZone(Number(v))}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="To Zone" />
                </SelectTrigger>
                <SelectContent>
                  {zoneNumbers.map((z) => (
                    <SelectItem key={z} value={z.toString()}>
                      Zone {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select
              value={shippingType}
              onValueChange={(v: any) => setShippingType(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <Input
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button className="w-full" onClick={handleSave} disabled={isSaving}>
              {isEditing ? "Update Price" : "Create Price"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zone Price Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {selectedZoneShip?.title}
            </p>
            <p>
              <strong>Route:</strong> Zone {selectedZoneShip?.fromZone} → Zone{" "}
              {selectedZoneShip?.toZone}
            </p>
            <p>
              <strong>Type:</strong> {selectedZoneShip?.shippingType}
            </p>
            <p>
              <strong>Price:</strong> ${selectedZoneShip?.price}
            </p>
            <p>
              <strong>Duration:</strong> {selectedZoneShip?.duration}
            </p>
            <p>
              <strong>Description:</strong> {selectedZoneShip?.description}
            </p>
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
}
