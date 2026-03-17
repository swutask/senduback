"use client";

import { Building2, Calendar, ChevronRight, Mail, MapPin } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import Image from "next/image";

interface BusinessDetailViewProps {
  businessId: string;
  onClose: () => void;
  onViewItems?: () => void;
  onManage?: () => void;
}

export function BusinessDetailView({
  businessId,
  onClose,
}: BusinessDetailViewProps) {
  console.log("businessId", businessId);

  const { data: response, isLoading } = useGetUserByIdQuery(businessId);

  console.log("user", response);

  // Extract user data from API response
  const userData = response?.data;
  const businessDetails = userData?.businessDetails;

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="w-full md:min-w-3xl lg:min-w-4xl h-3/4 p-0 overflow-hidden bg-white rounded-xl">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading business details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-full md:min-w-3xl lg:min-w-4xl h-3/4 p-0 overflow-hidden bg-white rounded-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
              {userData?.image ? (
                <Image
                  src={userData.image}
                  alt={businessDetails?.businessName || "Business"}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              ) : (
                <span className="text-blue-600 text-2xl">🏢</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {businessDetails?.businessName ||
                  `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
                  "Business"}
              </h2>
              <p className="text-sm text-gray-500">{userData?.role || "N/A"}</p>
            </div>
          </div>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button> */}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-6">
            <Badge
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(userData?.status || "")}`}
            >
              {userData?.status || "Unknown"}
            </Badge>
            {userData?.verified && (
              <Badge className="ml-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                Verified
              </Badge>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50 p-4 rounded-lg shadow-none border-none">
              <div className="text-2xl font-bold text-blue-600">
                {userData?.totalLostItem || 0}
              </div>
              <div className="text-sm text-gray-600">Lost Items</div>
            </Card>

            <Card className="bg-orange-50 p-4 rounded-lg shadow-none border-none">
              <div className="text-2xl font-bold text-orange-600">
                {userData?.activeShipmentsPaymentCompleted || 0}
              </div>
              <div className="text-sm text-gray-600">Payment Completed</div>
            </Card>

            <Card className="bg-green-50 p-4 rounded-lg shadow-none border-none">
              <div className="text-2xl font-bold text-green-600">
                {userData?.activeShipmentsInTransit || 0}
              </div>
              <div className="text-sm text-gray-600">In Transit</div>
            </Card>
          </div>

          {/* Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-50 p-4 rounded-lg shadow-none border-none">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Details
              </h4>
              <div className="space-y-3">
                <Info
                  label="Business Name"
                  value={businessDetails?.businessName || "N/A"}
                />
                <Info label="Email" value={userData?.email || "N/A"} />
                <Info
                  label="Business ID"
                  value={userData?._id?.slice(-8) || "N/A"}
                />
              </div>
            </Card>

            <Card className="bg-gray-50 p-4 rounded-lg shadow-none border-none">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </h4>
              <div className="space-y-3">
                <Info label="City" value={businessDetails?.city || "N/A"} />
                <Info
                  label="Country"
                  value={businessDetails?.country || "N/A"}
                />
                <Info
                  label="Full Address"
                  value={
                    `${businessDetails?.addressLine1 || ""}${businessDetails?.addressLine2 ? ", " + businessDetails.addressLine2 : ""}`.trim() ||
                    "N/A"
                  }
                />
              </div>
            </Card>

            <Card className="bg-gray-50 p-4 rounded-lg shadow-none border-none">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Information
              </h4>
              <div className="space-y-3">
                <Info
                  label="Business Email"
                  value={businessDetails?.businessEmail || "N/A"}
                />
                <Info
                  label="Phone"
                  value={businessDetails?.telephone || "N/A"}
                />
                <Info
                  label="Postcode"
                  value={businessDetails?.postcode || "N/A"}
                />
              </div>
            </Card>

            <Card className="bg-gray-50 p-4 rounded-lg shadow-none border-none">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Activity
              </h4>
              <div className="space-y-3">
                <Info
                  label="Last Updated"
                  value={formatDate(userData?.updatedAt || "")}
                />
                <Info
                  label="Registration Date"
                  value={formatDate(userData?.createdAt || "")}
                />
                <Info
                  label="Business Completed"
                  value={formatDate(businessDetails?.completedAt || "")}
                />
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-50 p-4 rounded-lg shadow-none border-none mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account Information
            </h4>

            <div className="space-y-3">
              <Activity
                color={userData?.verified ? "bg-green-500" : "bg-yellow-500"}
                title={
                  userData?.verified
                    ? "Account Verified"
                    : "Account Not Verified"
                }
                time={formatDate(userData?.createdAt || "")}
              />
              <Activity
                color={
                  userData?.businessDetailsCompleted
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
                title={
                  userData?.businessDetailsCompleted
                    ? "Business Details Completed"
                    : "Business Details Pending"
                }
                time={formatDate(businessDetails?.completedAt || "")}
              />
            </div>
          </Card>

          {/* Actions */}
          {/* <div className="flex gap-3 border-t border-gray-200 pt-6">
            <Button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100">
              View All Items
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>

            <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              Manage Business
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- helpers ---------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function Activity({
  color,
  title,
  time,
}: {
  color: string;
  title: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
      <div className={`w-2 h-2 rounded-full mt-1.5 ${color}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
