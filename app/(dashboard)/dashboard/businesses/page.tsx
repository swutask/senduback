"use client";

import { Download, Search, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BusinessDetailView } from "@/lib/modal/business-betail-view";
import { BusinessItemsView } from "@/lib/modal/BusinessItemsView";
import {
  useDeleteUserMutation,
  useGetUsersByRoleQuery,
} from "@/redux/features/user/userApi";
import Link from "next/link";

export default function Businesses() {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [currentView, setCurrentView] = useState<
    "detail" | "items" | "manage" | null
  >(null);

  const { data, isLoading } = useGetUsersByRoleQuery({
    role: "business",
    page: currentPage,
    limit: rowsPerPage,
  });

  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteBusiness = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This business will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteUser(id).unwrap();
      await Swal.fire({
        title: "Deleted!",
        text: "The business has been deleted.",
        icon: "success",
      });
    } catch (err: any) {
      await Swal.fire({
        title: "Error!",
        text: err?.data?.message || "Failed to delete the business.",
        icon: "error",
      });
    }
  };

  console.log(data);

  console.log("data", data);

  const businesses = data?.data?.users || [];
  const meta = data?.data?.meta;

  const filteredBusinesses = businesses.filter((business: any) => {
    const term = searchTerm.toLowerCase();
    const bName = (
      business.businessDetails?.businessName ||
      `${business.firstName} ${business.lastName}`
    ).toLowerCase();
    const bCity = (business.businessDetails?.city || "").toLowerCase();
    const bEmail = (business.email || "").toLowerCase();

    return (
      (bName.includes(term) || bCity.includes(term) || bEmail.includes(term)) &&
      (statusFilter === "All" ||
        business.status.toLowerCase() === statusFilter.toLowerCase())
    );
  });

  const totalPages = meta?.totalPage || 1;

  const clearFilters = () => {
    setStatusFilter("All");
    setTypeFilter("All");
    setCountryFilter("All");
    setSearchTerm("");
  };

  return (
    <div className="w-[92vw] md:w-[780px] lg:w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Registered Businesses
          </h1>
          <p className="text-sm text-gray-600">
            Manage all businesses registered with SendUBack
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add Business
          </Button> */}
        </div>
      </div>
      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by business name, city, or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Active", "Pending", "Suspended"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {["All", "Hotel", "Airport", "Company"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {["All", "USA", "UK", "Japan", "France", "Germany"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm ||
            statusFilter !== "All" ||
            typeFilter !== "All" ||
            countryFilter !== "All") && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-blue-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="">
          <Table className="w-full">
            <TableHeader className="h-12 bg-gray-50 border-b border-gray-100">
              <TableRow>
                {[
                  "Business Name",
                  "Type",
                  "Location",
                  "Status",
                  "Lost Items",
                  "Awaiting Label",
                  "Active Shipments",
                  "Last Activity",
                  "Actions",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="px-3 py-3 text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    Loading businesses...
                  </TableCell>
                </TableRow>
              ) : filteredBusinesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    No businesses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBusinesses.map((b: any) => (
                  <TableRow key={b._id} className="hover:bg-gray-50">
                    <TableCell className="px-3 py-4 font-medium">
                      {b.businessDetails?.businessName ||
                        `${b.firstName} ${b.lastName}`}
                    </TableCell>
                    <TableCell className="px-3 py-4 text-sm text-gray-600">
                      Business
                    </TableCell>
                    <TableCell className="px-3 py-4 text-sm text-gray-600">
                      {(() => {
                        const address = `${b.businessDetails?.city || "N/A"}, ${
                          b.businessDetails?.country || "N/A"
                        }`;

                        return address.length > 15
                          ? `${address.slice(0, 15)}...`
                          : address;
                      })()}
                    </TableCell>

                    <TableCell className="px-3 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          b.status === "active"
                            ? "bg-green-100 text-green-700"
                            : b.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      {b.lostItems || 0}
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      {b.awaitingLabel || 0}
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      {b.activeShipments || 0}
                    </TableCell>
                    <TableCell className="px-3 py-4 text-sm text-gray-500">
                      {b.updatedAt
                        ? new Date(b.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedBusinessId(b._id);
                            setCurrentView("items");
                          }}
                        >
                          View Items
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedBusinessId(b._id);
                            setCurrentView("detail");
                          }}
                        >
                          View
                        </Button>

                        <Link href={`/dashboard/businesses/${b._id}`}>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedBusiness(b);
                              setCurrentView("manage");
                            }}
                          >
                            Manage
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBusiness(b._id)}
                        >
                          Delete
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
        <div className="px-3 py-4 border-t border-gray-100 flex justify-between items-center">
          <Select
            value={String(rowsPerPage)}
            onValueChange={(v) => {
              setRowsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Views */}
      {currentView === "detail" && selectedBusinessId && (
        <BusinessDetailView
          businessId={selectedBusinessId}
          onClose={() => {
            setSelectedBusinessId(null);
            setCurrentView(null);
          }}
        />
      )}

      {/* View Item MOdal */}
      {currentView === "items" && selectedBusinessId && (
        <BusinessItemsView
          businessId={selectedBusinessId}
          onClose={() => {
            setSelectedBusinessId(null);
            setCurrentView(null);
          }}
        />
      )}
    </div>
  );
}
