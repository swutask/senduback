// "use client";
// import { useState, useEffect } from "react";
// import { useGetZonesQuery, useCreateZoneMutation, useUpdateZoneMutation } from "@/redux/features/zone/zoneApi";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Edit, Check, X, Eye, Search, XCircle } from "lucide-react";
// import { countriesList } from "@/utils/countryCodes";

// // List of all ISO country codes and names

// const ZonesPage = () => {
//     const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [isViewCountriesDialogOpen, setIsViewCountriesDialogOpen] = useState(false);
//     const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
//     const [selectedZoneForView, setSelectedZoneForView] = useState<any>(null);

//     // Form states
//     const [zoneName, setZoneName] = useState("");
//     const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

//     // API hooks
//     const {
//         data: zonesData,
//         isLoading,
//         refetch,
//     } = useGetZonesQuery({
//         page: 1,
//         limit: 20,
//     });

//     const [createZone, { isLoading: isCreating }] = useCreateZoneMutation();
//     const [updateZone, { isLoading: isUpdating }] = useUpdateZoneMutation();
//     console.log(zonesData);

//     const zones = zonesData?.data?.data || [];

//     // Filter countries based on search
//     const filteredCountries = countriesList.filter((country) => country.name.toLowerCase().includes(searchQuery.toLowerCase()) || country.code.toLowerCase().includes(searchQuery.toLowerCase()));

//     // Handle create zone
//     const handleCreateZone = async () => {
//         if (!zoneName.trim()) {
//             toast.error("Zone name is required");
//             return;
//         }

//         if (selectedCountries.length === 0) {
//             toast.error("Please select at least one country");
//             return;
//         }

//         try {
//             await createZone({
//                 name: zoneName,
//                 countries: selectedCountries,
//             }).unwrap();

//             toast.success("Zone created successfully");
//             setIsCreateDialogOpen(false);
//             resetForm();
//             refetch();
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Failed to create zone");
//         }
//     };

//     // Handle edit zone
//     const handleEditZone = async () => {
//         if (!selectedZoneId || !zoneName.trim()) return;

//         if (selectedCountries.length === 0) {
//             toast.error("Please select at least one country");
//             return;
//         }

//         try {
//             await updateZone({
//                 id: selectedZoneId,
//                 zoneData: {
//                     name: zoneName,
//                     countries: selectedCountries,
//                 },
//             }).unwrap();

//             toast.success("Zone updated successfully");
//             setIsEditDialogOpen(false);
//             resetForm();
//             refetch();
//         } catch (error: any) {
//             toast.error(error?.data?.message || "Failed to update zone");
//         }
//     };

//     // Open edit dialog
//     const openEditDialog = (zone: any) => {
//         setSelectedZoneId(zone.id);
//         setZoneName(zone.name);
//         setSelectedCountries(zone.countries);
//         setIsEditDialogOpen(true);
//     };

//     // Open view countries dialog
//     const openViewCountriesDialog = (zone: any) => {
//         setSelectedZoneForView(zone);
//         setIsViewCountriesDialogOpen(true);
//     };

//     // Toggle country selection
//     const toggleCountry = (countryCode: string) => {
//         setSelectedCountries((prev) => (prev.includes(countryCode) ? prev.filter((code) => code !== countryCode) : [...prev, countryCode]));
//     };

//     // Remove selected country - FIXED FUNCTION
//     const removeCountry = (countryCode: string) => {
//         setSelectedCountries((prev) => prev.filter((code) => code !== countryCode));
//     };

//     // Reset form
//     const resetForm = () => {
//         setZoneName("");
//         setSelectedCountries([]);
//         setSearchQuery("");
//         setSelectedZoneId(null);
//         setSelectedZoneForView(null);
//         setIsCountrySelectorOpen(false);
//     };

