"use client";

import { useState } from "react";
import {
  useGetZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
} from "@/redux/features/zone/zoneApi";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Edit,
  Check,
  X,
  Eye,
  Search,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { countriesList } from "@/utils/countryCodes";

const ZonesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewCountriesDialogOpen, setIsViewCountriesDialogOpen] =
    useState(false);
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedZoneForView, setSelectedZoneForView] = useState<any>(null);

  const [zoneName, setZoneName] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [countryFilter, setCountryFilter] = useState("");

  const {
    data: zonesData,
    isLoading,
    refetch,
  } = useGetZonesQuery({
    page: currentPage,
    limit,
    ...(countryFilter && { countries: countryFilter }),
  });

  const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
  const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();

  const zones = zonesData?.data?.data || [];
  const meta = zonesData?.data?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPage: 1,
  };

  const totalItems = meta.total;
  const totalPages = meta.totalPage;

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  const filteredCountries = countriesList.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const resetForm = () => {
    setZoneName("");
    setSelectedCountries([]);
    setCountrySearch("");
    setSelectedZoneId(null);
    setSelectedZoneForView(null);
    setIsCountrySelectorOpen(false);
  };

  const handleCreateZone = async () => {
    if (!zoneName.trim()) return toast.error("Zone name is required");
    if (selectedCountries.length === 0)
      return toast.error("Please select at least one country");

    try {
      await createZone({
        name: zoneName,
        countries: selectedCountries,
      }).unwrap();

      toast.success("Zone created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create zone");
    }
  };

  const handleEditZone = async () => {
    if (!selectedZoneId || !zoneName.trim()) return;
    if (selectedCountries.length === 0)
      return toast.error("Please select at least one country");

    try {
      await updateZone({
        id: selectedZoneId,
        zoneData: {
          name: zoneName,
          countries: selectedCountries,
        },
      }).unwrap();

      toast.success("Zone updated successfully");
      setIsEditDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update zone");
    }
  };

  const openEditDialog = (zone: any) => {
    setSelectedZoneId(zone.id);
    setZoneName(zone.name);
    setSelectedCountries(zone.countries);
    setIsEditDialogOpen(true);
  };

  const openViewCountriesDialog = (zone: any) => {
    setSelectedZoneForView(zone);
    setIsViewCountriesDialogOpen(true);
  };

  const toggleCountry = (code: string) => {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const removeCountry = (code: string) => {
    setSelectedCountries((prev) => prev.filter((c) => c !== code));
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        <p className="text-gray-600">Loading zones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[92vw] md:w-[770px] lg:w-full mx-auto lg:mx-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">🌍</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Zones</h1>
          </div>
          <p className="text-sm text-gray-600">
            Manage shipping zones and countries
          </p>
        </div>

        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Zone
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Zone</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Zone Name</Label>
                <Input
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Countries</Label>

                <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                  {selectedCountries.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No countries selected
                    </p>
                  ) : (
                    selectedCountries.map((code) => {
                      const country = countriesList.find(
                        (c) => c.code === code,
                      );
                      return (
                        <Badge
                          key={code}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {country?.code} ({country?.name})
                          <button onClick={() => removeCountry(code)}>
                            <XCircle className="w-3 h-3 ml-1" />
                          </button>
                        </Badge>
                      );
                    })
                  )}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCountrySelectorOpen(true)}
                >
                  Select Countries
                </Button>
              </div>

              <Button
                onClick={handleCreateZone}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isCreating ? "Creating..." : "Create Zone"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Filter by country code (e.g. PL)"
            className="pl-10"
            value={countryFilter}
            onChange={(e) => {
              setCountryFilter(e.target.value.toUpperCase());
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <Table className="">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Zone Name</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {zones.map((zone: any) => (
              <TableRow key={zone._id} className="hover:bg-gray-50">
                <TableCell>{zone.id}</TableCell>
                <TableCell className="font-medium">{zone.name}</TableCell>

                <TableCell>
                  <div className="flex  gap-1 max-w-md">
                    {zone.countries.slice(0, 5).map((c: string) => (
                      <span
                        key={c}
                        className="bg-gray-100 px-2 py-1 rounded text-xs"
                      >
                        {c}
                      </span>
                    ))}
                    {zone.countries.length > 5 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openViewCountriesDialog(zone)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      zone.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {zone.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>

                <TableCell>
                  {new Date(zone.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(zone)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ================= EDIT ZONE DIALOG ================= */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Zone</DialogTitle>
            <DialogDescription>
              Update zone name and countries
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Zone Name</Label>
              <Input
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Countries</Label>

              <div className="flex flex-wrap gap-2 min-h-10 p-2 border rounded-md">
                {selectedCountries.map((code) => {
                  const country = countriesList.find((c) => c.code === code);
                  return (
                    <Badge
                      key={code}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {country?.code} ({country?.name})
                      <button onClick={() => removeCountry(code)}>
                        <XCircle className="w-3 h-3 ml-1" />
                      </button>
                    </Badge>
                  );
                })}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsCountrySelectorOpen(true)}
              >
                Edit Countries ({selectedCountries.length} selected)
              </Button>
            </div>

            <Button
              onClick={handleEditZone}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? "Updating..." : "Update Zone"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ================= COUNTRY SELECTOR ================= */}
      <Dialog
        open={isCountrySelectorOpen}
        onOpenChange={setIsCountrySelectorOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Countries</DialogTitle>
            <DialogDescription>
              Choose countries for this zone
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search countries..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${
                    selectedCountries.includes(country.code)
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleCountry(country.code)}
                >
                  <Checkbox
                    checked={selectedCountries.includes(country.code)}
                  />
                  <div>
                    <div className="font-medium">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.code}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="flex justify-between w-full">
            <span className="text-sm text-gray-600">
              {selectedCountries.length} selected
            </span>
            <Button onClick={() => setIsCountrySelectorOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= VIEW COUNTRIES ================= */}
      <Dialog
        open={isViewCountriesDialogOpen}
        onOpenChange={setIsViewCountriesDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedZoneForView?.name} - Countries</DialogTitle>
            <DialogDescription>
              Total {selectedZoneForView?.countries.length} countries
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {selectedZoneForView?.countries.map((code: string) => (
              <Badge key={code} variant="outline">
                {code}
              </Badge>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZonesPage;