//     // Close all dialogs and reset form
//     const closeAllDialogs = () => {
//         setIsCreateDialogOpen(false);
//         setIsEditDialogOpen(false);
//         resetForm();
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen p-6">
//                 <div className="space-y-2">
//                     <h1 className="text-3xl font-bold text-[#25324B]">Zones</h1>
//                     <p className="text-[#7C8493] text-lg">Loading zones...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen p-6">
//             <div className="space-y-6">
//                 {/* Header */}
//                 <div className="flex justify-between items-center">
//                     <div className="space-y-2">
//                         <h1 className="text-3xl font-bold text-[#25324B]">Zones</h1>
//                         <p className="text-[#7C8493] text-lg">Manage shipping zones and countries</p>
//                     </div>

//                     <Dialog
//                         open={isCreateDialogOpen}
//                         onOpenChange={(open) => {
//                             setIsCreateDialogOpen(open);
//                             if (!open) resetForm();
//                         }}
//                     >
//                         <DialogTrigger asChild>
//                             <Button className="bg-[#0096FF] hover:bg-blue-600">
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 Create New Zone
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-2xl">
//                             <DialogHeader>
//                                 <DialogTitle>Create New Zone</DialogTitle>
//                             </DialogHeader>
//                             <div className="space-y-4 py-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="zoneName">Zone Name</Label>
//                                     <Input id="zoneName" placeholder="e.g., Europe Near" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label>Select Countries</Label>

//                                     {/* Selected countries display - FIXED */}
//                                     <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border rounded-md">
//                                         {selectedCountries.length === 0 ? (
//                                             <p className="text-gray-500 text-sm">No countries selected</p>
//                                         ) : (
//                                             selectedCountries.map((countryCode) => {
//                                                 const country = countriesList.find((c) => c.code === countryCode);
//                                                 return (
//                                                     <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
//                                                         {country?.code} ({country?.name})
//                                                         <button
//                                                             type="button"
//                                                             className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
//                                                             onClick={(e) => {
//                                                                 e.preventDefault();
//                                                                 e.stopPropagation();
//                                                                 removeCountry(countryCode);
//                                                             }}
//                                                         >
//                                                             <XCircle className="h-3 w-3" />
//                                                         </button>
//                                                     </Badge>
//                                                 );
//                                             })
//                                         )}
//                                     </div>

//                                     {/* Country selector button */}
//                                     <Button type="button" variant="outline" className="w-full" onClick={() => setIsCountrySelectorOpen(true)}>
//                                         {selectedCountries.length === 0 ? "Select Countries" : `Edit Countries (${selectedCountries.length} selected)`}
//                                     </Button>

//                                     <p className="text-xs text-gray-500">Selected {selectedCountries.length} countries</p>
//                                 </div>

//                                 <Button onClick={handleCreateZone} className="w-full bg-[#0096FF] hover:bg-blue-600" disabled={isCreating}>
//                                     {isCreating ? "Creating..." : "Create Zone"}
//                                 </Button>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>

//                 {/* Zones Table */}
//                 <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
//                     <CardHeader>
//                         <CardTitle className="text-xl font-semibold text-gray-900">All Zones</CardTitle>
//                         <p className="text-sm text-gray-600 mt-1">Total {zones.length} zones configured</p>
//                     </CardHeader>
//                     <CardContent>
//                         <div className="overflow-x-auto">
//                             <Table>
//                                 <TableHeader>
//                                     <TableRow className="bg-[#EAEAEA]">
//                                         <TableHead className="font-bold text-gray-600">ID</TableHead>
//                                         <TableHead className="font-bold text-gray-600">Zone Name</TableHead>
//                                         <TableHead className="font-bold text-gray-600">Countries</TableHead>
//                                         <TableHead className="font-bold text-gray-600">Status</TableHead>
//                                         <TableHead className="font-bold text-gray-600">Created</TableHead>
//                                         <TableHead className="font-bold text-gray-600">Actions</TableHead>
//                                     </TableRow>
//                                 </TableHeader>
//                                 <TableBody>
//                                     {zones.map((zone: any) => (
//                                         <TableRow key={zone._id} className="hover:bg-gray-50">
//                                             <TableCell className="font-medium">{zone.id}</TableCell>
//                                             <TableCell>{zone.name}</TableCell>
//                                             <TableCell>
//                                                 <div className="flex flex-wrap gap-1 max-w-md">
//                                                     {zone.countries.slice(0, 5).map((country: string) => (
//                                                         <span key={country} className="bg-gray-100 px-2 py-1 rounded text-xs">
//                                                             {country}
//                                                         </span>
//                                                     ))}
//                                                     {zone.countries.length > 5 && (
//                                                         <div className="flex items-center gap-1">
//                                                             <span className="text-gray-500 text-xs">+{zone.countries.length - 5} more</span>
//                                                             <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => openViewCountriesDialog(zone)}>
//                                                                 <Eye className="h-3 w-3" />
//                                                             </Button>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${zone.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//                                                     {zone.isActive ? (
//                                                         <>
//                                                             <Check className="h-3 w-3 mr-1" />
//                                                             Active
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <X className="h-3 w-3 mr-1" />
//                                                             Inactive
//                                                         </>
//                                                     )}
//                                                 </span>
//                                             </TableCell>
//                                             <TableCell>{new Date(zone.createdAt).toLocaleDateString()}</TableCell>
//                                             <TableCell>
//                                                 <Button variant="outline" size="sm" onClick={() => openEditDialog(zone)} className="h-8 mr-2">
//                                                     <Edit className="h-4 w-4 mr-2" />
//                                                     Edit
//                                                 </Button>
//                                                 {zone.countries.length > 5 && (
//                                                     <Button variant="ghost" size="sm" onClick={() => openViewCountriesDialog(zone)} className="h-8">
//                                                         <Eye className="h-4 w-4" />
//                                                     </Button>
//                                                 )}
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Edit Zone Dialog */}
//             <Dialog
//                 open={isEditDialogOpen}
//                 onOpenChange={(open) => {
//                     setIsEditDialogOpen(open);
//                     if (!open) resetForm();
//                 }}
//             >
//                 <DialogContent className="max-w-2xl">
//                     <DialogHeader>
//                         <DialogTitle>Edit Zone</DialogTitle>
//                     </DialogHeader>
//                     <div className="space-y-4 py-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="editZoneName">Zone Name</Label>
//                             <Input id="editZoneName" value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
//                         </div>

//                         <div className="space-y-2">
//                             <Label>Select Countries</Label>

//                             {/* Selected countries display - FIXED */}
//                             <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border rounded-md">
//                                 {selectedCountries.length === 0 ? (
//                                     <p className="text-gray-500 text-sm">No countries selected</p>
//                                 ) : (
//                                     selectedCountries.map((countryCode) => {
//                                         const country = countriesList.find((c) => c.code === countryCode);
//                                         return (
//                                             <Badge key={countryCode} variant="secondary" className="flex items-center gap-1">
//                                                 {country?.code} ({country?.name})
//                                                 <button
//                                                     type="button"
//                                                     className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
//                                                     onClick={(e) => {
//                                                         e.preventDefault();
//                                                         e.stopPropagation();
//                                                         removeCountry(countryCode);
//                                                     }}
//                                                 >
//                                                     <XCircle className="h-3 w-3" />
//                                                 </button>
//                                             </Badge>
//                                         );
//                                     })
//                                 )}
//                             </div>

//                             {/* Country selector button */}
//                             <Button type="button" variant="outline" className="w-full" onClick={() => setIsCountrySelectorOpen(true)}>
//                                 {selectedCountries.length === 0 ? "Select Countries" : `Edit Countries (${selectedCountries.length} selected)`}
//                             </Button>

//                             <p className="text-xs text-gray-500">Selected {selectedCountries.length} countries</p>
//                         </div>

//                         <Button onClick={handleEditZone} className="w-full bg-[#0096FF] hover:bg-blue-600" disabled={isUpdating}>
//                             {isUpdating ? "Updating..." : "Update Zone"}
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             {/* Country Selector Dialog */}
//             <Dialog open={isCountrySelectorOpen} onOpenChange={setIsCountrySelectorOpen}>
//                 <DialogContent className="max-w-3xl max-h-[80vh]">
//                     <DialogHeader>
//                         <DialogTitle>Select Countries</DialogTitle>
//                         <DialogDescription>Choose countries to include in this zone</DialogDescription>
//                     </DialogHeader>

//                     {/* Search */}
//                     <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                         <Input placeholder="Search countries by name or code..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                     </div>

//                     <ScrollArea className="h-[400px]">
//                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1">
//                             {filteredCountries.map((country) => (
//                                 <div key={country.code} className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedCountries.includes(country.code) ? "bg-blue-50 border-blue-200" : ""}`} onClick={() => toggleCountry(country.code)}>
//                                     <Checkbox checked={selectedCountries.includes(country.code)} onCheckedChange={() => toggleCountry(country.code)} id={`country-${country.code}`} />
//                                     <Label htmlFor={`country-${country.code}`} className="cursor-pointer flex-1 min-w-0">
//                                         <div className="font-medium truncate" title={country.name}>
//                                             {country.name}
//                                         </div>
//                                         <div className="text-sm text-gray-500">{country.code}</div>
//                                     </Label>
//                                 </div>
//                             ))}
//                         </div>
//                     </ScrollArea>

//                     <DialogFooter>
//                         <div className="flex justify-between items-center w-full">
//                             <span className="text-sm text-gray-600">{selectedCountries.length} countries selected</span>
//                             <Button onClick={() => setIsCountrySelectorOpen(false)}>Done</Button>
//                         </div>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* View All Countries Dialog */}
//             <Dialog open={isViewCountriesDialogOpen} onOpenChange={setIsViewCountriesDialogOpen}>
//                 <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                     <DialogHeader>
//                         <DialogTitle>{selectedZoneForView?.name} - All Countries</DialogTitle>
//                         <DialogDescription>Total {selectedZoneForView?.countries.length} countries in this zone</DialogDescription>
//                     </DialogHeader>
//                     <div className="py-4">
//                         <div className="flex flex-wrap gap-2">
//                             {selectedZoneForView?.countries.map((countryCode: string, index: number) => {
//                                 const country = countriesList.find((c) => c.code === countryCode);
//                                 return (
//                                     <Badge key={`${countryCode}-${index}`} variant="outline" className="px-3 py-2">
//                                         {countryCode} {country && `(${country.name})`}
//                                     </Badge>
//                                 );
//                             })}
//                         </div>
//                         <div className="mt-4 text-sm text-gray-500">
//                             <p>
//                                 Copy all country codes: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedZoneForView?.countries.join(", ")}</span>
//                             </p>
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// };

// export default ZonesPage;

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedZoneForView, setSelectedZoneForView] = useState<any>(null);

  // Form states
  const [zoneName, setZoneName] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  // Pagination and filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [countryFilter, setCountryFilter] = useState("");

  // API hooks with pagination and country filter
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

  // Calculate indexes for showing results
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);

  // Filter countries based on search (for country selector dialog)
  const filteredCountries = countriesList.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  // Handle create zone
  const handleCreateZone = async () => {
    if (!zoneName.trim()) {
      toast.error("Zone name is required");
      return;
    }

    if (selectedCountries.length === 0) {
      toast.error("Please select at least one country");
      return;
    }

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

  // Handle edit zone
  const handleEditZone = async () => {
    if (!selectedZoneId || !zoneName.trim()) return;

    if (selectedCountries.length === 0) {
      toast.error("Please select at least one country");
      return;
    }

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

  // Open edit dialog
  const openEditDialog = (zone: any) => {
    setSelectedZoneId(zone.id);
    setZoneName(zone.name);
    setSelectedCountries(zone.countries);
    setIsEditDialogOpen(true);
  };

  // Open view countries dialog
  const openViewCountriesDialog = (zone: any) => {
    setSelectedZoneForView(zone);
    setIsViewCountriesDialogOpen(true);
  };

  // Toggle country selection
  const toggleCountry = (countryCode: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryCode)
        ? prev.filter((code) => code !== countryCode)
        : [...prev, countryCode],
    );
  };

  // Remove selected country
  const removeCountry = (countryCode: string) => {
    setSelectedCountries((prev) => prev.filter((code) => code !== countryCode));
  };

  // Reset form
  const resetForm = () => {
    setZoneName("");
    setSelectedCountries([]);
    setCountrySearch("");
    setSelectedZoneId(null);
    setSelectedZoneForView(null);
    setIsCountrySelectorOpen(false);
  };

  // Handle country filter change
  const handleCountryFilterChange = (value: string) => {
    const countryCode = value.toUpperCase().trim();
    setCountryFilter(countryCode);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear country filter
  const clearCountryFilter = () => {
    setCountryFilter("");
    setCurrentPage(1);
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
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= halfVisible + 1) {
        // Near the beginning
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
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

  const pageNumbers = generatePageNumbers();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#25324B]">Zones</h1>
          <p className="text-[#7C8493] text-lg">Loading zones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#25324B]">Zones</h1>
            <p className="text-[#7C8493] text-lg">
              Manage shipping zones and countries
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Country Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filter by country code (e.g., PL)"
                className="pl-10"
                value={countryFilter}
                onChange={(e) => handleCountryFilterChange(e.target.value)}
              />
              {countryFilter && (
                <button
                  type="button"
                  onClick={clearCountryFilter}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-[#0096FF] hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Zone</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="zoneName">Zone Name</Label>
                    <Input
                      id="zoneName"
                      placeholder="e.g., Europe Near"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Countries</Label>

                    {/* Selected countries display */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border rounded-md">
                      {selectedCountries.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No countries selected
                        </p>
                      ) : (
                        selectedCountries.map((countryCode) => {
                          const country = countriesList.find(
                            (c) => c.code === countryCode,
                          );
                          return (
                            <Badge
                              key={countryCode}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {country?.code} ({country?.name})
                              <button
                                type="button"
                                className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeCountry(countryCode);
                                }}
                              >
                                <XCircle className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })
                      )}
                    </div>

                    {/* Country selector button */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsCountrySelectorOpen(true)}
                    >
                      {selectedCountries.length === 0
                        ? "Select Countries"
                        : `Edit Countries (${selectedCountries.length} selected)`}
                    </Button>

                    <p className="text-xs text-gray-500">
                      Selected {selectedCountries.length} countries
                    </p>
                  </div>

                  <Button
                    onClick={handleCreateZone}
                    className="w-full bg-[#0096FF] hover:bg-blue-600"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Zone"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Zones Table */}
        <Card className="shadow-[0_4px_4px_0_rgba(0,0,0,0.12)]">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  All Zones
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {countryFilter
                    ? `Filtered by country: ${countryFilter} - `
                    : ""}
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)}{" "}
                  of {totalItems} zones
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EAEAEA]">
                    <TableHead className="font-bold text-gray-600">
                      ID
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Zone Name
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Countries
                    </TableHead>
                    <TableHead className="font-bold text-gray-600">
                      Status
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
                  {zones.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        {countryFilter
                          ? `No zones found with country code: ${countryFilter}`
                          : "No zones found. Create your first zone!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    zones.map((zone: any) => (
                      <TableRow key={zone._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{zone.id}</TableCell>
                        <TableCell className="font-medium">
                          {zone.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-md">
                            {zone.countries
                              .slice(0, 5)
                              .map((country: string) => (
                                <span
                                  key={country}
                                  className="bg-gray-100 px-2 py-1 rounded text-xs"
                                >
                                  {country}
                                </span>
                              ))}
                            {zone.countries.length > 5 && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500 text-xs">
                                  +{zone.countries.length - 5} more
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => openViewCountriesDialog(zone)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${zone.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {zone.isActive ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(zone.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(zone)}
                              className="h-8"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            {zone.countries.length > 5 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openViewCountriesDialog(zone)}
                                className="h-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
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
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
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

      {/* Edit Zone Dialog */}
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
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editZoneName">Zone Name</Label>
              <Input
                id="editZoneName"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Countries</Label>

              {/* Selected countries display */}
              <div className="flex flex-wrap gap-2 mb-3 min-h-10 p-2 border rounded-md">
                {selectedCountries.length === 0 ? (
                  <p className="text-gray-500 text-sm">No countries selected</p>
                ) : (
                  selectedCountries.map((countryCode) => {
                    const country = countriesList.find(
                      (c) => c.code === countryCode,
                    );
                    return (
                      <Badge
                        key={countryCode}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {country?.code} ({country?.name})
                        <button
                          type="button"
                          className="hover:bg-gray-300 rounded-full p-0.5 ml-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeCountry(countryCode);
                          }}
                        >
                          <XCircle className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                )}
              </div>

              {/* Country selector button */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsCountrySelectorOpen(true)}
              >
                {selectedCountries.length === 0
                  ? "Select Countries"
                  : `Edit Countries (${selectedCountries.length} selected)`}
              </Button>

              <p className="text-xs text-gray-500">
                Selected {selectedCountries.length} countries
              </p>
            </div>

            <Button
              onClick={handleEditZone}
              className="w-full bg-[#0096FF] hover:bg-blue-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Zone"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Country Selector Dialog */}
      <Dialog
        open={isCountrySelectorOpen}
        onOpenChange={setIsCountrySelectorOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Countries</DialogTitle>
            <DialogDescription>
              Choose countries to include in this zone
            </DialogDescription>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search countries by name or code..."
              className="pl-10"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-1">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedCountries.includes(country.code) ? "bg-blue-50 border-blue-200" : ""}`}
                  onClick={() => toggleCountry(country.code)}
                >
                  <Checkbox
                    checked={selectedCountries.includes(country.code)}
                    onCheckedChange={() => toggleCountry(country.code)}
                    id={`country-${country.code}`}
                  />
                  <Label
                    htmlFor={`country-${country.code}`}
                    className="cursor-pointer flex-1 min-w-0"
                  >
                    <div className="font-medium truncate" title={country.name}>
                      {country.name}
                    </div>
                    <div className="text-sm text-gray-500">{country.code}</div>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <span className="text-sm text-gray-600">
                {selectedCountries.length} countries selected
              </span>
              <Button onClick={() => setIsCountrySelectorOpen(false)}>
                Done
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Countries Dialog */}
      <Dialog
        open={isViewCountriesDialogOpen}
        onOpenChange={setIsViewCountriesDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedZoneForView?.name} - All Countries
            </DialogTitle>
            <DialogDescription>
              Total {selectedZoneForView?.countries.length} countries in this
              zone
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-wrap gap-2">
              {selectedZoneForView?.countries.map(
                (countryCode: string, index: number) => {
                  const country = countriesList.find(
                    (c) => c.code === countryCode,
                  );
                  return (
                    <Badge
                      key={`${countryCode}-${index}`}
                      variant="outline"
                      className="px-3 py-2"
                    >
                      {countryCode} {country && `(${country.name})`}
                    </Badge>
                  );
                },
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <p>
                Copy all country codes:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {selectedZoneForView?.countries.join(", ")}
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZonesPage;
